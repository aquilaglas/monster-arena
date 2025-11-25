"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MainMenu() {
  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-8 text-center">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-primary mb-2">Arène des Monstres</h1>
        <p className="text-foreground/70 text-lg">Entraînez, combattez et devenez le champion ultime</p>
      </div>

      <div className="space-y-3 pt-8">
        <Link href="/game" className="block">
          <Button className="w-full bg-primary hover:bg-primary-dark text-white h-12 text-lg">Commencer</Button>
        </Link>

        <Link href="/monsters" className="block">
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10 h-12 text-lg bg-transparent"
          >
            Mes Monstres
          </Button>
        </Link>

        <Link href="/shop" className="block">
          <Button
            variant="outline"
            className="w-full border-accent-light text-accent-light hover:bg-accent-light/10 h-12 text-lg bg-transparent"
          >
            Boutique
          </Button>
        </Link>
      </div>

      <div className="pt-8 border-t border-border">
        <p className="text-foreground/50 text-sm">v1.0.0 • © 2025 Monster Arena</p>
      </div>
    </div>
  )
}
