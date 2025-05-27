import { CustomButton } from './CustomButton.js';

export class UIScene extends Phaser.Scene
{
  constructor() {
    super({ key: 'UIScene', active: true });
  }

  create() {
    this.events.once('castle-ready', ({ castleLeft, castleRight }) => {
    	console.log('Châteaux reçus', castleLeft, castleRight);
		this.castleLeft = castleLeft;
      this.castleRight = castleRight;

      // Crée les textes SEULEMENT quand les châteaux sont prêts
      this.castleLeftHealthText = this.add.text(100, 100, '', { font: '20px Arial', fill: '#fff' }).setOrigin(0.5);
      this.castleRightHealthText = this.add.text(100, 100, '', { font: '20px Arial', fill: '#fff' }).setOrigin(0.5);
      
      // On crée les boutons une fois que tout est prêt
      this.createButtons();
    });
  }

  createButtons() {
    // Récupérer la référence au troopManager depuis la GameScene
    const gameScene = this.scene.get('GameScene');
    
    // Configuration des boutons pour l'équipe de gauche
    const leftButtons = [
      {
        text: 'Soldat',
        type: 'MELEE',
        color: 0x55aa55,
        cooldown: 2000
      },
      {
        text: 'Tank',
        type: 'TANK',
        color: 0x8888ff,
        cooldown: 3000
      },
      {
        text: 'Archer',
        type: 'RANGE',
        color: 0xff8888,
        cooldown: 2500
      }
    ];

    // Création des boutons pour l'équipe de gauche
    leftButtons.forEach((btn, index) => {
      new CustomButton(
        this,
        100,
        150 + (index * 70),
        btn.text,
        () => gameScene.troopManager.spawnTroop('left', btn.type),
        {
          cooldown: btn.cooldown,
          color: btn.color,
          width: 120
        }
      );
    });

    // Création des boutons pour l'équipe de droite (IA)
    leftButtons.forEach((btn, index) => {
      new CustomButton(
        this,
        1180,
        150 + (index * 70),
        btn.text,
        () => gameScene.troopManager.spawnTroop('right', btn.type),
        {
          cooldown: btn.cooldown,
          color: btn.color,
          width: 120
        }
      );
    });
  }

  update() {
    if (!this.castleLeft || !this.castleRight) return;

    // Mise à jour du texte avec la santé actuelle
    this.castleLeftHealthText.setText(`HP: ${Math.max(0, Math.floor(this.castleLeft.health))}`);
    this.castleRightHealthText.setText(`HP: ${Math.max(0, Math.floor(this.castleRight.health))}`);

    // Mise à jour de la position des textes
    this.castleLeftHealthText.setPosition(
      this.castleLeft.x + 32, // Centre du château
      this.castleLeft.y - 180 // Au-dessus du château
    );
    this.castleRightHealthText.setPosition(
      this.castleRight.x - 32, // Centre du château
      this.castleRight.y - 180 // Au-dessus du château
    );

    // Changement de couleur en fonction de la santé
    this.updateHealthColor(this.castleLeftHealthText, this.castleLeft.health);
    this.updateHealthColor(this.castleRightHealthText, this.castleRight.health);
  }

  updateHealthColor(text, health) {
    if (health > 70) {
      text.setColor('#00ff00'); // Vert pour bonne santé
    } else if (health > 30) {
      text.setColor('#ffff00'); // Jaune pour santé moyenne
    } else {
      text.setColor('#ff0000'); // Rouge pour santé critique
    }
  }
}
