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
    gameMode,
    acknowledgePass,
    executeMove,
    setGameMode,
    resetGame
  } = useOthello();

  const blackCount = board.filter((c) => c === 0).length;
  const whiteCount = board.filter((c) => c === 1).length;

  // Determine player labels based on game mode
  const blackLabel = gameMode === 'ai' ? 'You' : 'Black';
  const whiteLabel = gameMode === 'ai' ? 'AI' : 'White';

  // Determine status text & style
  let statusDisplay = '';
  let statusColor = 'text-neumorphism-text';

  if (winner !== null) {
    if (winner === 'Draw') statusDisplay = 'Draw';
    else if (winner === 0) statusDisplay = gameMode === 'ai' ? 'You Win!' : 'Black Wins!';
    else statusDisplay = gameMode === 'ai' ? 'AI Wins!' : 'White Wins!';
  } else {
    // If not game over
    if (gameMode === 'ai') {
      if (turn === 0) {
        statusDisplay = 'Your Turn';
      } else {
        statusDisplay = 'AI Thinking...';
        statusColor = 'text-neumorphism-accent';
      }
    } else {
      // Human vs Human mode
      statusDisplay = turn === 0 ? 'Black\'s Turn' : 'White\'s Turn';
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 lg:gap-16 p-4 bg-neumorphism-base">

      {/* Sidebar Controls (Left Side) - Slightly wider */}
      <div className="flex flex-col gap-6 w-full max-w-[240px]">

        {/* Game Mode Selector */}
        <div className="flex flex-col items-center justify-center p-5 gap-4 rounded-2xl bg-neumorphism-base shadow-neumorphism-flat">
          <h3 className="text-lg font-bold text-neumorphism-text">Game Mode</h3>
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => {
                setGameMode('ai');
                resetGame();
              }}
              className={`w-full py-2 px-4 font-bold text-sm rounded-xl transition-all duration-200 ${
                gameMode === 'ai'
                  ? 'text-white bg-blue-500 shadow-lg'
                  : 'text-neumorphism-text bg-neumorphism-base shadow-neumorphism-flat hover:shadow-neumorphism-pressed'
              }`}
            >
              vs AI
            </button>
            <button
              onClick={() => {
                setGameMode('human');
                resetGame();
              }}
              className={`w-full py-2 px-4 font-bold text-sm rounded-xl transition-all duration-200 ${
                gameMode === 'human'
                  ? 'text-white bg-blue-500 shadow-lg'
                  : 'text-neumorphism-text bg-neumorphism-base shadow-neumorphism-flat hover:shadow-neumorphism-pressed'
              }`}
            >
              vs Human
            </button>
          </div>
        </div>

        {/* Score Panel */}
        <div className="flex flex-row items-center justify-center gap-8 p-5 rounded-2xl bg-neumorphism-base shadow-neumorphism-flat">
          {/* Black Score */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 shadow-md"></div>
            <span className="text-3xl font-bold text-neumorphism-text">{blackCount}</span>
            <span className="text-lg font-bold text-neumorphism-text mt-1">{blackLabel}</span>
          </div>

          <div className="text-2xl font-bold text-gray-400 opacity-50 pb-8">-</div>

          {/* White Score */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-md"></div>
            <span className="text-3xl font-bold text-neumorphism-text">{whiteCount}</span>
            <span className="text-lg font-bold text-neumorphism-text mt-1">{whiteLabel}</span>
          </div>
        </div>

        {/* Unified Control Panel */}
        <div className="flex flex-col items-center justify-center p-5 gap-4 rounded-2xl bg-neumorphism-base shadow-neumorphism-flat">

          {/* Status Section */}
          <div className={`text-xl font-bold text-center break-words w-full min-h-[1.75rem] ${statusColor}`}>
            {statusDisplay}
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
        <PassPopup passType={passPopup} onAcknowledge={acknowledgePass} gameMode={gameMode} />
      )}

      {/* Result Popup */}
      <ResultPopup winner={winner} board={board} onRestart={resetGame} />
    </div>
  );
}
