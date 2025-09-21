
import type { Vector2D } from '../types';

export const add = (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x + v2.x, y: v1.y + v2.y });
export const subtract = (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x - v2.x, y: v1.y - v2.y });
export const multiply = (v: Vector2D, scalar: number): Vector2D => ({ x: v.x * scalar, y: v.y * scalar });
export const magnitude = (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y);
export const normalize = (v: Vector2D): Vector2D => {
  const mag = magnitude(v);
  return mag > 0 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 };
};
export const distance = (v1: Vector2D, v2: Vector2D): number => magnitude(subtract(v1, v2));

// Seeded random number generator (mulberry32)
export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  nextFloat(): number {
    this.seed |= 0;
    this.seed = (this.seed + 0x6d2b79f5) | 0;
    let t = Math.imul(this.seed ^ (this.seed >>> 15), 1 | this.seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return this.nextFloat() * (max - min) + min;
  }

  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}
