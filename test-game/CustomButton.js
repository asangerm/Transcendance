export class CustomButton
{
	constructor(scene, x, y, text, onClick, options = {})
	{
		this.scene = scene;
		this.isOnCooldown = false;
		this.cooldownDuration = options.cooldown || 2000;

		const buttonWidth = options.buttonWidth || 130;
		const buttonHeight = options.buttonHeight || 50;
		const buttonColor = options.buttonColor || 0xb81a1a;
		const textStyle = options.textStyle || 
		{ 
			fontSize: '16px', 
			fontFamily: 'Arial', 
			color: '#ffffff' 
		};

		const name = 'buttonTexture_' + buttonWidth + '_' + buttonHeight

		//Création de la texture du bouton
		if (!scene.textures.exists(name))
		{
			const buttonGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
            
            // Ombre
            buttonGraphics.fillStyle(0x000000, 0.4);
            buttonGraphics.fillRoundedRect(5, 5, buttonWidth, buttonHeight, 10);
            // Couleur de fond du bouton
            buttonGraphics.fillStyle(buttonColor, 1);
            buttonGraphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
            buttonGraphics.generateTexture(name, buttonWidth + 5, buttonHeight + 5);
            buttonGraphics.destroy();
		}

		// Création du bouton
		this.button = scene.add.image(x, y, name).setInteractive({useHandCursor : true});

		this.text = scene.add.text(x, y, text, textStyle).setOrigin(0.5);

		// Barre de chargement
		this.progressBar = scene.add.graphics();
		this.progressBar.setVisible(false);

		// Dimensions de la barre de progression
		this.progressWidth = buttonWidth - 10; // un peu plus petit que le bouton
		this.progressHeight = 50;
		this.buttonWidth = buttonWidth;
		this.buttonHeight = buttonHeight;

		this.setupInteraction(onClick);
	}

	setupInteraction(onClick)
	{
		const originalY = this.button.y;

		// Survolement du bouton
		this.button.on('pointerover', () =>
		{
			if (!this.isOnCooldown)
			{
				this.button.setTint(0xc1bebe);
			}
		});

		this.button.on('pointerout', () =>
		{
			if (!this.isOnCooldown)
			{
				this.button.clearTint();
			}
		});

		this.button.on('pointerdown', () =>
		{
			if (!this.isOnCooldown)
			{
                this.button.setTint(0xc1bebe);
                this.button.setY(originalY + 3);
                this.text.setY(originalY + 3);
			}
		});

		this.button.on('pointerup', () =>
		{
			if (!this.isOnCooldown)
			{
				this.button.clearTint();
                this.button.setY(originalY);
                this.text.setY(originalY);
				this.startCooldown(onClick);
			}
		});
	}

	startCooldown(onClick)
	{
		if (this.isOnCooldown) return;

		this.isOnCooldown = true;

        // Afficher et réinitialiser la barre de progression
        this.progressBar.setVisible(true);
        this.updateProgressBar(0);

		let elapsed = 0;
        const interval = 16; // ~60fps

		const updateTimer = this.scene.time.addEvent(
		{
            delay: interval,
            callback: () =>
			{
                elapsed += interval;
                const progress = elapsed / this.cooldownDuration;
                this.updateProgressBar(progress);

                if (elapsed >= this.cooldownDuration)
				{
                    updateTimer.destroy();
                    this.endCooldown();
					onClick();
                }
            },
            loop: true
        });
		
	}

	
    updateProgressBar(progress)
	{
        const x = this.button.x - this.buttonWidth / 2 ;
        const y = this.button.y + (this.buttonHeight / 2) - this.progressHeight - 2;
        const radius = 8;

        this.progressBar.clear();
        
        // Fond de la barre
        this.progressBar.fillStyle(0xc1bebe, 0);
        this.progressBar.fillRect(x, y, this.progressWidth, this.progressHeight);
        
        // Barre de progression
        if (progress >= 0)
		{
            const width = this.progressWidth * progress;
            this.progressBar.fillStyle(0xc1bebe, 0.5);

            // Dessine un rectangle pour le corps de la barre
            this.progressBar.fillRect(x + radius, y, Math.max(0, width - radius), this.progressHeight);

            // Dessine le côté gauche arrondi
            this.progressBar.beginPath();
            this.progressBar.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
            this.progressBar.arc(x + radius, y + this.progressHeight - radius, radius, Math.PI * 0.5, Math.PI);
            this.progressBar.fill();
        }
    }

    endCooldown()
	{
        this.isOnCooldown = false;
        this.button.clearTint();
        this.progressBar.setVisible(false);
    }

    setPosition(x, y)
	{
        this.button.setPosition(x, y);
        this.text.setPosition(x, y);
        return this;
    }

    setVisible(visible)
	{
        this.button.setVisible(visible);
        this.text.setVisible(visible);
        this.progressBar.setVisible(visible && this.isOnCooldown);
        return this;
    }

    destroy()
	{
        this.button.destroy();
        this.text.destroy();
        this.progressBar.destroy();
    }
}