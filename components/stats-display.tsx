"use client"

import type { MonsterStats } from "@/types/game"

interface StatsDisplayProps {
  stats: MonsterStats
  label?: string
}

export function StatsDisplay({ stats, label }: StatsDisplayProps) {
  const maxStat = 50

  return (
    <div className="space-y-3">
      {label && <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">{label}</h3>}

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/70">Attaque</span>
            <span className="text-accent-light font-semibold">{stats.attack}</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div className="bg-error h-2 rounded-full" style={{ width: `${(stats.attack / maxStat) * 100}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/70">Défense</span>
            <span className="text-accent-light font-semibold">{stats.defense}</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${(stats.defense / maxStat) * 100}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/70">Vitesse</span>
            <span className="text-accent-light font-semibold">{stats.speed}</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div className="bg-warning h-2 rounded-full" style={{ width: `${(stats.speed / maxStat) * 100}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/70">Points de Vie</span>
            <span className="text-accent-light font-semibold">{stats.hp}</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div className="bg-success h-2 rounded-full" style={{ width: `${(stats.hp / maxStat) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
