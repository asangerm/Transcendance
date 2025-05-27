import { TroopManager } from './TroopManager.js';

export class GameScene extends Phaser.Scene
{
	constructor() { super('GameScene'); }

	preload()
	{
		// setup de base
		const g = this.make.graphics({ x: 0, y: 0, add: false });
		g.fillStyle(0x55aa55, 1);
		g.fillRect(0, 0, 32, 32);
		g.generateTexture('melee', 32, 32);
		g.fillRect(0, 0, 24, 24);
		g.generateTexture('range', 24, 24);
		g.fillRect(0, 0, 38, 38);
		g.generateTexture('tank', 38, 38);
		g.destroy();
	}

	create()
	{
		this.scene.launch('UIScene');
		this.createWorld();

		// Ajoute un petit délai pour garantir que le listener est prêt
		this.time.delayedCall(50, () =>
		{
			this.scene.get('UIScene').events.emit('castle-ready', 
			{
				castleLeft: this.castleLeft,
				castleRight: this.castleRight
			});
		});
		this.troopManager = new TroopManager(this, this.castleLeft, this.castleRight);
	}

	createWorld()
	{
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

		// Création des châteaux avec physics
		this.castleLeft = this.physics.add.sprite(64, 720 - 90, 'castle');
		this.castleRight = this.physics.add.sprite(1280 - 64, 720 - 90, 'castle');
		
		// Configuration des propriétés physiques
		this.castleLeft.setOrigin(0, 1).setImmovable(true);
		this.castleRight.setOrigin(1, 1).setImmovable(true);
		
		// Initialisation de la santé
		this.castleLeft.health = 100;
		this.castleRight.health = 100;

		this.scene.get('UIScene').events.emit('castle-ready',
		{
			castleLeft: this.castleLeft,
			castleRight: this.castleRight
		});
	}

	update()
	{
		this.troopManager.update();
	}
}
