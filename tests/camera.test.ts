import { describe, expect, test } from 'vitest';
import type { AlertState } from '../src/domain/alert';
import { lerp, smoothT, zoomForState } from '../src/domain/camera';

const VIEW: Record<AlertState, number> = {
  tranquilo: 1,
  sospecha: 0.95,
  busqueda: 0.9,
  'alerta maxima': 0.85,
};

const STATES: AlertState[] = ['tranquilo', 'sospecha', 'busqueda', 'alerta maxima'];

describe('zoomForState', () => {
  test('devuelve el zoom objetivo de cada estado', () => {
    expect(zoomForState('tranquilo', VIEW)).toBe(1);
    expect(zoomForState('sospecha', VIEW)).toBe(0.95);
    expect(zoomForState('busqueda', VIEW)).toBe(0.9);
    expect(zoomForState('alerta maxima', VIEW)).toBe(0.85);
  });

  test('es monotono decreciente: a mayor alerta, menor zoom', () => {
    for (let i = 1; i < STATES.length; i += 1) {
      expect(zoomForState(STATES[i], VIEW)).toBeLessThan(zoomForState(STATES[i - 1], VIEW));
    }
  });
});

describe('lerp', () => {
  test('t=0 devuelve el valor actual y t=1 el objetivo', () => {
    expect(lerp(0.5, 1, 0)).toBe(0.5);
    expect(lerp(0.5, 1, 1)).toBe(1);
  });

  test('interpola el punto medio', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(2, 4, 0.25)).toBe(2.5);
  });

  test('recorta t fuera de [0,1]', () => {
    expect(lerp(0, 10, 2)).toBe(10);
    expect(lerp(0, 10, -1)).toBe(0);
    expect(lerp(5, 5, 0.7)).toBe(5);
  });
});

describe('smoothT', () => {
  test('dt no positivo produce 0', () => {
    expect(smoothT(0, 6)).toBe(0);
    expect(smoothT(-100, 6)).toBe(0);
    expect(smoothT(100, 0)).toBe(0);
  });

  test('escala con dt y se satura en 1', () => {
    expect(smoothT(100, 6)).toBeCloseTo(0.6, 9);
    expect(smoothT(1000, 6)).toBe(1);
    expect(smoothT(5000, 6)).toBe(1);
  });
});
