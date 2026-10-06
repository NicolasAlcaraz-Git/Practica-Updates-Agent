import { describe, expect, test } from 'vitest';
import { GAME_HEIGHT, GAME_TITLE, GAME_WIDTH } from '../src/core/constants';

describe('scaffold del stack base', () => {
  test('las constantes basicas del juego estan definidas', () => {
    expect(GAME_TITLE).toBe('Silent Corridor');
    expect(GAME_WIDTH).toBeGreaterThan(0);
    expect(GAME_HEIGHT).toBeGreaterThan(0);
  });
});
