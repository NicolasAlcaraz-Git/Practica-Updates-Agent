import { describe, expect, test } from 'vitest';
import { AlertSystem } from '../src/domain/alert';
import type { Rect } from '../src/domain/vision';
import {
  hasLineOfSight,
  rayHitDistance,
  riskForGuardView,
  sightPolygon,
  visibleToGuard,
} from '../src/domain/vision';

const WALL: Rect = { x: 40, y: -20, w: 20, h: 140 };
const BOX: Rect = { x: 45, y: -5, w: 15, h: 15 };
const FAR: Rect = { x: 500, y: 500, w: 50, h: 50 };

describe('hasLineOfSight', () => {
  test('sin obstaculos la linea esta libre', () => {
    expect(hasLineOfSight({ x: 0, y: 0 }, { x: 100, y: 0 }, [])).toBe(true);
  });

  test('un muro intermedio bloquea la linea', () => {
    expect(hasLineOfSight({ x: 0, y: 0 }, { x: 100, y: 0 }, [WALL])).toBe(false);
  });

  test('una caja de cobertura intermedia bloquea la linea', () => {
    expect(hasLineOfSight({ x: 0, y: 0 }, { x: 100, y: 0 }, [BOX])).toBe(false);
  });

  test('un obstaculo fuera del camino no bloquea', () => {
    expect(hasLineOfSight({ x: 0, y: 0 }, { x: 100, y: 0 }, [FAR])).toBe(true);
  });
});

describe('rayHitDistance', () => {
  const origin = { x: 0, y: 0 };

  test('devuelve la distancia al primer impacto', () => {
    const hit = rayHitDistance(origin, { x: 1, y: 0 }, [WALL], 400);
    expect(hit).toBeCloseTo(40 - 0.5, 6);
  });

  test('sin impacto devuelve maxDist', () => {
    expect(rayHitDistance(origin, { x: 1, y: 0 }, [FAR], 400)).toBe(400);
    expect(rayHitDistance(origin, { x: -1, y: 0 }, [WALL], 400)).toBe(400);
  });

  test('direccion cero devuelve 0', () => {
    expect(rayHitDistance(origin, { x: 0, y: 0 }, [WALL], 400)).toBe(0);
  });
});

describe('visibleToGuard', () => {
  const origin = { x: 0, y: 0 };
  const gaze = { x: 1, y: 0 };

  test('al frente sin obstaculos: visible', () => {
    expect(visibleToGuard(origin, gaze, { x: 100, y: 0 }, [], 260, 50)).toBe(true);
  });

  test('en el cono pero tras una caja: oculto', () => {
    expect(visibleToGuard(origin, gaze, { x: 100, y: 0 }, [BOX], 260, 50)).toBe(false);
  });

  test('fuera del cono: oculto aunque no haya obstaculos', () => {
    expect(visibleToGuard(origin, gaze, { x: 0, y: 100 }, [], 260, 50)).toBe(false);
  });

  test('mas alla del radio: oculto', () => {
    expect(visibleToGuard(origin, gaze, { x: 300, y: 0 }, [], 260, 50)).toBe(false);
  });
});

describe('sightPolygon', () => {
  const origin = { x: 0, y: 0 };
  const gaze = { x: 1, y: 0 };

  test('con vacio, todos los puntos estan a maxDist', () => {
    const points = sightPolygon(origin, gaze, 50, [], 200, 16);
    expect(points).toHaveLength(17);
    for (const p of points) {
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(200, 6);
    }
  });

  test('un muro al frente recorta los puntos centrales', () => {
    const points = sightPolygon(origin, gaze, 50, [WALL], 400, 16);
    const center = points[8];
    expect(Math.hypot(center.x, center.y)).toBeLessThan(40);
    const edge = points[0];
    expect(Math.hypot(edge.x, edge.y)).toBeGreaterThan(60);
  });

  test('gaze cero devuelve poligono vacio', () => {
    expect(sightPolygon(origin, { x: 0, y: 0 }, 50, [], 200, 16)).toEqual([]);
  });
});

describe('integracion: sin vision no hay riesgo y la alerta decae', () => {
  test('riesgo 0 cuando el jugador no esta visible, y AlertSystem baja', () => {
    const dist = 50;
    expect(riskForGuardView(dist, false, 260, 1.6)).toBe(0);
    expect(riskForGuardView(dist, true, 260, 1.6)).toBeGreaterThan(0);

    const alert = new AlertSystem({
      risePerSecond: 35,
      fallPerSecond: 18,
      sospechaAt: 25,
      busquedaAt: 50,
      alertaMaximaAt: 75,
    });
    for (let i = 0; i < 4; i += 1) {
      alert.tick(500, 1);
    }
    expect(alert.getLevel()).toBeCloseTo(70, 6);
    for (let i = 0; i < 10; i += 1) {
      alert.tick(500, riskForGuardView(dist, false, 260, 1.6));
    }
    expect(alert.getLevel()).toBeLessThan(70);
    expect(alert.getState()).toBe('tranquilo');
  });
});
