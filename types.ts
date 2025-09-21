
export interface Vector2D {
  x: number;
  y: number;
}

export enum GameStatus {
  MainMenu,
  Playing,
  Paused,
  LevelUp,
  GameOver,
}

export interface Player {
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  hp: number;
  maxHp: number;
  xp: number;
  xpToNextLevel: number;
  level: number;
  damage: number;
  attackSpeed: number;
  moveSpeed: number;
  pickupRadius: number;
  isDashing: boolean;
  dashCooldown: number;
  dashDuration: number;
  invincibleTimer: number;
}

export enum EnemyType {
  Chaser,
  Ranger,
  Exploder,
}

export interface Enemy {
  id: number;
  type: EnemyType;
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;
  attackCooldown?: number;
  isTelegraphing?: boolean;
  telegraphTimer?: number;
}

export interface XPOrb {
  id: number;
  position: Vector2D;
  value: number;
}

export interface Projectile {
    id: number;
    position: Vector2D;
    velocity: Vector2D;
    size: number;
    damage: number;
    lifespan: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  apply: (player: Player) => Partial<Player>;
}

export interface GameState {
  status: GameStatus;
  player: Player;
  enemies: Enemy[];
  xpOrbs: XPOrb[];
  projectiles: Projectile[];
  timer: number;
  enemySpawnCooldown: number;
  levelUpgrades: Upgrade[];
}

export type GameAction =
  | { type: 'TICK'; payload: { deltaTime: number } }
  | { type: 'START_GAME' }
  | { type: 'SET_STATUS'; payload: GameStatus }
  | { type: 'SET_PLAYER_MOVEMENT'; payload: { keys: Set<string> } }
  | { type: 'APPLY_UPGRADE'; payload: Upgrade }
  | { type: 'RESET' };
