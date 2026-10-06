export const GAME_TITLE = 'Silent Corridor';

export const GAME_WIDTH = 960;

export const GAME_HEIGHT = 540;

export type Wall = { x: number; y: number; w: number; h: number };

export const WALLS: Wall[] = [
  { x: 0, y: 0, w: 960, h: 40 },
  { x: 0, y: 500, w: 960, h: 40 },
  { x: 0, y: 0, w: 40, h: 540 },
  { x: 920, y: 0, w: 40, h: 540 },
  { x: 360, y: 40, w: 60, h: 300 },
  { x: 600, y: 200, w: 60, h: 300 },
];

export const PLAYER_START = { x: 90, y: 270 };

export const PLAYER_RADIUS = 12;

export const PLAYER_SPEED = 220;

export const GOAL = { x: 860, y: 210, w: 50, h: 120 };

export const GUARD_FROM = { x: 510, y: 460 };

export const GUARD_TO = { x: 510, y: 80 };

export const GUARD_SPEED = 80;

export const GUARD_PAUSE_MS = 1200;

export const GUARD_SWEEP_HALF_MS = 400;
