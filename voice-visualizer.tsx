"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface VoiceVisualizerProps {
  isActive: boolean
  audioLevel: number
}

export function VoiceVisualizer({ isActive, audioLevel }: VoiceVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0))

  useEffect(() => {
    if (!isActive) {
      setBars(Array(12).fill(0))
      return
    }

    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 100 + audioLevel * 50))
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, audioLevel])

  return (
    <div className="flex justify-center items-end gap-1 h-16 px-4">
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            "w-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm transition-all duration-100 ease-out",
            !isActive && "opacity-30",
          )}
          style={{
            height: `${Math.max(4, height)}%`,
            animationDelay: `${index * 50}ms`,
          }}
        />
      ))}
    </div>
  )
}
