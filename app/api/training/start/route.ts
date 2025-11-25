import { type NextRequest, NextResponse } from "next/server"
import { getPlayer, trainMonster, getOwnedMonsters } from "@/lib/game-state"

export async function POST(request: NextRequest) {
  try {
    const { playerId, monsterId } = await request.json()

    if (!playerId || !monsterId) {
      return NextResponse.json({ error: "playerId and monsterId are required" }, { status: 400 })
    }

    const success = trainMonster(playerId, monsterId)

    if (!success) {
      return NextResponse.json(
        {
          error: "Failed to train monster - insufficient funds or invalid monster",
        },
        { status: 400 },
      )
    }

    const player = getPlayer(playerId)
    const monsters = getOwnedMonsters(playerId)
    const trainedMonster = monsters.find((m) => m.id === monsterId)

    return NextResponse.json({
      success: true,
      player,
      trainedMonster,
      message: "Entraînement réussi! Les statistiques du monstre se sont améliorées.",
    })
  } catch (error) {
    console.error("Training error:", error)
    return NextResponse.json({ error: "Failed to train monster" }, { status: 500 })
  }
}
