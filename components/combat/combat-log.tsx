"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BattleAction {
  type: "player" | "enemy"
  damage: number
  isCritical: boolean
  action: string
}

interface CombatLogProps {
  actions: BattleAction[]
}

export function CombatLog({ actions }: CombatLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Journal de Combat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {actions.length === 0 ? (
            <p className="text-foreground/50 text-sm">Le combat commence...</p>
          ) : (
            actions.map((action, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded ${
                  action.type === "player" ? "bg-primary/20 text-primary" : "bg-error/20 text-error"
                }`}
              >
                <span className="font-semibold">{action.type === "player" ? "Vous" : "Ennemi"}:</span> {action.action}
                {action.damage > 0 && (
                  <span>
                    {" "}
                    -{action.damage} dégâts
                    {action.isCritical && <span className="text-accent-light font-bold"> (CRITIQUE!)</span>}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
