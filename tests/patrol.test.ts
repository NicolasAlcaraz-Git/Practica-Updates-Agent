import { describe, expect, test } from 'vitest';
import { Patrol, type PatrolConfig, type Vec2 } from '../src/domain/patrol';

const CONFIG: PatrolConfig = {
  from: { x: 0, y: 0 },
  to: { x: 100, y: 0 },
  speed: 100,
  pauseDurationMs: 500,
  sweepHalfDurationMs: 250,
};

const TICK = 125;

const run = (patrol: Patrol, ticks: number): void => {
  for (let i = 0; i < ticks; i += 1) {
    patrol.tick(TICK);
  }
};

const expectVec = (actual: Vec2, expected: Vec2): void => {
  expect(actual.x).toBeCloseTo(expected.x, 9);
  expect(actual.y).toBeCloseTo(expected.y, 9);
};

describe('patrulla dominio', () => {
  test('avanza de A a B a velocidad constante y llega exacto', () => {
    const patrol = new Patrol(CONFIG);
    run(patrol, 4);
    expect(patrol.getPosition()).toEqual({ x: 50, y: 0 });
    expect(patrol.getPhase()).toBe('moving');
    run(patrol, 4);
    expect(patrol.getPosition()).toEqual({ x: 100, y: 0 });
    expect(patrol.getPhase()).toBe('pausing');
  });

  test('en movimiento la mirada apunta al rumbo de avance', () => {
    const patrol = new Patrol(CONFIG);
    expect(patrol.getFacing()).toEqual({ x: 1, y: 0 });
    expectVec(patrol.getGazeDirection(), { x: 1, y: 0 });
    run(patrol, 8);
    expect(patrol.getPhase()).toBe('pausing');
    expectVec(patrol.getGazeDirection(), { x: 0, y: 1 });
  });

  test('durante la pausa la mirada barre de lado a lado cada sweepHalfDuration', () => {
    const longPause = new Patrol({ ...CONFIG, pauseDurationMs: 2000 });
    run(longPause, 8);
    expect(longPause.getPhase()).toBe('pausing');
    expect(longPause.getGazeSide()).toBe(1);
    longPause.tick(250);
    expect(longPause.getGazeSide()).toBe(-1);
    expect(longPause.getPhase()).toBe('pausing');
    longPause.tick(250);
    expect(longPause.getGazeSide()).toBe(1);
    longPause.tick(250);
    expect(longPause.getGazeSide()).toBe(-1);
    longPause.tick(250);
    expect(longPause.getGazeSide()).toBe(1);
    expect(longPause.getPhase()).toBe('pausing');
    longPause.tick(1000);
    expect(longPause.getPhase()).toBe('moving');
  });

  test('la pausa dura exactamente pauseDurationMs y luego invierte el rumbo', () => {
    const patrol = new Patrol(CONFIG);
    run(patrol, 8);
    patrol.tick(375);
    expect(patrol.getPhase()).toBe('pausing');
    patrol.tick(125);
    expect(patrol.getPhase()).toBe('moving');
    expect(patrol.getFacing()).toEqual({ x: -1, y: 0 });
    patrol.tick(125);
    expect(patrol.getPosition()).toEqual({ x: 87.5, y: 0 });
  });

  test('ciclo completo A -> pausa -> B -> pausa -> A', () => {
    const patrol = new Patrol(CONFIG);
    run(patrol, 24);
    expect(patrol.getPosition()).toEqual({ x: 0, y: 0 });
    expect(patrol.getPhase()).toBe('moving');
    expect(patrol.getFacing()).toEqual({ x: 1, y: 0 });
    expect(patrol.getPosition()).toEqual(CONFIG.from);
  });

  test('un tick no mayor que la pausa no la cancela', () => {
    const patrol = new Patrol(CONFIG);
    run(patrol, 8);
    patrol.tick(499);
    expect(patrol.getPhase()).toBe('pausing');
    patrol.tick(1);
    expect(patrol.getPhase()).toBe('moving');
  });

  test('configuracion invalida: velocidad o distancias cero', () => {
    expect(() => new Patrol({ ...CONFIG, speed: 0 })).toThrow('speed');
    expect(() => new Patrol({ ...CONFIG, pauseDurationMs: 0 })).toThrow('durations');
    expect(() => new Patrol({ ...CONFIG, from: { x: 5, y: 5 }, to: { x: 5, y: 5 } })).toThrow(
      'must differ',
    );
  });
});
