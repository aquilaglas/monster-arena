"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { PlayerStats } from "@/components/player-stats"
import { useGameState } from "@/hooks/use-game-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Monster } from "@/types/game"

export default function ShopPage() {
  const { player, monsters, loading, error, initializeGame, buyMonster, fetchPlayerStatus } = useGameState()
  const [shopMonsters, setShopMonsters] = useState<Monster[]>([])
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    initializeGame()
    fetchShopMonsters()
  }, [initializeGame])

  const fetchShopMonsters = async () => {
    try {
      const response = await fetch("/api/monsters/list")
      if (!response.ok) throw new Error("Failed to fetch shop monsters")
      const data = await response.json()
      setShopMonsters(data.monsters)
    } catch (error) {
      console.error("Shop fetch error:", error)
    }
  }

  const handleBuy = async (monsterId: string) => {
    if (!player) return

    const monster = shopMonsters.find((m) => m.id === monsterId)
    if (!monster) return

    if (player.money < monster.cost) {
      setMessage("Vous n'avez pas assez de pièces!")
      return
    }

    if (player.ownedMonsters.includes(monsterId)) {
      setMessage("Vous possédez déjà ce monstre!")
      return
    }

    setPurchasing(monsterId)
    setMessage(null)

    const success = await buyMonster(monsterId)
    if (success) {
      setMessage(`${monster.name} ajouté à votre collection!`)
      await fetchPlayerStatus()
    } else {
      setMessage("Erreur lors de l'achat.")
    }
    setPurchasing(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Boutique" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">Chargement...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Boutique" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-error">Erreur: {error}</div>
        </main>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Boutique" showBack={true} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">Impossible de charger les données</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Boutique" showBack={true} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <PlayerStats player={player} />

        {message && (
          <Card className={message.includes("ajouté") ? "bg-success/20 border-success" : "bg-error/20 border-error"}>
            <CardContent className="pt-6">
              <p className={message.includes("ajouté") ? "text-success" : "text-error"}>{message}</p>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Monstres Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopMonsters.map((monster) => {
              const owned = monsters.some((m) => m.id === monster.id)
              const canAfford = player.money >= monster.cost

              return (
                <Card key={monster.id} className={owned ? "opacity-50" : ""}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">{monster.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-neutral-700 rounded flex items-center justify-center text-2xl">
                      ⚔️
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Type:</span>
                        <span className="text-primary capitalize">{monster.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Niveau:</span>
                        <span className="text-accent-light">{monster.level}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-neutral-700 p-2 rounded">
                        <div className="text-foreground/60">Attaque</div>
                        <div className="text-primary font-bold">{monster.stats.attack}</div>
                      </div>
                      <div className="bg-neutral-700 p-2 rounded">
                        <div className="text-foreground/60">Défense</div>
                        <div className="text-primary font-bold">{monster.stats.defense}</div>
                      </div>
                      <div className="bg-neutral-700 p-2 rounded">
                        <div className="text-foreground/60">Vitesse</div>
                        <div className="text-primary font-bold">{monster.stats.speed}</div>
                      </div>
                      <div className="bg-neutral-700 p-2 rounded">
                        <div className="text-foreground/60">PV</div>
                        <div className="text-primary font-bold">{monster.stats.hp}</div>
                      </div>
                    </div>

                    <div className="bg-neutral-700 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-accent-light">{monster.cost} Pièces</span>
                        <span
                          className={`text-xs font-semibold ${
                            player.money >= monster.cost ? "text-success" : "text-error"
                          }`}
                        >
                          {player.money} Disponibles
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuy(monster.id)}
                      disabled={owned || !canAfford || purchasing === monster.id}
                      className={`w-full h-10 font-semibold ${
                        owned
                          ? "bg-foreground/20 text-foreground/50 cursor-not-allowed"
                          : canAfford
                            ? "bg-accent hover:bg-accent/90 text-background"
                            : "bg-error/30 text-error/70 cursor-not-allowed"
                      }`}
                    >
                      {owned ? "Possédé" : purchasing === monster.id ? "Achat..." : "Acheter"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
