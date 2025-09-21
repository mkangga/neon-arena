
import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import MainMenu from './components/MainMenu';
import PauseMenu from './components/PauseMenu';
import GameOverScreen from './components/GameOverScreen';
import UpgradeScreen from './components/UpgradeScreen';
import useGameLoop from './hooks/useGameLoop';
import useKeyboardInput from './hooks/useKeyboardInput';
import { GameStatus } from './types';
import { UPGRADES } from './constants';
import type { Upgrade } from './types';

const App: React.FC = () => {
  const { gameState, dispatch, resetGame } = useGameLoop();
  const activeKeys = useKeyboardInput();
  const [selectedUpgrades, setSelectedUpgrades] = useState<Upgrade[]>([]);

  useEffect(() => {
    if (gameState.status === GameStatus.Playing) {
      dispatch({ type: 'SET_PLAYER_MOVEMENT', payload: { keys: activeKeys } });
    }
  }, [activeKeys, gameState.status, dispatch]);
  
  const handleStartGame = useCallback(() => {
    resetGame();
    setSelectedUpgrades([]);
    dispatch({ type: 'START_GAME' });
  }, [dispatch, resetGame]);
  
  const handleResumeGame = useCallback(() => {
    dispatch({ type: 'SET_STATUS', payload: GameStatus.Playing });
  }, [dispatch]);

  const handlePauseGame = useCallback(() => {
    if (gameState.status === GameStatus.Playing) {
      dispatch({ type: 'SET_STATUS', payload: GameStatus.Paused });
    }
  }, [gameState.status, dispatch]);

  useEffect(() => {
    if (activeKeys.has('p') || activeKeys.has('P')) {
        handlePauseGame();
    }
  }, [activeKeys, handlePauseGame]);

  const handleSelectUpgrade = useCallback((upgrade: Upgrade) => {
    setSelectedUpgrades(prev => [...prev, upgrade]);
    dispatch({ type: 'APPLY_UPGRADE', payload: upgrade });
    dispatch({ type: 'SET_STATUS', payload: GameStatus.Playing });
  }, [dispatch]);
  
  const getUpgradeChoices = (): Upgrade[] => {
      const available = UPGRADES.filter(u => !selectedUpgrades.find(su => su.id === u.id));
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
  };

  return (
    <div className="relative w-screen h-screen bg-gray-900 flex items-center justify-center font-mono select-none overflow-hidden">
      {gameState.status === GameStatus.MainMenu && <MainMenu onStart={handleStartGame} />}
      
      {gameState.status !== GameStatus.MainMenu && (
        <>
          <GameCanvas gameState={gameState} />
          <HUD gameState={gameState} />
        </>
      )}

      {gameState.status === GameStatus.LevelUp && <UpgradeScreen upgrades={getUpgradeChoices()} onSelect={handleSelectUpgrade} />}
      {gameState.status === GameStatus.Paused && <PauseMenu onResume={handleResumeGame} onRestart={handleStartGame} currentUpgrades={selectedUpgrades} />}
      {gameState.status === GameStatus.GameOver && <GameOverScreen score={gameState.timer} onRestart={handleStartGame} />}
    </div>
  );
};

export default App;
