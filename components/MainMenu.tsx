
import React from 'react';

interface MainMenuProps {
  onStart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-gray-900/50 flex flex-col items-center justify-center z-20 text-center">
      <h1 className="text-7xl font-bold text-cyan-300 tracking-[0.2em] animate-pulse">NEON ARENA</h1>
      <p className="text-xl text-gray-400 mt-4 mb-12">Survive. Upgrade. Dominate.</p>
      <button
        onClick={onStart}
        className="bg-cyan-500 text-gray-900 font-bold py-4 px-10 rounded-lg text-2xl uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-lg shadow-cyan-500/20"
      >
        Start Run
      </button>
      <div className="mt-20 text-gray-500">
        <p>Controls:</p>
        <p>WASD/Arrows: Move</p>
        <p>P: Pause</p>
      </div>
    </div>
  );
};

export default MainMenu;
