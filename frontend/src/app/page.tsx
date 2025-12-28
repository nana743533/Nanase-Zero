'use client';

import { Board } from '@/components/Board';
import { useOthello } from '@/hooks/useOthello';

export default function Home() {
  const { board, turn, isProcessing, winner, executeMove, resetGame } = useOthello();

  const statusText = winner === null
    ? `Turn: ${turn === 0 ? 'Black' : 'White'}`
    : `Winner: ${winner === 'Draw' ? 'Draw' : winner === 0 ? 'Black' : 'White'}`;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 p-4 bg-neumorphism-base">

      {/* Sidebar (Controls & Status) */}
      <div className="flex flex-col gap-6 w-full lg:w-64 order-2 lg:order-1">
        {/* Status Card */}
        <div className="flex flex-col items-center p-6 gap-4 rounded-xl bg-neumorphism-base shadow-neumorphism-flat">
          <div className="text-xl font-bold text-neumorphism-text">
            {statusText}
          </div>
          {isProcessing && (
            <div className="text-sm text-neumorphism-accent animate-pulse">
              AI Thinking...
            </div>
          )}
          <div className="w-full h-0.5 bg-gray-200 rounded-full" />
          <button
            onClick={resetGame}
            className="w-full px-6 py-3 font-bold transition-all duration-200 rounded-xl text-neumorphism-text bg-neumorphism-base shadow-neumorphism-flat hover:shadow-neumorphism-pressed active:translate-y-0.5"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="order-1 lg:order-2">
        <Board
          board={board}
          onCellClick={executeMove}
          disabled={isProcessing || winner !== null}
        />
      </div>
    </div>
  );
}
