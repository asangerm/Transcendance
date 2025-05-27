// Définition des types de troupes
const TROOP_TYPES = {
  MELEE: {
    key: 'melee',
    texture: 'melee',
    hp: 10,
    damage: 1,
    speed: 40,
    cost: 10,
    castleDamage: 10,
    color: 0x55aa55,
    attackRange: 40,  // Portée d'attaque minimale
    walkStopRange: 30,  // Plus grande que la portée d'attaque
    size: { width: 32, height: 32 }  // Taille de collision
  },
  TANK: {
    key: 'tank',
    texture: 'tank',
    hp: 30,
    damage: 0.5,
    speed: 40,
    cost: 30,
    castleDamage: 3,
    color: 0x8888ff,
    scale: 1.2,
    attackRange: 50,
    walkStopRange: 30,
    size: { width: 38, height: 38 }
  },
  RANGE: {
    key: 'range',
    texture: 'range',
    hp: 5,
    damage: 1.5,
    speed: 40,
    cost: 15,
    castleDamage: 2,
    color: 0xff8888,
    scale: 0.8,
    attackRange: 100,  // Grande portée d'attaque
    walkStopRange: 30,
    size: { width: 25, height: 25 }
  }
};

export class TroopManager {
  constructor(scene, castleLeft, castleRight) {
    this.scene = scene;
    this.castleLeft = castleLeft;
    this.castleRight = castleRight;
    this.troops = scene.physics.add.group();
    this.attackZones = new Map(); // Pour stocker les zones d'attaque
    this.attackZoneGraphics = new Map(); // Pour stocker les visualisations
    this.WalkStopZoneGraphics = new Map(); // Pour stocker les visualisations

    // Map pour suivre le dernier moment où une troupe a infligé des dégâts
    this.lastDamageTime = new Map();
    // Délai minimum entre chaque dégât (en ms)
    this.damageDelay = 1000;

    this.setupCollisions();
  }

  setupCollisions() {
    // Collisions entre troupes
    this.scene.physics.add.collider(this.troops, this.troops);

    // Collisions avec les châteaux (sans dégâts, juste physique)
    this.scene.physics.add.collider(this.troops, this.castleLeft);
    this.scene.physics.add.collider(this.troops, this.castleRight);
  }

  spawnTroop(team, troopType = 'MELEE') {
    const type = TROOP_TYPES[troopType];
    if (!type) {
      console.error(`Type de troupe inconnu: ${troopType}`);
      return null;
    }

    const y = 720 - 90;
    const x = team === 'left' ? 64 + 64 : 1280 - 64 - 64;
    const vx = team === 'left' ? type.speed : -type.speed;

    // Création de la troupe
    const troop = this.scene.physics.add.sprite(x, y, type.texture);

    // Configuration de base
	if (team === 'left') {
		troop.setOrigin(1, 1);
	} else {
		troop.setOrigin(0, 1);
	}
    troop.setVelocityX(vx);
    
    // Ajustement de la boîte de collision
    troop.body.setSize(type.size.width, type.size.height);
    
    // Propriétés spécifiques au type
    troop.team = team;
    troop.hp = type.hp;
    troop.damage = type.damage;
    troop.castleDamage = type.castleDamage;
    troop.baseSpeed = type.speed;
    troop.troopType = type.key;
    troop.attackRange = type.attackRange;
    troop.walkStopRange = type.walkStopRange;
    troop.facing = team;

    // Apparence
    if (type.scale) {
      troop.setScale(type.scale);
    }
    troop.setTint(type.color);

    // Créer la visualisation de la zone d'attaque
    const graphics = this.scene.add.graphics();
    this.attackZoneGraphics.set(troop, graphics);

    // Créer la visualisation de la zone d'arrêt
    const walkStopGraphics = this.scene.add.graphics();
    this.WalkStopZoneGraphics.set(troop, walkStopGraphics);

    this.troops.add(troop);
    return troop;
  }

  update() {
    this.troops.getChildren().forEach(troop => {
      if (!troop.active) return;

      // Mise à jour de la visualisation de la zone d'attaque
      const graphics = this.attackZoneGraphics.get(troop);
      if (graphics) {
        graphics.clear();
        graphics.lineStyle(1, 0xff0000, 0.3);
        graphics.fillStyle(0xff0000, 0.1);
        
        const centerY = troop.y;
        const startAngle = troop.facing === 'left' ? -90 : 90;
        const endAngle = troop.facing === 'left' ? 90 : 270;
        
        // Dessiner l'arc rempli pour la zone d'attaque
        graphics.beginPath();
        graphics.arc(
          troop.x,
          centerY,
          troop.attackRange,
          Phaser.Math.DegToRad(startAngle),
          Phaser.Math.DegToRad(endAngle),
          false
        );
        graphics.fillPath();
        graphics.strokePath();
      }

      // Mise à jour de la visualisation de la zone d'arrêt
      const walkStopGraphics = this.WalkStopZoneGraphics.get(troop);
      if (walkStopGraphics) {
        walkStopGraphics.clear();
        walkStopGraphics.lineStyle(1, 0x00ff00, 0.3);
        walkStopGraphics.fillStyle(0x00ff00, 0.1);
        
        const centerY = troop.y;
        const startAngle = troop.facing === 'left' ? -90 : 90;
        const endAngle = troop.facing === 'left' ? 90 : 270;
        
        // Dessiner l'arc rempli pour la zone d'arrêt
        walkStopGraphics.beginPath();
        walkStopGraphics.arc(
          troop.x,
          centerY,
          troop.walkStopRange,
          Phaser.Math.DegToRad(startAngle),
          Phaser.Math.DegToRad(endAngle),
          false
        );
        walkStopGraphics.fillPath();
        walkStopGraphics.strokePath();
      }

      // Vérifier les autres troupes et les châteaux pour la zone d'arrêt et d'attaque
      let hasTargetInWalkStopRange = false;
      let hasTargetInAttackRange = false;

      // Vérification des troupes
      this.troops.getChildren().forEach(otherTroop => {
        if (troop !== otherTroop && otherTroop.active) {
          if (this.isInRange(troop, otherTroop, troop.walkStopRange)) {
            hasTargetInWalkStopRange = true;
          }
          if (this.isInRange(troop, otherTroop, troop.attackRange)) {
            hasTargetInAttackRange = true;
            
            // Si c'est un ennemi, on l'attaque
            if (troop.team !== otherTroop.team) {
              const currentTime = Date.now();
              const lastTime = this.lastDamageTime.get(troop) || 0;

              if (currentTime - lastTime >= this.damageDelay) {
                this.damage(troop, otherTroop);
                this.lastDamageTime.set(troop, currentTime);
              }
            }
          }
        }
      });

      // Vérification des châteaux
      const targetCastle = troop.team === 'left' ? this.castleRight : this.castleLeft;
      if (this.isInRangeCastle(troop, targetCastle, troop.walkStopRange)) {
        hasTargetInWalkStopRange = true;
      }
      if (this.isInRangeCastle(troop, targetCastle, troop.attackRange)) {
        hasTargetInAttackRange = true;
        
        // Attaque du château
        const currentTime = Date.now();
        const lastTime = this.lastDamageTime.get(troop) || 0;

        if (currentTime - lastTime >= this.damageDelay) {
          targetCastle.health -= troop.castleDamage;
          this.lastDamageTime.set(troop, currentTime);
        }
      }

      // Gérer le mouvement
      if (hasTargetInWalkStopRange) {
        troop.setVelocityX(0);
      } else if (!troop.body.velocity.x && troop.hp > 0) {
        const dir = troop.team === 'left' ? 4 : -4;
        troop.setVelocityX(dir * troop.baseSpeed);
      }
    });
  }

  isInRange(attacker, target, range) {
    // Position du centre de l'attaquant et de la cible
	const targetCenter = {
		x: target.x,
		y: target.y - (target.body.height / 2)
	};
	if (attacker.team === target.team) {
		if (attacker.team ===	'left') {
			targetCenter.x = target.x - target.body.width;
		} else {
			targetCenter.x = target.x + target.body.width;
		}
	}
    const attackerCenter = {
      x: attacker.x,
      y: attacker.y - (attacker.body.height / 2)
    };

    // Calculer la distance entre les deux troupes
    const distance = Phaser.Math.Distance.Between(
      attackerCenter.x,
      attackerCenter.y,
      targetCenter.x,
      targetCenter.y
    );

    // Si la distance est supérieure à la portée, pas besoin de vérifier l'angle
    if (distance > range) {
      return false;
    }

    // Calculer l'angle entre l'attaquant et la cible
    let angle = Phaser.Math.Angle.Between(
      attackerCenter.x,
      attackerCenter.y,
      targetCenter.x,
      targetCenter.y
    );

    // Convertir en degrés et normaliser entre 0 et 360
    let degrees = Phaser.Math.RadToDeg(angle);
    if (degrees < 0) degrees += 360;

    // Vérifier si la cible est dans le bon secteur selon la direction
    if (attacker.facing === 'left') {
      return (degrees >= 270 || degrees <= 90);
    } else {
      return (degrees >= 90 && degrees <= 270);
    }
  }

  isInRangeCastle(attacker, castle, range) {
    const attackerCenter = {
      x: attacker.x,
      y: attacker.y - (attacker.body.height / 2)
    };

    const castleCenter = {
      x: castle.x + (attacker.team === 'left' ? -castle.body.width : castle.body.width),
      y: castle.y
    };

    // Calculer la distance entre l'attaquant et le château
    const distance = Phaser.Math.Distance.Between(
      attackerCenter.x,
      attackerCenter.y,
      castleCenter.x,
      castleCenter.y
    );

    // Si la distance est supérieure à la portée, pas besoin de vérifier l'angle
    if (distance > range) {
      return false;
    }

    // Calculer l'angle entre l'attaquant et le château
    let angle = Phaser.Math.Angle.Between(
      attackerCenter.x,
      attackerCenter.y,
      castleCenter.x,
      castleCenter.y
    );

    // Convertir en degrés et normaliser entre 0 et 360
    let degrees = Phaser.Math.RadToDeg(angle);
    if (degrees < 0) degrees += 360;

    // Vérifier si le château est dans le bon secteur selon la direction
    if (attacker.facing === 'left') {
      return (degrees >= 270 || degrees <= 90);
    } else {
      return (degrees >= 90 && degrees <= 270);
    }
  }

  damage(attacker, target) {
    target.hp -= attacker.damage;
    this.showDamageEffect(target);

    if (target.hp <= 0) {
      const graphics = this.attackZoneGraphics.get(target);
      const walkStopZoneGraphics = this.WalkStopZoneGraphics.get(target);
      if (graphics) {
        graphics.destroy();
        this.attackZoneGraphics.delete(target);
      }
      if (walkStopZoneGraphics) {
        walkStopZoneGraphics.destroy();
        this.WalkStopZoneGraphics.delete(target);
      }
      target.destroy();
    }
  }

  showDamageEffect(troop) {
    const originalTint = troop.tintTopLeft;
    troop.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (troop.active) {
        troop.setTint(originalTint);
      }
    });
  }
}