import ChessGame from "@/components/chess-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-0 sm:p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Chess Game</h1>
      <ChessGame />
    </main>
  )
}
