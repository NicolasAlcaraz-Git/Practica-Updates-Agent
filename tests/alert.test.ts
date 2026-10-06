import { describe, expect, test } from 'vitest';
import {
  AlertSystem,
  computeRisk,
  isInCone,
  stateForLevel,
  type AlertConfig,
} from '../src/domain/alert';

const CONFIG: AlertConfig = {
  risePerSecond: 35,
  fallPerSecond: 18,
  sospechaAt: 25,
  busquedaAt: 50,
  alertaMaximaAt: 75,
};

const RADIUS = 260;
const BONUS = 1.6;

describe('computeRisk', () => {
  test('fuera del radio el riesgo es 0', () => {
    expect(computeRisk(RADIUS, false, RADIUS, BONUS)).toBe(0);
    expect(computeRisk(RADIUS + 50, true, RADIUS, BONUS)).toBe(0);
  });

  test('a distancia minima el riesgo es 1 (saturado)', () => {
    expect(computeRisk(0, false, RADIUS, BONUS)).toBe(1);
  });

  test('el cono multiplica el riesgo y nunca supera 1', () => {
    const outCone = computeRisk(130, false, RADIUS, BONUS);
    const inCone = computeRisk(130, true, RADIUS, BONUS);
    expect(inCone).toBeGreaterThan(outCone);
    expect(computeRisk(1, true, RADIUS, BONUS)).toBe(1);
    expect(inCone).toBeLessThanOrEqual(1);
  });
});

describe('isInCone', () => {
  const origin = { x: 0, y: 0 };
  const gaze = { x: 1, y: 0 };

  test('objetivo al frente esta en el cono', () => {
    expect(isInCone(origin, gaze, { x: 100, y: 0 }, 50)).toBe(true);
  });

  test('detras o perpendicular al cono no esta en el cono', () => {
    expect(isInCone(origin, gaze, { x: -100, y: 0 }, 50)).toBe(false);
    expect(isInCone(origin, gaze, { x: 0, y: 100 }, 50)).toBe(false);
  });

  test('dentro de la media-angulo si, fuera no', () => {
    expect(isInCone(origin, gaze, { x: 100, y: 40 }, 50)).toBe(true);
    expect(isInCone(origin, gaze, { x: 40, y: 100 }, 50)).toBe(false);
  });
});

describe('stateForLevel: bordes exactos de umbral', () => {
  test('los cuatro estados cambian exactamente en 25/50/75', () => {
    expect(stateForLevel(0, CONFIG)).toBe('tranquilo');
    expect(stateForLevel(24.99, CONFIG)).toBe('tranquilo');
    expect(stateForLevel(25, CONFIG)).toBe('sospecha');
    expect(stateForLevel(49.99, CONFIG)).toBe('sospecha');
    expect(stateForLevel(50, CONFIG)).toBe('busqueda');
    expect(stateForLevel(74.99, CONFIG)).toBe('busqueda');
    expect(stateForLevel(75, CONFIG)).toBe('alerta maxima');
    expect(stateForLevel(100, CONFIG)).toBe('alerta maxima');
  });
});

describe('AlertSystem', () => {
  test('sube proporcionalmente al riesgo', () => {
    const full = new AlertSystem(CONFIG);
    const half = new AlertSystem(CONFIG);
    full.tick(1000, 1);
    half.tick(1000, 0.5);
    expect(full.getLevel()).toBeCloseTo(35, 9);
    expect(half.getLevel()).toBeCloseTo(17.5, 9);
  });

  test('sin riesgo decae hasta 0 y vuelve a tranquilo', () => {
    const alert = new AlertSystem(CONFIG);
    alert.tick(3000, 1);
    expect(alert.getState()).toBe('alerta maxima');
    alert.tick(10000, 0);
    expect(alert.getLevel()).toBe(0);
    expect(alert.getState()).toBe('tranquilo');
  });

  test('recorre los estados en orden al subir', () => {
    const alert = new AlertSystem(CONFIG);
    const states = new Set<string>();
    for (let i = 0; i < 10; i += 1) {
      alert.tick(500, 1);
      states.add(alert.getState());
    }
    expect([...states].sort()).toEqual(
      ['busqueda', 'sospecha', 'alerta maxima', 'tranquilo'].sort(),
    );
    expect(alert.getState()).toBe('alerta maxima');
  });

  test('con riesgo persistente se satura en 100 sin reiniciarse', () => {
    const alert = new AlertSystem(CONFIG);
    for (let i = 0; i < 50; i += 1) {
      alert.tick(1000, 1);
      expect(alert.getLevel()).toBeLessThanOrEqual(100);
    }
    expect(alert.getLevel()).toBe(100);
    expect(alert.getState()).toBe('alerta maxima');
  });

  test('invariantes: riesgo fuera de rango y dt invalido', () => {
    const alert = new AlertSystem(CONFIG);
    alert.tick(1000, 999);
    expect(alert.getLevel()).toBe(35);
    const calm = new AlertSystem(CONFIG);
    calm.tick(1000, -5);
    expect(calm.getLevel()).toBe(0);
    calm.tick(0, 1);
    expect(calm.getLevel()).toBe(0);
  });

  test('configuracion invalida', () => {
    expect(() => new AlertSystem({ ...CONFIG, risePerSecond: 0 })).toThrow('rates');
    expect(() => new AlertSystem({ ...CONFIG, sospechaAt: 80 })).toThrow('thresholds');
  });
});
