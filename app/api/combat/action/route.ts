import { type NextRequest, NextResponse } from "next/server"
import { initializePlayer, getPlayer, getMonster, calculateDamage, updatePlayerProgress } from "@/lib/game-state"

export async function POST(request: NextRequest) {
  try {
    const { playerId, playerMonsterId, enemyMonsterId, action } = await request.json()

    console.log("[v0] [route.ts::POST]", playerId, playerMonsterId, enemyMonsterId)

    if (!playerId || !playerMonsterId || !enemyMonsterId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    initializePlayer(playerId)

    const player = getPlayer(playerId)
    const playerMonster = getMonster(playerMonsterId)
    const enemyMonster = getMonster(enemyMonsterId)

    if (!player || !playerMonster || !enemyMonster) {
      return NextResponse.json({ error: "Invalid combat state" }, { status: 400 })
    }

    const result = { playerDamage: 0, enemyDamage: 0, battleOver: false, winner: "" }

    const playerMonsterCopy = { ...playerMonster }
    const enemyMonsterCopy = { ...enemyMonster }

    if (action === "attack") {
      // Player attacks
      const { damage, isCritical } = calculateDamage(playerMonsterCopy, enemyMonsterCopy)
      enemyMonsterCopy.health = Math.max(0, enemyMonsterCopy.health - damage)
      result.playerDamage = damage

      if (enemyMonsterCopy.health <= 0) {
        result.battleOver = true
        result.winner = "player"
        const reward = updatePlayerProgress(playerId, true, player.totalBattles + 1)
        return NextResponse.json({
          success: true,
          result,
          reward,
          playerMonster: playerMonsterCopy,
          enemyMonster: enemyMonsterCopy,
        })
      }

      // Enemy counter-attack
      const { damage: enemyDamage } = calculateDamage(enemyMonsterCopy, playerMonsterCopy)
      playerMonsterCopy.health = Math.max(0, playerMonsterCopy.health - enemyDamage)
      result.enemyDamage = enemyDamage

      if (playerMonsterCopy.health <= 0) {
        result.battleOver = true
        result.winner = "enemy"
        updatePlayerProgress(playerId, false, player.totalBattles + 1)
        return NextResponse.json({
          success: true,
          result,
          reward: 0,
          playerMonster: playerMonsterCopy,
          enemyMonster: enemyMonsterCopy,
        })
      }
    } else if (action === "defend") {
      // Reduced damage on enemy counter-attack
      const { damage: enemyDamage } = calculateDamage(enemyMonsterCopy, playerMonsterCopy)
      const reducedDamage = Math.floor(enemyDamage * 0.6)
      playerMonsterCopy.health = Math.max(0, playerMonsterCopy.health - reducedDamage)
      result.enemyDamage = reducedDamage

      if (playerMonsterCopy.health <= 0) {
        result.battleOver = true
        result.winner = "enemy"
        updatePlayerProgress(playerId, false, player.totalBattles + 1)
      }
    }

    return NextResponse.json({
      success: true,
      result,
      reward: 0,
      playerMonster: playerMonsterCopy,
      enemyMonster: enemyMonsterCopy,
    })
  } catch (error) {
    console.error("Combat action error:", error)
    return NextResponse.json({ error: "Failed to process combat action" }, { status: 500 })
  }
}
