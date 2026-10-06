import type { AlertState } from './alert';

export function zoomForState(state: AlertState, view: Record<AlertState, number>): number {
  return view[state];
}

export function lerp(current: number, target: number, t: number): number {
  const k = Math.min(1, Math.max(0, t));
  return current + (target - current) * k;
}

export function smoothT(deltaMs: number, perSecond: number): number {
  if (deltaMs <= 0 || perSecond <= 0) {
    return 0;
  }
  return Math.min(1, (perSecond * deltaMs) / 1000);
}
