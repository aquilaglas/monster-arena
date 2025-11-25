"use client"

import { useState, useCallback } from "react"
import type { Player, Monster } from "@/types/game"

const PLAYER_ID = "player-1" // In production, use authenticated user ID

export function useGameState() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeGame = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/player/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: PLAYER_ID }),
      })

      if (!response.ok) throw new Error("Failed to initialize player")
      const data = await response.json()
      setPlayer(data.player)
      await fetchPlayerStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPlayerStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/player/status?playerId=${PLAYER_ID}`)
      if (!response.ok) throw new Error("Failed to fetch player status")
      const data = await response.json()
      setPlayer(data.player)
      setMonsters(data.monsters)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [])

  const buyMonster = useCallback(async (monsterId: string) => {
    try {
      const response = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: PLAYER_ID, monsterId }),
      })

      if (!response.ok) throw new Error("Failed to buy monster")
      const data = await response.json()
      setPlayer(data.player)
      setMonsters(data.monsters)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }, [])

  const trainMonster = useCallback(async (monsterId: string) => {
    try {
      const response = await fetch("/api/training/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: PLAYER_ID, monsterId }),
      })

      if (!response.ok) throw new Error("Failed to train monster")
      const data = await response.json()
      setPlayer(data.player)
      await fetchPlayerStatus()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }, [])

  return {
    player,
    monsters,
    loading,
    error,
    initializeGame,
    fetchPlayerStatus,
    buyMonster,
    trainMonster,
    PLAYER_ID,
  }
}
