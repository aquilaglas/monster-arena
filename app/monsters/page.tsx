"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { PlayerStats } from "@/components/player-stats"
import { useGameState } from "@/hooks/use-game-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonsterCard } from "@/components/monster-card"

export default function MonstersPage() {
  const { player, monsters, loading, error, initializeGame, trainMonster, fetchPlayerStatus } = useGameState()
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingMessage, setTrainingMessage] = useState<string | null>(null)

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const handleTrain = async () => {
    if (!selectedMonster || !player) return

    if (player.money < 20) {
      setTrainingMessage("Vous n'avez pas assez de pièces (20 requises)")
      return
    }

    setIsTraining(true)
    setTrainingMessage(null)

    // Simulate training animation
    setTimeout(async () => {
      const success = await trainMonster(selectedMonster)
      if (success) {
        setTrainingMessage("Entraînement réussi! Les statistiques du monstre se sont améliorées.")
        await fetchPlayerStatus()
      } else {
        setTrainingMessage("Erreur lors de l'entraînement.")
      }
      setIsTraining(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Mes Monstres" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">Chargement...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Mes Monstres" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-error">Erreur: {error}</div>
        </main>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Mes Monstres" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">Impossible de charger les données</div>
        </main>
      </div>
    )
  }

  const selectedMonsterData = monsters.find((m) => m.id === selectedMonster)

  return (
    <div className="min-h-screen bg-background">
      <Header title="Mes Monstres" showBack={true} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <PlayerStats player={player} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monster List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-4">Vos Monstres ({monsters.length})</h2>
            {monsters.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-foreground/70">
                  Vous n'avez pas de monstres. Visitez la boutique!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monsters.map((monster) => (
                  <MonsterCard
                    key={monster.id}
                    monster={monster}
                    isSelected={selectedMonster === monster.id}
                    onSelect={() => setSelectedMonster(monster.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Training Panel */}
          {selectedMonsterData && (
            <Card className="lg:col-span-1 h-fit sticky top-4">
              <CardHeader>
                <CardTitle className="text-primary">Entraînement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedMonsterData.name}</h3>
                  <p className="text-sm text-foreground/70 mb-4">Améliorez les statistiques de votre monstre</p>
                </div>

                <div className="bg-neutral-700 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Coût:</span>
                    <span className="text-accent-light font-bold">20 Pièces</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-foreground/70">Vos Pièces:</span>
                    <span className={`font-bold ${player.money >= 20 ? "text-success" : "text-error"}`}>
                      {player.money}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm bg-neutral-700 p-3 rounded">
                  <p className="font-semibold text-primary mb-2">Amélioration attendue:</p>
                  <div className="space-y-1 text-foreground/80">
                    <div>Attaque: +5%</div>
                    <div>Défense: +5%</div>
                    <div>Vitesse: +5%</div>
                    <div>PV: +8%</div>
                  </div>
                </div>

                {trainingMessage && (
                  <div
                    className={`p-3 rounded text-sm text-center ${
                      trainingMessage.includes("réussi") ? "bg-success/20 text-success" : "bg-error/20 text-error"
                    }`}
                  >
                    {trainingMessage}
                  </div>
                )}

                <Button
                  onClick={handleTrain}
                  disabled={isTraining || !selectedMonster || player.money < 20}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-10 font-semibold"
                >
                  {isTraining ? "Entraînement..." : "Entraîner"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
