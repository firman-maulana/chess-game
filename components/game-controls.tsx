"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface GameControlsProps {
  onReset: () => void
  gameStatus: string
}

export default function GameControls({ onReset, gameStatus }: GameControlsProps) {
  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <Button onClick={onReset} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        New Game
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
