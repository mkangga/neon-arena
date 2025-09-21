
import React, { useState } from 'react';
import { getProTip } from '../services/geminiService';
import type { Upgrade } from '../types';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  currentUpgrades: Upgrade[];
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, currentUpgrades }) => {
  const [tip, setTip] = useState<string>('');
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(false);
  
  const handleGetTip = async () => {
    setIsLoadingTip(true);
    setTip('');
    const fetchedTip = await getProTip(currentUpgrades);
    setTip(fetchedTip);
    setIsLoadingTip(false);
  };
    
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm text-center">
      <h2 className="text-6xl font-bold text-white mb-10 tracking-widest">PAUSED</h2>
      <div className="flex flex-col gap-4 w-72">
        <button
          onClick={onResume}
          className="bg-cyan-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-xl uppercase tracking-widest hover:bg-cyan-400 transition-colors"
        >
          Resume
        </button>
        <button
          onClick={onRestart}
          className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl uppercase tracking-widest hover:bg-gray-600 transition-colors"
        >
          Restart
        </button>
        <button
          onClick={handleGetTip}
          disabled={isLoadingTip}
          className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-xl uppercase tracking-widest hover:bg-purple-500 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {isLoadingTip ? 'Thinking...' : 'Get AI Tip'}
        </button>
      </div>
      {tip && (
          <div className="mt-8 p-4 bg-gray-800 border border-purple-500 rounded-lg max-w-md">
            <h4 className="text-purple-300 font-bold mb-2">Gemini's Strategy Tip:</h4>
            <p className="text-gray-300">{tip}</p>
          </div>
      )}
    </div>
  );
};

export default PauseMenu;
