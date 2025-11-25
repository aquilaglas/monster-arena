import { type NextRequest, NextResponse } from "next/server"
import { initializePlayer, getPlayer, getOwnedMonsters, getNextOpponent } from "@/lib/game-state"

export async function POST(request: NextRequest) {
  try {
    const { playerId, playerMonsterId } = await request.json()

    if (!playerId || !playerMonsterId) {
      return NextResponse.json({ error: "playerId and playerMonsterId are required" }, { status: 400 })
    }

    initializePlayer(playerId)

    const player = getPlayer(playerId)
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    const ownedMonsters = getOwnedMonsters(playerId)
    const playerMonster = ownedMonsters.find((m) => m.id === playerMonsterId)

    if (!playerMonster) {
      return NextResponse.json({ error: "Monster not found or not owned" }, { status: 404 })
    }

    const playerMonsterForCombat = {
      ...playerMonster,
      health: playerMonster.maxHealth,
    }

    const enemyMonster = getNextOpponent(playerId, player.totalBattles + 1)

    return NextResponse.json({
      success: true,
      playerMonster: playerMonsterForCombat,
      enemyMonster,
      tierBattleNumber: player.totalBattles + 1,
    })
  } catch (error) {
    console.error("Combat start error:", error)
    return NextResponse.json({ error: "Failed to start combat" }, { status: 500 })
  }
}
