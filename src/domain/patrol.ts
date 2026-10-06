export type Vec2 = { x: number; y: number };

export type PatrolPhase = 'moving' | 'pausing';

export interface PatrolConfig {
  from: Vec2;
  to: Vec2;
  speed: number;
  pauseDurationMs: number;
  sweepHalfDurationMs: number;
}

const distance = (a: Vec2, b: Vec2): number => Math.hypot(b.x - a.x, b.y - a.y);

const rotateLeft90 = (v: Vec2): Vec2 => ({ x: v.y, y: -v.x });

const rotateRight90 = (v: Vec2): Vec2 => ({ x: -v.y, y: v.x });

export class Patrol {
  private readonly pos: Vec2;
  private heading: 1 | -1 = 1;
  private phase: PatrolPhase = 'moving';
  private pauseElapsedMs = 0;
  private sweepElapsedMs = 0;
  private gazeSide: 1 | -1 = 1;

  constructor(private readonly config: PatrolConfig) {
    if (config.speed <= 0) {
      throw new Error('Patrol: speed must be > 0');
    }
    if (config.pauseDurationMs <= 0 || config.sweepHalfDurationMs <= 0) {
      throw new Error('Patrol: durations must be > 0');
    }
    if (distance(config.from, config.to) === 0) {
      throw new Error('Patrol: from and to must differ');
    }
    this.pos = { ...config.from };
  }

  tick(deltaMs: number): void {
    if (deltaMs <= 0) {
      return;
    }
    let remaining = deltaMs;
    let guard = 0;
    while (remaining > 0) {
      guard += 1;
      if (guard > 1000) {
        throw new Error('Patrol: tick did not converge');
      }
      if (this.phase === 'moving') {
        const target = this.destination();
        const dist = distance(this.pos, target);
        const step = (this.config.speed * remaining) / 1000;
        if (step < dist) {
          this.pos.x += ((target.x - this.pos.x) * step) / dist;
          this.pos.y += ((target.y - this.pos.y) * step) / dist;
          remaining = 0;
        } else {
          this.pos.x = target.x;
          this.pos.y = target.y;
          this.phase = 'pausing';
          this.pauseElapsedMs = 0;
          this.sweepElapsedMs = 0;
          this.gazeSide = 1;
          remaining -= (dist / this.config.speed) * 1000;
        }
      } else {
        const pauseRemaining = this.config.pauseDurationMs - this.pauseElapsedMs;
        const consume = Math.min(pauseRemaining, remaining);
        this.pauseElapsedMs += consume;
        this.sweepElapsedMs += consume;
        while (this.sweepElapsedMs >= this.config.sweepHalfDurationMs) {
          this.sweepElapsedMs -= this.config.sweepHalfDurationMs;
          this.gazeSide = this.gazeSide === 1 ? -1 : 1;
        }
        remaining -= consume;
        if (this.pauseElapsedMs >= this.config.pauseDurationMs) {
          this.heading = this.heading === 1 ? -1 : 1;
          this.phase = 'moving';
        }
      }
    }
  }

  getPhase(): PatrolPhase {
    return this.phase;
  }

  getPosition(): Vec2 {
    return { ...this.pos };
  }

  getFacing(): Vec2 {
    const dest = this.destination();
    const dist = distance(this.pos, dest);
    if (dist === 0) {
      return this.heading === 1 ? this.directionTo('to') : this.directionTo('from');
    }
    return { x: (dest.x - this.pos.x) / dist, y: (dest.y - this.pos.y) / dist };
  }

  getGazeDirection(): Vec2 {
    const facing = this.getFacing();
    if (this.phase === 'moving') {
      return facing;
    }
    return this.gazeSide === 1 ? rotateRight90(facing) : rotateLeft90(facing);
  }

  getGazeSide(): 1 | -1 {
    return this.gazeSide;
  }

  private destination(): Vec2 {
    return this.heading === 1 ? this.config.to : this.config.from;
  }

  private directionTo(which: 'from' | 'to'): Vec2 {
    const a = this.config.from;
    const b = this.config.to;
    const dist = distance(a, b);
    const v = which === 'to' ? { x: b.x - a.x, y: b.y - a.y } : { x: a.x - b.x, y: a.y - b.y };
    return { x: v.x / dist, y: v.y / dist };
  }
}
