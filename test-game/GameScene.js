import { TroopManager } from './TroopManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // setup de base
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x55aa55, 1);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('troop', 32, 32);
    g.destroy();
  }

  create() {
	this.scene.launch('UIScene');
    this.createWorld();

	  // Ajoute un petit délai pour garantir que le listener est prêt
  	this.time.delayedCall(50, () => {
		this.scene.get('UIScene').events.emit('castle-ready', {
		castleLeft: this.castleLeft,
		castleRight: this.castleRight
		});
	});

    this.troopManager = new TroopManager(this, this.castleLeft, this.castleRight);

    this.time.addEvent({
      delay: 2000,
      callback: () => this.troopManager.spawnTroop('left'),
      loop: true
    });

    this.time.addEvent({
      delay: 2000,
      callback: () => this.troopManager.spawnTroop('right'),
      loop: true
    });
  }

  createWorld() {
    // Route
    const g2 = this.make.graphics({ x: 0, y: 0, add: false });
    g2.fillStyle(0x888888, 1);
    g2.fillRect(0, 0, 1280, 90);
    g2.generateTexture('road', 1280, 90);
    g2.destroy();

    this.add.image(0, 720, 'road').setOrigin(0, 1);

    // Châteaux
    const g1 = this.make.graphics({ x: 0, y: 0, add: false });
    g1.fillStyle(0xccd0d0, 1);
    g1.fillRect(0, 0, 64, 160);
    g1.generateTexture('castle', 64, 160);
    g1.destroy();

    this.castleLeft = this.add.image(64, 720 - 90, 'castle').setOrigin(0, 1);
    this.castleRight = this.add.image(1280 - 64, 720 - 90, 'castle').setOrigin(1, 1);
    this.castleLeft.health = 100;
    this.castleRight.health = 100;

	this.scene.get('UIScene').events.emit('castle-ready', {
	castleLeft: this.castleLeft,
	castleRight: this.castleRight
	});
  }

  update() {
    this.troopManager.update();
  }
}
