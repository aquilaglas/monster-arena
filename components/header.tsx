"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  showBack?: boolean
}

export function Header({ title, showBack = true }: HeaderProps) {
  return (
    <header className="bg-neutral-800 border-b border-border py-4 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link href="/">
              <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                ← Retour
              </Button>
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{title}</h1>
        </div>
      </div>
    </header>
  )
}
