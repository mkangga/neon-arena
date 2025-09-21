
import React from 'react';
import type { GameState } from '../types';
import { GAME_WIDTH } from '../constants';

interface HUDProps {
  gameState: GameState;
}

const Bar: React.FC<{ value: number; maxValue: number; color: string; bgColor: string; label: string }> = ({ value, maxValue, color, bgColor, label }) => (
  <div className="w-full">
      <div className="text-sm uppercase text-gray-400">{label} {Math.ceil(value)} / {maxValue}</div>
      <div className={`w-full ${bgColor} rounded-full h-4 overflow-hidden border-2 border-gray-700`}>
          <div className={`${color} h-full rounded-full transition-all duration-300 ease-out`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
      </div>
  </div>
);


const HUD: React.FC<HUDProps> = ({ gameState }) => {
  const { player, timer, levelUpgrades } = gameState;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-8 flex flex-col justify-between" style={{maxWidth: `${GAME_WIDTH}px`, margin: '0 auto'}}>
      {/* Top Section: HP, XP, Timer */}
      <div className="w-full flex justify-between items-start gap-8">
        <div className="w-1/3 space-y-2">
            <Bar value={player.hp} maxValue={player.maxHp} color="bg-cyan-400" bgColor="bg-gray-800" label="Hull" />
        </div>
        <div className="text-center">
            <div className="text-6xl font-bold text-white tracking-widest">{formatTime(timer)}</div>
            <div className="text-xl text-gray-400">Level {player.level}</div>
        </div>
        <div className="w-1/3 space-y-2">
            <Bar value={player.xp} maxValue={player.xpToNextLevel} color="bg-yellow-300" bgColor="bg-gray-800" label="XP" />
        </div>
      </div>
      
      {/* Bottom Section: Upgrades */}
      <div className="w-full flex justify-center">
        <div className="flex gap-4">
            {levelUpgrades.map((upgrade, index) => (
                <div key={index} className="bg-gray-800/80 border border-cyan-500/50 rounded-lg p-2 text-center text-xs text-cyan-300 w-24">
                    {upgrade.name}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HUD;
