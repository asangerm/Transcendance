export class TroopManager {
  constructor(scene, castleLeft, castleRight) {
    this.scene = scene;
    this.castleLeft = castleLeft;
    this.castleRight = castleRight;
    this.troops = scene.physics.add.group();
    this.speed = 40;

    scene.physics.add.collider(this.troops, this.troops, (a, b) => {
      if (a.team !== b.team) {
        a.setVelocityX(0);
        b.setVelocityX(0);
        this.damage(a, b);
      }
    });

    // Collisions avec les châteaux via this.castleLeft / this.castleRight
    scene.physics.add.overlap(this.troops, this.castleLeft, (troop) => {
      if (troop.team === 'right') {
        this.castleLeft.health -= 5;
        troop.destroy();
      }
    });

    scene.physics.add.overlap(this.troops, this.castleRight, (troop) => {
      if (troop.team === 'left') {
        this.castleRight.health -= 5;
        troop.destroy();
      }
    });
  }

  spawnTroop(team) {
    const y = 720 - 90 - 32; // Sur la route
    const x = team === 'left' ? 64 + 64 : 1280 - 64 - 64;
    const vx = team === 'left' ? this.speed : -this.speed;

    const troop = this.scene.physics.add.sprite(x, y, 'troop');
    troop.setOrigin(0.5, 1);
    troop.setVelocityX(vx);
    troop.team = team;
    troop.hp = 10;

    this.troops.add(troop);
  }

  damage(a, b) {
    a.hp -= 1;
    b.hp -= 1;

    if (a.hp <= 0) a.destroy();
    if (b.hp <= 0) b.destroy();
  }

  update() {
    this.troops.getChildren().forEach(troop => {
      if (!troop.body.velocity.x && troop.hp > 0) {
        const dir = troop.team === 'left' ? 1 : -1;
        troop.setVelocityX(dir * this.speed);
      }
    });
  }
}