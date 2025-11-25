"use client"

import type { Monster } from "@/types/game"
import { MonsterCard } from "@/components/monster-card"

interface MonsterSelectorProps {
  monsters: Monster[]
  selectedId: string | null
  onSelect: (monsterId: string) => void
}

export function MonsterSelector({ monsters, selectedId, onSelect }: MonsterSelectorProps) {
  if (monsters.length === 0) {
    return (
      <div className="bg-neutral-800 border border-border rounded-lg p-8 text-center">
        <p className="text-foreground/70">Vous n'avez pas de monstres. Allez à la boutique!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {monsters.map((monster) => (
        <MonsterCard
          key={monster.id}
          monster={monster}
          isSelected={selectedId === monster.id}
          onSelect={() => onSelect(monster.id)}
        />
      ))}
    </div>
  )
}
