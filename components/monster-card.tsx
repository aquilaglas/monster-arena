"use client"

import type { Monster } from "@/types/game"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MonsterCardProps {
  monster: Monster
  onSelect?: () => void
  isSelected?: boolean
}

export function MonsterCard({ monster, onSelect, isSelected = false }: MonsterCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary/20 ring-2 ring-primary" : "hover:border-primary/50 hover:bg-neutral-700"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">{monster.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-square bg-neutral-700 rounded flex items-center justify-center text-foreground/50 text-sm">
          {monster.image === "/images/dragon-fire.svg" ? "🐉" : "⚔️"}
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Niveau:</span>
            <span className="text-accent-light font-semibold">{monster.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Type:</span>
            <span className="text-primary capitalize">{monster.type}</span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-foreground/60">PV: {monster.health}</span>
            <span className="text-foreground/60">/ {monster.maxHealth}</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all"
              style={{
                width: `${(monster.health / monster.maxHealth) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2">
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
            <div className="text-foreground/60">Humeur</div>
            <div className="text-accent-light capitalize text-xs">{monster.mood}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
