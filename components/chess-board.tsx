"use client"

import type { ChessPiece, Position } from "@/lib/chess-types"
import ChessSquare from "./chess-square"

interface ChessBoardProps {
  board: (ChessPiece | null)[][]
  selectedPiece: Position | null
  validMoves: Position[]
  onSquareClick: (position: Position) => void
}

export default function ChessBoard({ board, selectedPiece, validMoves, onSquareClick }: ChessBoardProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  const isSelected = (row: number, col: number) => {
    return selectedPiece?.row === row && selectedPiece?.col === col
  }

  // Generate column labels (a-h)
  const columnLabels = Array.from({ length: 8 }, (_, i) => String.fromCharCode(97 + i))

  // Generate row labels (1-8)
  const rowLabels = Array.from({ length: 8 }, (_, i) => 8 - i)

  return (
    <div className="relative">
      <div className="grid grid-cols-[auto_repeat(8,1fr)] grid-rows-[repeat(8,1fr)_auto]">
        {/* Empty top-left corner */}
        <div className="w-6"></div>

        {/* Column labels (top) */}
        {columnLabels.map((label) => (
          <div key={`top-${label}`} className="flex justify-center items-center h-6 text-sm text-gray-600">
            {label}
          </div>
        ))}

        {/* Board with row labels */}
        {board.map((row, rowIndex) => (
          <>
            {/* Row label */}
            <div key={`label-${rowIndex}`} className="flex justify-center items-center w-6 text-sm text-gray-600">
              {rowLabels[rowIndex]}
            </div>

            {/* Chess squares */}
            {row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={{ row: rowIndex, col: colIndex }}
                isLight={(rowIndex + colIndex) % 2 === 0}
                isSelected={isSelected(rowIndex, colIndex)}
                isValidMove={isValidMove(rowIndex, colIndex)}
                onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
              />
            ))}
          </>
        ))}

        {/* Empty bottom-left corner */}
        <div className="w-6"></div>

        {/* Column labels (bottom) */}
        {columnLabels.map((label) => (
          <div key={`bottom-${label}`} className="flex justify-center items-center h-6 text-sm text-gray-600">
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
