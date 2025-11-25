import { type NextRequest, NextResponse } from "next/server"
import { getPlayer, buyMonster, getOwnedMonsters } from "@/lib/game-state"

export async function POST(request: NextRequest) {
  try {
    const { playerId, monsterId } = await request.json()

    if (!playerId || !monsterId) {
      return NextResponse.json({ error: "playerId and monsterId are required" }, { status: 400 })
    }

    const success = buyMonster(playerId, monsterId)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to buy monster - insufficient funds or invalid monster" },
        { status: 400 },
      )
    }

    const player = getPlayer(playerId)
    const monsters = getOwnedMonsters(playerId)

    return NextResponse.json({
      success: true,
      player,
      monsters,
      message: "Monstre acheté avec succès!",
    })
  } catch (error) {
    console.error("Shop buy error:", error)
    return NextResponse.json({ error: "Failed to complete purchase" }, { status: 500 })
  }
}
