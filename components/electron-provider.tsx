"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ElectronProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    const isRunningInElectron = typeof window !== "undefined" && !!(window as any).electron
    setIsElectron(isRunningInElectron)

    if (isRunningInElectron) {
      console.log("Running in Electron environment")
    }
  }, [])

  return <>{children}</>
}
