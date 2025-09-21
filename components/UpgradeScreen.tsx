
import React from 'react';
import type { Upgrade } from '../types';

interface UpgradeScreenProps {
  upgrades: Upgrade[];
  onSelect: (upgrade: Upgrade) => void;
}

const UpgradeCard: React.FC<{ upgrade: Upgrade; onSelect: () => void }> = ({ upgrade, onSelect }) => (
  <button
    onClick={onSelect}
    className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6 w-72 text-left hover:bg-cyan-900/50 hover:border-cyan-400 transition-all duration-200 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-cyan-300"
  >
    <h3 className="text-xl font-bold text-cyan-300 mb-2">{upgrade.name}</h3>
    <p className="text-gray-400">{upgrade.description}</p>
  </button>
);

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ upgrades, onSelect }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
      <h2 className="text-5xl font-bold text-white mb-4 tracking-widest">SYSTEM UPGRADE</h2>
      <p className="text-lg text-gray-400 mb-12">Choose a new component to install.</p>
      <div className="flex gap-8">
        {upgrades.map(upgrade => (
          <UpgradeCard key={upgrade.id} upgrade={upgrade} onSelect={() => onSelect(upgrade)} />
        ))}
        {upgrades.length === 0 && <p className="text-white">No more upgrades available!</p>}
      </div>
    </div>
  );
};

export default UpgradeScreen;
