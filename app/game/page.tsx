"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { PlayerStats } from "@/components/player-stats"
import { useGameState } from "@/hooks/use-game-state"
import { MonsterSelector } from "@/components/combat/monster-selector"
import { CombatArena } from "@/components/combat/combat-arena"
import { Button } from "@/components/ui/button"

export default function GamePage() {
  const { player, monsters, loading, error, initializeGame } = useGameState()
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null)
  const [inBattle, setInBattle] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Arène des Monstres" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">Chargement...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Arène des Monstres" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-error">Erreur: {error}</div>
        </main>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Arène des Monstres" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">Impossible de charger le joueur</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Arène des Monstres" showBack={true} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <PlayerStats player={player} />

        {inBattle && selectedMonsterId ? (
          <CombatArena
            playerMonsterId={selectedMonsterId}
            onBattleEnd={() => {
              setInBattle(false)
              setSelectedMonsterId(null)
            }}
          />
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Sélectionnez un Monstre pour Combattre</h2>
            <MonsterSelector monsters={monsters} selectedId={selectedMonsterId} onSelect={setSelectedMonsterId} />
            <Button
              onClick={() => setInBattle(true)}
              disabled={!selectedMonsterId}
              className="w-full bg-accent hover:bg-accent/90 text-background h-12 text-lg font-bold"
            >
              Commencer le Combat
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
