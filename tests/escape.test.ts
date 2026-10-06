import { describe, expect, test } from 'vitest';
import { ALERT_CONFIG } from '../src/core/constants';
import { ESCAPE_ALERT_THRESHOLD, evaluateEscape } from '../src/domain/escape';

describe('evaluateEscape', () => {
  test('con meta y alerta en el umbral o mas devuelve escape', () => {
    expect(evaluateEscape(75, true)).toBe('escape');
    expect(evaluateEscape(80, true)).toBe('escape');
    expect(evaluateEscape(100, true)).toBe('escape');
  });

  test('con meta y alerta bajo el umbral devuelve normal', () => {
    expect(evaluateEscape(0, true)).toBe('normal');
    expect(evaluateEscape(49, true)).toBe('normal');
    expect(evaluateEscape(74.9, true)).toBe('normal');
  });

  test('sin meta no hay cierre sin importar el nivel', () => {
    expect(evaluateEscape(0, false)).toBeNull();
    expect(evaluateEscape(75, false)).toBeNull();
    expect(evaluateEscape(100, false)).toBeNull();
  });

  test('el umbral coincide con alertaMaximaAt de la 02', () => {
    expect(ESCAPE_ALERT_THRESHOLD).toBe(ALERT_CONFIG.alertaMaximaAt);
  });
});
