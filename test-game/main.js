import { GameScene } from './GameScene.js';
import { UIScene } from './UIScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a1a',
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: true }
  },
  scene: [GameScene, UIScene]
};

new Phaser.Game(config);
