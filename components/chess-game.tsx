"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./chess-board"
import GameControls from "./game-controls"
import GameInfo from "./game-info"
import { initialBoardState, PieceType, PieceColor, type ChessPiece, type Position } from "@/lib/chess-types"
import { isValidMove, makeMove, isCheck, isCheckmate, isStalemate } from "@/lib/chess-rules"

export default function ChessGame() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoardState())
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>(PieceColor.WHITE)
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [gameStatus, setGameStatus] = useState<string>("ongoing")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [capturedPieces, setCapturedPieces] = useState<{
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }>({
    [PieceColor.WHITE]: [],
    [PieceColor.BLACK]: [],
  })

  // Calculate valid moves when a piece is selected
  useEffect(() => {
    if (selectedPiece) {
      const moves: Position[] = []
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isValidMove(board, selectedPiece, { row, col }, currentPlayer)) {
            moves.push({ row, col })
          }
        }
      }
      setValidMoves(moves)
    } else {
      setValidMoves([])
    }
  }, [selectedPiece, board, currentPlayer])

  // Check for check, checkmate, or stalemate after each move
  useEffect(() => {
    if (isCheckmate(board, currentPlayer)) {
      const winner = currentPlayer === PieceColor.WHITE ? "Black" : "White"
      setGameStatus(`checkmate-${winner}`)
    } else if (isStalemate(board, currentPlayer)) {
      setGameStatus("stalemate")
    } else if (isCheck(board, currentPlayer)) {
      setGameStatus(`check-${currentPlayer}`)
    } else {
      setGameStatus("ongoing")
    }
  }, [board, currentPlayer])

  const handleSquareClick = (position: Position) => {
    // If game is over, don't allow further moves
    if (gameStatus.includes("checkmate") || gameStatus === "stalemate") {
      return
    }

    const piece = board[position.row][position.col]

    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === position.row && selectedPiece.col === position.col) {
        setSelectedPiece(null)
        return
      }

      // If clicking on a valid move position
      if (validMoves.some((move) => move.row === position.row && move.col === position.col)) {
        const result = makeMove(board, selectedPiece, position)

        // Update captured pieces if a piece was captured
        if (result.capturedPiece) {
          setCapturedPieces((prev) => {
            const oppositeColor = currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE
            return {
              ...prev,
              [currentPlayer]: [...prev[currentPlayer], result.capturedPiece],
            }
          })
        }

        // Add move to history
        const fromNotation = `${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}`
        const toNotation = `${String.fromCharCode(97 + position.col)}${8 - position.row}`
        const pieceSymbol =
          board[selectedPiece.row][selectedPiece.col]?.type === PieceType.PAWN
            ? ""
            : board[selectedPiece.row][selectedPiece.col]?.type.charAt(0)

        setMoveHistory((prev) => [...prev, `${pieceSymbol}${fromNotation}-${toNotation}`])

        // Update board and switch player
        setBoard(result.newBoard)
        setCurrentPlayer((prev) => (prev === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE))
        setSelectedPiece(null)
      }
      // If clicking on another piece of the same color, select that piece instead
      else if (piece && piece.color === currentPlayer) {
        setSelectedPiece(position)
      }
    }
    // If no piece is selected and clicking on a piece of the current player's color
    else if (piece && piece.color === currentPlayer) {
      setSelectedPiece(position)
    }
  }

  const resetGame = () => {
    setBoard(initialBoardState())
    setCurrentPlayer(PieceColor.WHITE)
    setSelectedPiece(null)
    setValidMoves([])
    setGameStatus("ongoing")
    setMoveHistory([])
    setCapturedPieces({
      [PieceColor.WHITE]: [],
      [PieceColor.BLACK]: [],
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
      <div className="flex-1 flex flex-col items-center">
        <ChessBoard
          board={board}
          selectedPiece={selectedPiece}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
        />
        <GameControls onReset={resetGame} gameStatus={gameStatus} />
      </div>
      <div className="flex-1">
        <GameInfo
          currentPlayer={currentPlayer}
          gameStatus={gameStatus}
          moveHistory={moveHistory}
          capturedPieces={capturedPieces}
        />
      </div>
    </div>
  )
}
