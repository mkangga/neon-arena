
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm text-center">
      <h2 className="text-6xl font-bold text-red-500 mb-4 tracking-widest">SYSTEM FAILURE</h2>
      <p className="text-2xl text-gray-300 mb-2">You survived for:</p>
      <p className="text-5xl font-bold text-white mb-10">{formatTime(score)}</p>
      <button
        onClick={onRestart}
        className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl uppercase tracking-widest hover:bg-cyan-400 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default GameOverScreen;
