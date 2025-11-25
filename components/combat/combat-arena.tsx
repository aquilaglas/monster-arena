"use client"

import { useEffect, useState } from "react"
import type { Monster } from "@/types/game"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsDisplay } from "@/components/stats-display"
import { CombatLog } from "@/components/combat/combat-log"

interface CombatArenaProps {
  playerMonsterId: string
  onBattleEnd: () => void
}

interface BattleAction {
  type: "player" | "enemy"
  damage: number
  isCritical: boolean
  action: string
}

export function CombatArena({ playerMonsterId, onBattleEnd }: CombatArenaProps) {
  const [playerMonster, setPlayerMonster] = useState<Monster | null>(null)
  const [enemyMonster, setEnemyMonster] = useState<Monster | null>(null)
  const [battleLog, setBattleLog] = useState<BattleAction[]>([])
  const [loading, setLoading] = useState(true)
  const [inCombat, setInCombat] = useState(false)
  const [battleOver, setBattleOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [reward, setReward] = useState(0)
  const PLAYER_ID = "player-1"

  useEffect(() => {
    const startCombat = async () => {
      try {
        const response = await fetch("/api/combat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: PLAYER_ID,
            playerMonsterId,
          }),
        })

        if (!response.ok) throw new Error("Failed to start combat")
        const data = await response.json()
        setPlayerMonster(data.playerMonster)
        setEnemyMonster(data.enemyMonster)
        setInCombat(true)
      } catch (error) {
        console.error("Combat start error:", error)
      } finally {
        setLoading(false)
      }
    }

    startCombat()
  }, [playerMonsterId])

  const performAction = async (action: "attack" | "defend") => {
    if (!playerMonster || !enemyMonster) return

    setInCombat(false)

    try {
      const response = await fetch("/api/combat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: PLAYER_ID,
          playerMonsterId: playerMonster.id,
          enemyMonsterId: enemyMonster.id,
          action,
        }),
      })

      if (!response.ok) throw new Error("Failed to perform action")
      const data = await response.json()

      // Update monsters
      setPlayerMonster(data.playerMonster)
      setEnemyMonster(data.enemyMonster)

      // Add to battle log
      const newLog: BattleAction[] = []
      if (data.result.playerDamage > 0) {
        newLog.push({
          type: "player",
          damage: data.result.playerDamage,
          isCritical: false,
          action: action === "attack" ? "Attaque" : "Défense",
        })
      }
      if (data.result.enemyDamage > 0) {
        newLog.push({
          type: "enemy",
          damage: data.result.enemyDamage,
          isCritical: false,
          action: "Contre-attaque",
        })
      }
      setBattleLog((prev) => [...prev, ...newLog])

      if (data.result.battleOver) {
        setBattleOver(true)
        setWinner(data.result.winner)
        setReward(data.reward)
      } else {
        setInCombat(true)
      }
    } catch (error) {
      console.error("Combat action error:", error)
      setInCombat(true)
    }
  }

  if (loading) {
    return <div className="text-center text-foreground/70">Préparation du combat...</div>
  }

  if (!playerMonster || !enemyMonster) {
    return <div className="text-center text-error">Erreur lors du chargement des monstres</div>
  }

  return (
    <div className="space-y-6">
      {/* Combat Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Monster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{playerMonster.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-neutral-700 rounded flex items-center justify-center text-4xl">🐉</div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Points de Vie</span>
                <span className="text-success font-semibold">
                  {playerMonster.health} / {playerMonster.maxHealth}
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-3">
                <div
                  className="bg-success h-3 rounded-full transition-all"
                  style={{
                    width: `${(playerMonster.health / playerMonster.maxHealth) * 100}%`,
                  }}
                />
              </div>
            </div>

            <StatsDisplay stats={playerMonster.stats} label="Statistiques" />
          </CardContent>
        </Card>

        {/* Enemy Monster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-error">{enemyMonster.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-neutral-700 rounded flex items-center justify-center text-4xl opacity-75">
              👹
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Points de Vie</span>
                <span className="text-error font-semibold">
                  {enemyMonster.health} / {enemyMonster.maxHealth}
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-3">
                <div
                  className="bg-error h-3 rounded-full transition-all"
                  style={{
                    width: `${(enemyMonster.health / enemyMonster.maxHealth) * 100}%`,
                  }}
                />
              </div>
            </div>

            <StatsDisplay stats={enemyMonster.stats} label="Statistiques" />
          </CardContent>
        </Card>
      </div>

      {/* Battle Log */}
      <CombatLog actions={battleLog} />

      {/* Battle Controls */}
      <div className="space-y-4">
        {!battleOver ? (
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              onClick={() => performAction("attack")}
              disabled={!inCombat}
              className="flex-1 bg-error hover:bg-error/90 text-white h-12 text-lg font-bold"
            >
              Attaquer
            </Button>
            <Button
              onClick={() => performAction("defend")}
              disabled={!inCombat}
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-lg font-bold"
            >
              Défendre
            </Button>
          </div>
        ) : (
          <Card className={`${winner === "player" ? "bg-success/20 border-success" : "bg-error/20 border-error"}`}>
            <CardContent className="pt-6 text-center space-y-4">
              <h3 className="text-2xl font-bold">{winner === "player" ? "Victoire!" : "Défaite..."}</h3>
              {winner === "player" && <p className="text-lg text-success font-semibold">+{reward} Pièces Gagnées!</p>}
              <Button onClick={onBattleEnd} className="w-full bg-primary hover:bg-primary/90 h-10">
                Retourner à l'Arène
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
