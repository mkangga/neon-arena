
import type { Upgrade, Player } from './types';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const PLAYER_INITIAL_STATS = {
  size: 15,
  hp: 100,
  maxHp: 100,
  xp: 0,
  xpToNextLevel: 10,
  level: 1,
  damage: 10,
  attackSpeed: 1, // attacks per second
  moveSpeed: 200, // pixels per second
  pickupRadius: 50,
  dashCooldown: 0,
  dashDuration: 0,
  isDashing: false,
  invincibleTimer: 0,
};

export const ENEMY_STATS = {
  CHASER: { size: 12, hp: 30, damage: 10, speed: 150, xp: 5 },
  RANGER: { size: 14, hp: 20, damage: 5, speed: 100, xp: 7, attackCooldown: 2 },
  EXPLODER: { size: 20, hp: 50, damage: 40, speed: 80, xp: 15, telegraphDuration: 1.5, explosionRadius: 100 },
};

export const UPGRADES: Upgrade[] = [
  {
    id: 'hp_up_1',
    name: 'Reinforced Hull',
    description: 'Increases maximum HP by 20.',
    apply: (player: Player) => ({ maxHp: player.maxHp + 20, hp: player.hp + 20 }),
  },
  {
    id: 'speed_up_1',
    name: 'Optimized Thrusters',
    description: 'Increases movement speed by 15%.',
    apply: (player: Player) => ({ moveSpeed: player.moveSpeed * 1.15 }),
  },
  {
    id: 'damage_up_1',
    name: 'High-Energy Capacitors',
    description: 'Increases weapon damage by 10.',
    apply: (player: Player) => ({ damage: player.damage + 10 }),
  },
  {
    id: 'attackspeed_up_1',
    name: 'Rapid Recycler',
    description: 'Increases attack speed by 20%.',
    apply: (player: Player) => ({ attackSpeed: player.attackSpeed * 1.20 }),
  },
  {
    id: 'pickup_radius_1',
    name: 'Magnetic Core',
    description: 'Increases XP pickup radius by 50%.',
    apply: (player: Player) => ({ pickupRadius: player.pickupRadius * 1.5 }),
  },
    {
    id: 'hp_up_2',
    name: 'Nanite Repair System',
    description: 'Increases maximum HP by 50.',
    apply: (player: Player) => ({ maxHp: player.maxHp + 50, hp: player.hp + 50 }),
  },
  {
    id: 'speed_up_2',
    name: 'Afterburner',
    description: 'Increases movement speed by 25%.',
    apply: (player: Player) => ({ moveSpeed: player.moveSpeed * 1.25 }),
  },
  {
    id: 'damage_up_2',
    name: 'Plasma Focus Coils',
    description: 'Increases weapon damage by 25.',
    apply: (player: Player) => ({ damage: player.damage + 25 }),
  },
];
