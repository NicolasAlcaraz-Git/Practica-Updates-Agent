import Phaser from 'phaser';
import { Patrol, type PatrolConfig } from '../domain/patrol';
import {
  GOAL,
  GUARD_FROM,
  GUARD_PAUSE_MS,
  GUARD_SPEED,
  GUARD_SWEEP_HALF_MS,
  GUARD_TO,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_START,
  WALLS,
} from '../core/constants';

type Keys = Record<string, Phaser.Input.Keyboard.Key>;

const GUARD_CONFIG: PatrolConfig = {
  from: GUARD_FROM,
  to: GUARD_TO,
  speed: GUARD_SPEED,
  pauseDurationMs: GUARD_PAUSE_MS,
  sweepHalfDurationMs: GUARD_SWEEP_HALF_MS,
};

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private goal!: Phaser.GameObjects.Rectangle;
  private guard!: Phaser.GameObjects.Arc;
  private gazeIndicator!: Phaser.GameObjects.Arc;
  private patrol!: Patrol;
  private keys!: Keys;
  private goalReached = false;

  constructor() {
    super('game');
  }

  create(): void {
    for (const wall of WALLS) {
      this.add
        .rectangle(wall.x + wall.w / 2, wall.y + wall.h / 2, wall.w, wall.h, 0x3a4757)
        .setOrigin(0.5, 0.5);
    }

    this.goal = this.add
      .rectangle(GOAL.x + GOAL.w / 2, GOAL.y + GOAL.h / 2, GOAL.w, GOAL.h, 0xb8860b)
      .setOrigin(0.5, 0.5);

    this.player = this.add.circle(PLAYER_START.x, PLAYER_START.y, PLAYER_RADIUS, 0xe8eef5);

    this.patrol = new Patrol(GUARD_CONFIG);
    const start = this.patrol.getPosition();
    this.guard = this.add.circle(start.x, start.y, PLAYER_RADIUS, 0xb03030);
    this.gazeIndicator = this.add.circle(start.x, start.y, 5, 0xf0c040);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.keys = keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as Keys;
    }
  }

  update(_time: number, delta: number): void {
    this.updateGuard(delta);
    this.updatePlayer(delta);
  }

  private updateGuard(delta: number): void {
    this.patrol.tick(delta);
    const pos = this.patrol.getPosition();
    const gaze = this.patrol.getGazeDirection();
    const offset = PLAYER_RADIUS + 10;
    this.guard.setPosition(pos.x, pos.y);
    this.gazeIndicator.setPosition(pos.x + gaze.x * offset, pos.y + gaze.y * offset);
  }

  private updatePlayer(delta: number): void {
    if (!this.keys) {
      return;
    }

    const dt = delta / 1000;
    let dx = 0;
    let dy = 0;

    if (this.keys.A.isDown || this.keys.LEFT.isDown) dx -= 1;
    if (this.keys.D.isDown || this.keys.RIGHT.isDown) dx += 1;
    if (this.keys.W.isDown || this.keys.UP.isDown) dy -= 1;
    if (this.keys.S.isDown || this.keys.DOWN.isDown) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const norm = Math.SQRT1_2;
      dx *= norm;
      dy *= norm;
    }

    const nextX = this.player.x + dx * PLAYER_SPEED * dt;
    if (!this.collides(nextX, this.player.y)) {
      this.player.x = nextX;
    }

    const nextY = this.player.y + dy * PLAYER_SPEED * dt;
    if (!this.collides(this.player.x, nextY)) {
      this.player.y = nextY;
    }

    if (!this.goalReached && this.insideGoal(this.player.x, this.player.y)) {
      this.goalReached = true;
      this.goal.setFillStyle(0x2e7d32);
    }
  }

  private collides(x: number, y: number): boolean {
    const r = PLAYER_RADIUS;
    return WALLS.some(
      (wall) =>
        x + r > wall.x && x - r < wall.x + wall.w && y + r > wall.y && y - r < wall.y + wall.h,
    );
  }

  private insideGoal(x: number, y: number): boolean {
    const r = PLAYER_RADIUS;
    return (
      x + r > GOAL.x &&
      x - r < GOAL.x + GOAL.w &&
      y + r > GOAL.y &&
      y - r < GOAL.y + GOAL.h
    );
  }
}
