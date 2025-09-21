
import React, { useRef, useEffect } from 'react';
import type { GameState } from '../types';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.fillStyle = '#0a0e14';
    context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Grid
    context.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    context.lineWidth = 1;
    for (let i = 0; i < GAME_WIDTH; i += 40) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, GAME_HEIGHT);
      context.stroke();
    }
    for (let i = 0; i < GAME_HEIGHT; i += 40) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(GAME_WIDTH, i);
        context.stroke();
    }

    const { player, enemies, xpOrbs, projectiles } = gameState;

    // Draw pickup radius
    context.beginPath();
    context.arc(player.position.x, player.position.y, player.pickupRadius, 0, 2 * Math.PI);
    context.fillStyle = 'rgba(0, 255, 255, 0.08)';
    context.fill();
    context.strokeStyle = 'rgba(0, 255, 255, 0.15)';
    context.stroke();

    // Draw XP Orbs
    xpOrbs.forEach(orb => {
      context.beginPath();
      context.arc(orb.position.x, orb.position.y, 4, 0, 2 * Math.PI);
      context.fillStyle = '#f0ff4d';
      context.fill();
    });

    // Draw Player
    context.beginPath();
    context.arc(player.position.x, player.position.y, player.size, 0, 2 * Math.PI);
    context.fillStyle = '#00f2ff';
    context.fill();

    // Draw Enemies
    enemies.forEach(enemy => {
      context.beginPath();
      context.arc(enemy.position.x, enemy.position.y, enemy.size, 0, 2 * Math.PI);
      context.fillStyle = '#ff2e88';
      context.fill();
    });

    // Draw Projectiles
    projectiles.forEach(p => {
        context.beginPath();
        context.arc(p.position.x, p.position.y, p.size, 0, 2 * Math.PI);
        context.fillStyle = '#9eff4d';
        context.fill();
    });

  }, [gameState]);

  return <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="rounded-lg shadow-2xl shadow-cyan-500/20" />;
};

export default GameCanvas;
