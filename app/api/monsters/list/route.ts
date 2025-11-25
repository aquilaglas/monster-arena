import { NextResponse } from "next/server"
import { getShopMonsters } from "@/lib/game-state"

export async function GET() {
  try {
    const monsters = getShopMonsters()
    return NextResponse.json({
      success: true,
      monsters,
    })
  } catch (error) {
    console.error("Monster list error:", error)
    return NextResponse.json({ error: "Failed to fetch monsters" }, { status: 500 })
  }
}
