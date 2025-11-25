import { type NextRequest, NextResponse } from "next/server"
import { initializePlayer } from "@/lib/game-state"

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "playerId is required" }, { status: 400 })
    }

    const player = initializePlayer(playerId)
    return NextResponse.json({ success: true, player })
  } catch (error) {
    console.error("Player init error:", error)
    return NextResponse.json({ error: "Failed to initialize player" }, { status: 500 })
  }
}
