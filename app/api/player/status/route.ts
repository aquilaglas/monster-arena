import { type NextRequest, NextResponse } from "next/server"
import { getPlayer, getOwnedMonsters } from "@/lib/game-state"

export async function GET(request: NextRequest) {
  try {
    const playerId = request.nextUrl.searchParams.get("playerId")

    if (!playerId) {
      return NextResponse.json({ error: "playerId is required" }, { status: 400 })
    }

    const player = getPlayer(playerId)
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    const monsters = getOwnedMonsters(playerId)

    return NextResponse.json({
      success: true,
      player,
      monsters,
    })
  } catch (error) {
    console.error("Player status error:", error)
    return NextResponse.json({ error: "Failed to fetch player status" }, { status: 500 })
  }
}
