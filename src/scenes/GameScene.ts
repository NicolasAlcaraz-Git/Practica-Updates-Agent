import Phaser from 'phaser';
import { AlertSystem, computeRisk, isInCone } from '../domain/alert';
import { lerp, smoothT, zoomForState } from '../domain/camera';
import { Patrol, type PatrolConfig } from '../domain/patrol';
import {
  ALERT_CONFIG,
  ALERT_VIEW,
  CAMERA_SMOOTH_PER_SEC,
  CAMERA_VIEW,
  GAME_HEIGHT,
  GAME_WIDTH,
  GOAL,
  GUARD_FROM,
  GUARD_PAUSE_MS,
  GUARD_SPEED,
  GUARD_SWEEP_HALF_MS,
  GUARD_TO,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_START,
  RISK_CONE_BONUS,
  RISK_CONE_HALF_DEG,
  RISK_RADIUS,
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
  private alert!: AlertSystem;
  private alertBar!: Phaser.GameObjects.Rectangle;
  private alertLabel!: Phaser.GameObjects.Text;
  private ambient!: Phaser.GameObjects.Rectangle;
  private keys!: Keys;
  private goalReached = false;

  constructor() {
    super('game');
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

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
    this.alert = new AlertSystem(ALERT_CONFIG);
    const start = this.patrol.getPosition();

    this.ambient = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xd02020)
      .setAlpha(0)
      .setDepth(10);

    const barX = 60;
    const barY = 13;
    const barW = 240;
    const barH = 14;
    this.add
      .rectangle(barX + barW / 2, barY + barH / 2, barW, barH, 0x000000, 0.6)
      .setDepth(20);
    this.alertBar = this.add
      .rectangle(barX, barY + barH / 2, barW, barH, ALERT_VIEW.tranquilo.color)
      .setOrigin(0, 0.5)
      .setDepth(21);
    this.alertLabel = this.add
      .text(barX + barW + 12, barY, 'tranquilo 0', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#e8eef5',
      })
      .setDepth(21);
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
    this.updateAlert(delta);
    this.updateCamera(delta);
  }

  private updateCamera(delta: number): void {
    const camera = this.cameras.main;
    const t = smoothT(delta, CAMERA_SMOOTH_PER_SEC);
    const targetZoom = zoomForState(this.alert.getState(), CAMERA_VIEW);
    camera.scrollX = lerp(camera.scrollX, this.player.x - GAME_WIDTH / 2, t);
    camera.scrollY = lerp(camera.scrollY, this.player.y - GAME_HEIGHT / 2, t);
    camera.zoom = lerp(camera.zoom, targetZoom, t);
  }

  private updateAlert(delta: number): void {
    const guardPos = this.patrol.getPosition();
    const playerPos = { x: this.player.x, y: this.player.y };
    const distance = Math.hypot(playerPos.x - guardPos.x, playerPos.y - guardPos.y);
    const inCone = isInCone(
      guardPos,
      this.patrol.getGazeDirection(),
      playerPos,
      RISK_CONE_HALF_DEG,
    );
    const risk = computeRisk(distance, inCone, RISK_RADIUS, RISK_CONE_BONUS);
    this.alert.tick(delta, risk);

    const level = this.alert.getLevel();
    const state = this.alert.getState();
    const view = ALERT_VIEW[state];
    this.alertBar.scaleX = Math.max(level / 100, 0.001);
    this.alertBar.setFillStyle(view.color);
    this.alertLabel.setText(`${state} ${Math.round(level)}`);
    this.ambient.setAlpha(view.alpha);
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
