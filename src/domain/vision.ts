import { computeRisk } from './alert';
import type { Vec2 } from './patrol';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const EPSILON = 0.5;

const inflate = (rect: Rect, by: number): Rect => ({
  x: rect.x - by,
  y: rect.y - by,
  w: rect.w + by * 2,
  h: rect.h + by * 2,
});

function segmentIntersectsRect(from: Vec2, to: Vec2, rect: Rect): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let tMin = 0;
  let tMax = 1;

  const axes: Array<{ p: number; d: number; min: number; max: number }> = [
    { p: from.x, d: dx, min: rect.x, max: rect.x + rect.w },
    { p: from.y, d: dy, min: rect.y, max: rect.y + rect.h },
  ];

  for (const { p, d, min, max } of axes) {
    if (Math.abs(d) < 1e-9) {
      if (p < min || p > max) {
        return false;
      }
    } else {
      let t1 = (min - p) / d;
      let t2 = (max - p) / d;
      if (t1 > t2) {
        const swap = t1;
        t1 = t2;
        t2 = swap;
      }
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
      if (tMin > tMax) {
        return false;
      }
    }
  }
  return true;
}

function rayRectDistance(origin: Vec2, dir: Vec2, rect: Rect): number | null {
  let tMin = Number.NEGATIVE_INFINITY;
  let tMax = Number.POSITIVE_INFINITY;

  const axes: Array<{ p: number; d: number; min: number; max: number }> = [
    { p: origin.x, d: dir.x, min: rect.x, max: rect.x + rect.w },
    { p: origin.y, d: dir.y, min: rect.y, max: rect.y + rect.h },
  ];

  for (const { p, d, min, max } of axes) {
    if (Math.abs(d) < 1e-9) {
      if (p < min || p > max) {
        return null;
      }
    } else {
      let t1 = (min - p) / d;
      let t2 = (max - p) / d;
      if (t1 > t2) {
        const swap = t1;
        t1 = t2;
        t2 = swap;
      }
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
      if (tMin > tMax) {
        return null;
      }
    }
  }

  const hit = tMin >= 0 ? tMin : tMax;
  return hit >= 0 ? hit : null;
}

export function hasLineOfSight(from: Vec2, to: Vec2, obstacles: Rect[]): boolean {
  return !obstacles.some((rect) =>
    segmentIntersectsRect(from, to, inflate(rect, EPSILON)),
  );
}

export function rayHitDistance(
  origin: Vec2,
  direction: Vec2,
  obstacles: Rect[],
  maxDist: number,
): number {
  const len = Math.hypot(direction.x, direction.y);
  if (len === 0) {
    return 0;
  }
  const dir = { x: direction.x / len, y: direction.y / len };
  let best = maxDist;
  for (const rect of obstacles) {
    const hit = rayRectDistance(origin, dir, inflate(rect, EPSILON));
    if (hit !== null && hit < best) {
      best = hit;
    }
  }
  return best;
}

export function visibleToGuard(
  origin: Vec2,
  gaze: Vec2,
  target: Vec2,
  obstacles: Rect[],
  radius: number,
  halfAngleDeg: number,
): boolean {
  const dist = Math.hypot(target.x - origin.x, target.y - origin.y);
  if (dist >= radius || dist === 0) {
    return false;
  }
  const gazeLen = Math.hypot(gaze.x, gaze.y);
  if (gazeLen === 0) {
    return false;
  }
  const dot =
    ((target.x - origin.x) * gaze.x + (target.y - origin.y) * gaze.y) / (dist * gazeLen);
  if (dot < Math.cos((halfAngleDeg * Math.PI) / 180)) {
    return false;
  }
  return hasLineOfSight(origin, target, obstacles);
}

export function riskForGuardView(
  distance: number,
  visible: boolean,
  radius: number,
  coneBonus: number,
): number {
  if (!visible) {
    return 0;
  }
  return computeRisk(distance, true, radius, coneBonus);
}

export function sightPolygon(
  origin: Vec2,
  gaze: Vec2,
  halfAngleDeg: number,
  obstacles: Rect[],
  maxDist: number,
  samples: number,
): Vec2[] {
  const gazeLen = Math.hypot(gaze.x, gaze.y);
  if (gazeLen === 0 || samples < 1) {
    return [];
  }
  const base = Math.atan2(gaze.y / gazeLen, gaze.x / gazeLen);
  const points: Vec2[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const offset = -halfAngleDeg + (2 * halfAngleDeg * i) / samples;
    const angle = base + (offset * Math.PI) / 180;
    const dir = { x: Math.cos(angle), y: Math.sin(angle) };
    const dist = rayHitDistance(origin, dir, obstacles, maxDist);
    points.push({ x: origin.x + dir.x * dist, y: origin.y + dir.y * dist });
  }
  return points;
}
