import type { AlertState } from '../domain/alert';

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

export const RISK_RADIUS = 260;

export const RISK_CONE_HALF_DEG = 50;

export const RISK_CONE_BONUS = 1.6;

export const ALERT_CONFIG = {
  risePerSecond: 35,
  fallPerSecond: 18,
  sospechaAt: 25,
  busquedaAt: 50,
  alertaMaximaAt: 75,
} as const;

export const ALERT_VIEW: Record<AlertState, { color: number; alpha: number }> = {
  tranquilo: { color: 0x4caf50, alpha: 0 },
  sospecha: { color: 0xffeb3b, alpha: 0.05 },
  busqueda: { color: 0xff9800, alpha: 0.1 },
  'alerta maxima': { color: 0xf44336, alpha: 0.16 },
};

export const CAMERA_VIEW: Record<AlertState, number> = {
  tranquilo: 1,
  sospecha: 0.95,
  busqueda: 0.9,
  'alerta maxima': 0.85,
};

export const CAMERA_SMOOTH_PER_SEC = 6;
