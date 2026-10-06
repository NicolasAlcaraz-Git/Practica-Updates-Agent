import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_TITLE, GAME_WIDTH } from './core/constants';

class ScaffoldScene extends Phaser.Scene {
  constructor() {
    super('scaffold');
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_TITLE, {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#e8eef5',
      })
      .setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'app',
  backgroundColor: '#101418',
  scene: ScaffoldScene,
});
