"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface GameControlsProps {
  onStart: () => void
  gameStatus: string
}

export default function GameControls({ onStart, gameStatus }: GameControlsProps) {
  const isFinished = gameStatus === "stalemate" || gameStatus.includes("checkmate") || gameStatus.startsWith("timeout-")
  const isStarted = gameStatus !== "not-started" && !isFinished

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <Button onClick={onStart} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        {isStarted ? "New Game" : "Start Game"}
      </Button>

      {gameStatus.includes("checkmate") && (
        <div className="text-xl font-bold text-red-600">Checkmate! {gameStatus.split("-")[1]} wins!</div>
      )}

      {gameStatus === "stalemate" && (
        <div className="text-xl font-bold text-amber-600">Stalemate! The game is a draw.</div>
      )}

      {gameStatus.includes("check") && <div className="text-lg font-semibold text-orange-600">Check!</div>}
    </div>
  )
}
