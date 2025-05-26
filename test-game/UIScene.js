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
    });
  }

  update() {
    if (!this.castleLeft || !this.castleRight) return;

    this.castleLeftHealthText.setText(`HP: ${this.castleLeft.health}`);
    this.castleRightHealthText.setText(`HP: ${this.castleRight.health}`);

    this.castleLeftHealthText.setPosition(this.castleLeft.x + this.castleLeft.width / 2, this.castleLeft.y - this.castleLeft.height - 20);
    this.castleRightHealthText.setPosition(this.castleRight.x - this.castleRight.width / 2, this.castleRight.y - this.castleRight.height - 20);
  }
}
