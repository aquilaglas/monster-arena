"use client"

import type { ReactNode } from "react"

interface ButtonGroupProps {
  children: ReactNode
  className?: string
}

export function ButtonGroup({ children, className = "" }: ButtonGroupProps) {
  return <div className={`flex gap-3 flex-wrap ${className}`}>{children}</div>
}
