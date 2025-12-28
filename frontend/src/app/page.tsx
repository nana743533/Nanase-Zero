'use client';

import { Board } from '@/components/Board';
import { PassPopup } from '@/components/PassPopup';
import { ResultPopup } from '@/components/ResultPopup';
import { useOthello } from '@/hooks/useOthello';

export default function Home() {
  const {
    board,
    turn,
    isProcessing,
    winner,
    passPopup,
    acknowledgePass,
    executeMove,
    resetGame
  } = useOthello();

  const blackCount = board.filter((c) => c === 0).length;
  const whiteCount = board.filter((c) => c === 1).length;

  const statusText = winner === null
    ? `Turn: ${turn === 0 ? 'Black' : 'White'}`
    : `Winner: ${winner === 'Draw' ? 'Draw' : winner === 0 ? 'Black' : 'White'}`;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 lg:gap-16 p-4 bg-neumorphism-base">

      {/* Sidebar Controls (Left Side) - Slightly wider */}
      <div className="flex flex-col gap-6 w-full max-w-[240px]">

        {/* Score Panel */}
        <div className="flex flex-row items-center justify-center gap-8 p-5 rounded-2xl bg-neumorphism-base shadow-neumorphism-flat">
          {/* Black Score */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 shadow-md"></div>
            <span className="text-2xl font-bold text-neumorphism-text">{blackCount}</span>
          </div>

          <div className="text-2xl font-bold text-gray-400 opacity-50">-</div>

          {/* White Score */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-md"></div>
            <span className="text-2xl font-bold text-neumorphism-text">{whiteCount}</span>
          </div>
        </div>

        {/* Unified Control Panel */}
        <div className="flex flex-col items-center justify-center p-5 gap-4 rounded-2xl bg-neumorphism-base shadow-neumorphism-flat">

          {/* Status Section */}
          <div className="text-xl font-bold text-neumorphism-text text-center break-words w-full">
            {statusText}
          </div>

          {/* AI Thinking Indicator */}
          <div className={`text-sm font-bold text-neumorphism-accent transition-opacity duration-300 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}>
            {isProcessing ? "AI Thinking..." : " "}
          </div>

          {/* New Game Button */}
          <button
            onClick={resetGame}
            className="w-full py-3 font-bold text-lg rounded-xl text-neumorphism-text bg-neumorphism-base shadow-neumorphism-flat hover:shadow-neumorphism-pressed active:translate-y-0.5 transition-all duration-200"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game Board - Increased width */}
      <div className="w-full max-w-[700px] shrink-0">
        <Board
          board={board}
          onCellClick={executeMove}
          disabled={isProcessing || winner !== null}
        />
      </div>

      {/* Pass Check Popup */}
      {passPopup && (
        <PassPopup passType={passPopup} onAcknowledge={acknowledgePass} />
      )}

      {/* Result Popup */}
      <ResultPopup winner={winner} board={board} onRestart={resetGame} />
    </div>
  );
}
