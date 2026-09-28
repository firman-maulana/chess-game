"use client"

import { PieceColor, type ChessPiece } from "@/lib/chess-types"
import { getPieceSymbol } from "@/lib/chess-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GameInfoProps {
  currentPlayer: PieceColor
  gameStatus: string
  timeLeft: { [PieceColor.WHITE]: number; [PieceColor.BLACK]: number }
  moveHistory: string[]
  capturedPieces: {
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }
}

export default function GameInfo({ currentPlayer, gameStatus, timeLeft, moveHistory, capturedPieces }: GameInfoProps) {
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
  const timedOut = gameStatus.startsWith("timeout-")
  const winner = timedOut ? gameStatus.split("-")[1] : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[PieceColor.WHITE, PieceColor.BLACK].map((color) => {
          const isActive = currentPlayer === color && !timedOut
          const isExpired = timeLeft[color] === 0
          return (
            <Card key={color} className={isActive ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {color === PieceColor.WHITE ? "White" : "Black"}
                </p>
                <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${isExpired ? "text-destructive" : ""}`}>
                  {formatTime(timeLeft[color])}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{timedOut ? `${winner} menang berdasarkan waktu` : "Game Status"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded-full ${currentPlayer === PieceColor.WHITE ? "bg-white border border-gray-300" : "bg-black"}`}
            ></div>
            <span className="font-medium">{currentPlayer === PieceColor.WHITE ? "White" : "Black"}'s turn</span>
          </div>

          {timedOut ? (
            <p className="text-sm font-semibold text-green-600">Waktu {currentPlayer === PieceColor.WHITE ? "White" : "Black"} habis. {winner} menang!</p>
          ) : gameStatus === "ongoing" ? (
            <p className="text-sm text-gray-500">Game in progress</p>
          ) : gameStatus.includes("check") && !gameStatus.includes("checkmate") ? (
            <p className="text-sm text-orange-600 font-semibold">
              {gameStatus.split("-")[1] === PieceColor.WHITE ? "White" : "Black"} is in check!
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="moves">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="moves">Move History</TabsTrigger>
          <TabsTrigger value="captured">Captured Pieces</TabsTrigger>
        </TabsList>

        <TabsContent value="moves">
          <Card>
            <CardContent className="pt-4">
              {moveHistory.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                    <div key={i} className="col-span-2 grid grid-cols-2 border-b border-gray-100 py-1">
                      <div className="text-sm">
                        <span className="text-gray-500 mr-2">{i + 1}.</span>
                        {moveHistory[i * 2]}
                      </div>
                      {moveHistory[i * 2 + 1] && <div className="text-sm">{moveHistory[i * 2 + 1]}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No moves yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captured">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">White captured:</h3>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces[PieceColor.BLACK].length > 0 ? (
                      capturedPieces[PieceColor.BLACK].map((piece, i) => (
                        <span key={i} className="text-xl text-black">
                          {getPieceSymbol(piece)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Black captured:</h3>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces[PieceColor.WHITE].length > 0 ? (
                      capturedPieces[PieceColor.WHITE].map((piece, i) => (
                        <span key={i} className="text-xl text-white">
                          {getPieceSymbol(piece)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
