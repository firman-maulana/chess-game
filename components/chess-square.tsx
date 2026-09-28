"use client"

import type { ChessPiece, Position } from "@/lib/chess-types"
import { getPieceSymbol } from "@/lib/chess-utils"
import { cn } from "@/lib/utils"

interface ChessSquareProps {
  piece: ChessPiece | null
  position: Position
  isLight: boolean
  isSelected: boolean
  isValidMove: boolean
  onClick: () => void
}

export default function ChessSquare({ piece, position, isLight, isSelected, isValidMove, onClick }: ChessSquareProps) {
  return (
    <div
      className={cn(
        "w-full aspect-square flex items-center justify-center text-3xl md:text-4xl relative cursor-pointer",
        isLight ? "bg-amber-100" : "bg-amber-800",
        isSelected && "bg-yellow-300",
      )}
      onClick={onClick}
      data-position={`${position.row}-${position.col}`}
    >
      {piece && (
        <span
          className={cn(
            "select-none",
            piece.color === "white" ? "text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" : "text-black",
          )}
        >
          {getPieceSymbol(piece)}
        </span>
      )}

      {isValidMove && !piece && <div className="absolute w-3 h-3 rounded-full bg-gray-500 opacity-50"></div>}

      {isValidMove && piece && <div className="absolute inset-0 border-4 border-gray-500 opacity-50 rounded-sm"></div>}
    </div>
  )
}
