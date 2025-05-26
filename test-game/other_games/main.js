let canon;
let support;
let bullets;
let shootDelay = 300;

const config =
{
  type: Phaser.AUTO,

  scale:
  {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },

  physics:
  {
    default: 'arcade',
    arcade: { debug: false }
  },

  backgroundColor: '#2d2d2d',

  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {}

function create()
{
  // Générer une texture pour le canon (rectangle)
  const g1 = this.make.graphics({ x: 0, y: 0, add: false });
  g1.fillStyle(0xccd0d0, 1);
  g1.fillRect(0, 0, 15, 50);
  g1.generateTexture('canon', 15, 50);

  // Générer une texture pour le support (cercle)
  const g2 = this.make.graphics({ x: 0, y: 0, add: false });
  g2.fillStyle(0xccd0d0, 1);
  g2.fillCircle(26, 26, 26);
  g2.generateTexture('support', 52, 52);

  // Ajouter le support et le canon comme images
  support = this.add.image(this.scale.width / 2, this.scale.height / 2, 'support');
  canon = this.add.image(this.scale.width / 2, this.scale.height / 2, 'canon');
  canon.setOrigin(0.5, 1); // Pivot en bas

  this.canon = canon;
  this.support = support;

  this.scale.on('resize', (gameSize) =>
  {
    this.canon.setPosition(gameSize.width / 2, gameSize.height / 2);
    this.support.setPosition(gameSize.width / 2, gameSize.height / 2);
  });

  // Générer la texture bullet
  const graphics = this.make.graphics({ x: 0, y: 0, add: false });
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(5, 5, 5);
  graphics.generateTexture('bullet', 10, 10);

  bullets = this.physics.add.group();

  this.time.addEvent(
  {
    delay: shootDelay,
    loop: true,
    callback: shoot,
    callbackScope: this
  });
}

function shoot()
{
  const pointer = this.input.activePointer;

  // Coordonnées du pivot du canon
  const baseX = this.canon.x;
  const baseY = this.canon.y;

  // Calcul de l'angle du canon
  const dx = pointer.worldX - baseX;
  const dy = pointer.worldY - baseY;
  const angle = Math.atan2(dy, dx);

  // Longueur du canon (hauteur de la texture)
  const barrelLength = 50;

  // Calcul de la position du bout du canon
  const bulletX = baseX + Math.cos(angle) * barrelLength;
  const bulletY = baseY + Math.sin(angle) * barrelLength;

  // Création du projectile
  const bullet = this.physics.add.image(bulletX, bulletY, 'bullet');
  bullets.add(bullet);
  bullet.body.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
  bullet.setCollideWorldBounds(false);
  bullet.setBounce(1);
  bullet.body.allowGravity = false;
}

function update()
{
  const pointer = this.input.activePointer;
  const dx = pointer.worldX - this.canon.x;
  const dy = pointer.worldY - this.canon.y;
  this.canon.rotation = Math.atan2(dy, dx) + Math.PI / 2;
}