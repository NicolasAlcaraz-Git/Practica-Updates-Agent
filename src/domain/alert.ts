export type AlertState = 'tranquilo' | 'sospecha' | 'busqueda' | 'alerta maxima';

export interface AlertConfig {
  risePerSecond: number;
  fallPerSecond: number;
  sospechaAt: number;
  busquedaAt: number;
  alertaMaximaAt: number;
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export function computeRisk(
  distance: number,
  inCone: boolean,
  radius: number,
  coneBonus: number,
): number {
  if (radius <= 0 || distance >= radius) {
    return 0;
  }
  const base = 1 - distance / radius;
  const withBonus = inCone ? base * coneBonus : base;
  return clamp(withBonus, 0, 1);
}

export function isInCone(
  origin: { x: number; y: number },
  gaze: { x: number; y: number },
  target: { x: number; y: number },
  halfAngleDeg: number,
): boolean {
  const toTarget = { x: target.x - origin.x, y: target.y - origin.y };
  const dist = Math.hypot(toTarget.x, toTarget.y);
  const gazeLen = Math.hypot(gaze.x, gaze.y);
  if (dist === 0 || gazeLen === 0) {
    return false;
  }
  const dot = (toTarget.x * gaze.x + toTarget.y * gaze.y) / (dist * gazeLen);
  const limit = Math.cos((halfAngleDeg * Math.PI) / 180);
  return dot >= limit;
}

export function stateForLevel(level: number, config: AlertConfig): AlertState {
  if (level >= config.alertaMaximaAt) {
    return 'alerta maxima';
  }
  if (level >= config.busquedaAt) {
    return 'busqueda';
  }
  if (level >= config.sospechaAt) {
    return 'sospecha';
  }
  return 'tranquilo';
}

export class AlertSystem {
  private level = 0;

  constructor(private readonly config: AlertConfig) {
    if (config.risePerSecond <= 0 || config.fallPerSecond <= 0) {
      throw new Error('AlertSystem: rates must be > 0');
    }
    if (
      !(
        config.sospechaAt > 0 &&
        config.sospechaAt < config.busquedaAt &&
        config.busquedaAt < config.alertaMaximaAt &&
        config.alertaMaximaAt <= 100
      )
    ) {
      throw new Error('AlertSystem: thresholds must satisfy 0 < s < b < a <= 100');
    }
  }

  tick(deltaMs: number, risk: number): void {
    if (deltaMs <= 0) {
      return;
    }
    const dt = deltaMs / 1000;
    const r = clamp(risk, 0, 1);
    if (r > 0) {
      this.level += this.config.risePerSecond * r * dt;
    } else {
      this.level -= this.config.fallPerSecond * dt;
    }
    this.level = clamp(this.level, 0, 100);
  }

  getLevel(): number {
    return this.level;
  }

  getState(): AlertState {
    return stateForLevel(this.level, this.config);
  }
}
