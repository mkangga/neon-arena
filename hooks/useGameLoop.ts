import { useReducer, useEffect, useRef, useCallback } from 'react';
import type { GameState, GameAction, Vector2D, Player, Enemy, XPOrb, Projectile, Upgrade } from '../types';
import { GameStatus, EnemyType } from '../types';
import { PLAYER_INITIAL_STATS, GAME_WIDTH, GAME_HEIGHT, ENEMY_STATS } from '../constants';
import * as V from '../utils/math';

const initialPlayerState: Player = {
  position: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
  velocity: { x: 0, y: 0 },
  ...PLAYER_INITIAL_STATS,
};

const initialGameState: GameState = {
  status: GameStatus.MainMenu,
  player: { ...initialPlayerState },
  enemies: [],
  xpOrbs: [],
  projectiles: [],
  timer: 0,
  enemySpawnCooldown: 3,
  levelUpgrades: [],
};

let nextEnemyId = 0;
let nextOrbId = 0;
let nextProjectileId = 0;
let attackCooldown = 0;

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      nextEnemyId = 0;
      nextOrbId = 0;
      nextProjectileId = 0;
      return {
        ...initialGameState,
        status: GameStatus.Playing,
        player: { ...initialPlayerState, position: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 } },
      };
    case 'RESET':
        return initialGameState;
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_PLAYER_MOVEMENT':
        const { keys } = action.payload;
        let moveDirection: Vector2D = { x: 0, y: 0 };
        if (keys.has('w') || keys.has('arrowup')) moveDirection.y -= 1;
        if (keys.has('s') || keys.has('arrowdown')) moveDirection.y += 1;
        if (keys.has('a') || keys.has('arrowleft')) moveDirection.x -= 1;
        if (keys.has('d') || keys.has('arrowright')) moveDirection.x += 1;

        const normalizedDir = V.normalize(moveDirection);
        return {
            ...state,
            player: {
                ...state.player,
                velocity: V.multiply(normalizedDir, state.player.moveSpeed),
            },
        };

    case 'APPLY_UPGRADE':
        const newStats = action.payload.apply(state.player);
        return {
            ...state,
            player: { ...state.player, ...newStats },
        };
        
    case 'TICK':
        if (state.status !== GameStatus.Playing) return state;
        const { deltaTime } = action.payload;
        
        let newState = { ...state };
        
        // Update Player
        newState.player.position = V.add(newState.player.position, V.multiply(newState.player.velocity, deltaTime));
        newState.player.position.x = Math.max(0, Math.min(GAME_WIDTH, newState.player.position.x));
        newState.player.position.y = Math.max(0, Math.min(GAME_HEIGHT, newState.player.position.y));
        
        // Player attack
        attackCooldown -= deltaTime;
        if (attackCooldown <= 0 && newState.enemies.length > 0) {
            attackCooldown = 1 / newState.player.attackSpeed;
            let closestEnemy: Enemy | null = null;
            let minDistance = Infinity;
            newState.enemies.forEach(enemy => {
                const dist = V.distance(newState.player.position, enemy.position);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestEnemy = enemy;
                }
            });
            if (closestEnemy) {
                const direction = V.normalize(V.subtract(closestEnemy.position, newState.player.position));
                newState.projectiles.push({
                    id: nextProjectileId++,
                    position: { ...newState.player.position },
                    velocity: V.multiply(direction, 500),
                    size: 5,
                    damage: newState.player.damage,
                    lifespan: 2,
                });
            }
        }

        // Update Projectiles
        newState.projectiles = newState.projectiles.map(p => ({
            ...p,
            position: V.add(p.position, V.multiply(p.velocity, deltaTime)),
            lifespan: p.lifespan - deltaTime,
        })).filter(p => p.lifespan > 0);

        // Update Enemies
        newState.enemies = newState.enemies.map(enemy => {
            const direction = V.normalize(V.subtract(newState.player.position, enemy.position));
            const newPos = V.add(enemy.position, V.multiply(direction, enemy.speed * deltaTime));
            return { ...enemy, position: newPos };
        });

        // Spawn Enemies
        newState.enemySpawnCooldown -= deltaTime;
        if (newState.enemySpawnCooldown <= 0) {
            newState.enemySpawnCooldown = Math.max(0.5, 3 - newState.timer / 30);
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.max(GAME_WIDTH / 2, GAME_HEIGHT / 2) + 50;
            const spawnPos = {
                x: GAME_WIDTH / 2 + Math.cos(angle) * radius,
                y: GAME_HEIGHT / 2 + Math.sin(angle) * radius,
            };
            const stats = ENEMY_STATS.CHASER;
            newState.enemies.push({
                id: nextEnemyId++,
                type: EnemyType.Chaser,
                position: spawnPos,
                velocity: { x: 0, y: 0 },
                size: stats.size,
                hp: stats.hp,
                maxHp: stats.hp,
                damage: stats.damage,
                speed: stats.speed,
            });
        }
        
        // Collisions
        // Projectile -> Enemy
        newState.projectiles.forEach(p => {
            newState.enemies.forEach(e => {
                if (V.distance(p.position, e.position) < p.size + e.size) {
                    e.hp -= p.damage;
                    p.lifespan = 0; // "kill" projectile
                }
            });
        });

        const newOrbs: XPOrb[] = [];
        newState.enemies = newState.enemies.filter(e => {
            if (e.hp <= 0) {
                newOrbs.push({ id: nextOrbId++, position: e.position, value: ENEMY_STATS.CHASER.xp });
                return false;
            }
            return true;
        });
        newState.xpOrbs.push(...newOrbs);
        newState.projectiles = newState.projectiles.filter(p => p.lifespan > 0);

        // Player -> Enemy
        newState.enemies.forEach(e => {
            if (V.distance(newState.player.position, e.position) < newState.player.size + e.size) {
                newState.player.hp -= e.damage;
            }
        });
        if(newState.player.hp <= 0) {
            newState.status = GameStatus.GameOver;
        }

        // XP Orb collection
        newState.xpOrbs = newState.xpOrbs.filter(orb => {
            if (V.distance(newState.player.position, orb.position) < newState.player.pickupRadius) {
                newState.player.xp += orb.value;
                return false;
            }
            return true;
        });

        // Level up
        if (newState.player.xp >= newState.player.xpToNextLevel) {
            newState.player.level++;
            newState.player.xp -= newState.player.xpToNextLevel;
            newState.player.xpToNextLevel = Math.floor(newState.player.xpToNextLevel * 1.5);
            newState.status = GameStatus.LevelUp;
        }

        newState.timer += deltaTime;
        return newState;

    default:
      return state;
  }
}


const useGameLoop = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
    // FIX: Added `dispatch` to the dependency array to follow React hook best practices.
  }, [dispatch]);

  const loop = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      dispatch({ type: 'TICK', payload: { deltaTime: Math.min(deltaTime, 0.05) } });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(loop);
    // FIX: Added `dispatch` to the dependency array. While `dispatch` is stable, this follows best practices for the exhaustive-deps lint rule.
  }, [dispatch]);

  useEffect(() => {
    if (gameState.status === GameStatus.Playing) {
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState.status, loop]);

  return { gameState, dispatch, resetGame };
};

export default useGameLoop;
