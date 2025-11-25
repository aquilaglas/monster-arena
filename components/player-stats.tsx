"use client"

import type { Player } from "@/types/game"

interface PlayerStatsProps {
  player: Player
}

export function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-neutral-800 border border-border rounded-lg p-4">
        <div className="text-foreground/60 text-sm">Argent</div>
        <div className="text-2xl font-bold text-accent-light">{player.money}</div>
        <div className="text-xs text-foreground/50">Pièces</div>
      </div>

      <div className="bg-neutral-800 border border-border rounded-lg p-4">
        <div className="text-foreground/60 text-sm">Monstres</div>
        <div className="text-2xl font-bold text-primary">{player.ownedMonsters.length}</div>
        <div className="text-xs text-foreground/50">Possédés</div>
      </div>

      <div className="bg-neutral-800 border border-border rounded-lg p-4">
        <div className="text-foreground/60 text-sm">Tier</div>
        <div className="text-2xl font-bold text-success">{player.nextArenaTier}</div>
        <div className="text-xs text-foreground/50">Arène</div>
      </div>

      <div className="bg-neutral-800 border border-border rounded-lg p-4">
        <div className="text-foreground/60 text-sm">Victoires</div>
        <div className="text-2xl font-bold text-warning">{player.wins}</div>
        <div className="text-xs text-foreground/50">/ {player.totalBattles}</div>
      </div>
    </div>
  )
}
