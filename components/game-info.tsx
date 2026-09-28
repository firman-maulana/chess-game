"use client"

import { PieceColor, type ChessPiece } from "@/lib/chess-types"
import { getPieceSymbol } from "@/lib/chess-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GameInfoProps {
  currentPlayer: PieceColor
  gameStatus: string
  gameMode: "multiplayer" | "singleplayer"
  onGameModeChange: (mode: "multiplayer" | "singleplayer") => void
  isBotThinking?: boolean
  moveHistory: string[]
  capturedPieces: {
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }
}

export default function GameInfo({ currentPlayer, gameStatus, gameMode, onGameModeChange, isBotThinking = false, moveHistory, capturedPieces }: GameInfoProps) {
  const timedOut = gameStatus.startsWith("timeout-")
  const winner = timedOut ? gameStatus.split("-")[1] : null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="game-mode" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Game Mode
        </label>
        <div className="relative">
          <select
            id="game-mode"
            value={gameMode}
            onChange={(event) => onGameModeChange(event.target.value as "multiplayer" | "singleplayer")}
            disabled={gameStatus !== "not-started" && !gameStatus.includes("checkmate") && gameStatus !== "stalemate" && !gameStatus.startsWith("timeout-")}
            className="w-full appearance-none rounded-lg border border-border/80 bg-background px-3 py-2.5 pr-10 text-sm font-medium shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="multiplayer">Multiplayer</option>
            <option value="singleplayer">Singleplayer · Medium bot</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">⌄</span>
        </div>
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

          {isBotThinking ? (
            <p className="text-sm font-medium text-muted-foreground">Black sedang berpikir...</p>
          ) : timedOut ? (
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
