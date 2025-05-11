class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Load Images 
        
        this.load.image('obstacleAsteroid', 'assets/images/obstacle_asteroid.png');
        this.load.image('backgroundTile', 'assets/images/space_background_tile.png');
        this.load.image('playButton', 'assets/images/button_play.png');
        this.load.image('restartButton', 'assets/images/button_restart.png');

        // Load Spritesheets 
        this.load.spritesheet('key_A_spritesheet', 'assets/images/A.png', {
            frameWidth: 19, 
            frameHeight: 21 
        });
        this.load.spritesheet('key_D_spritesheet', 'assets/images/D.png', {
            frameWidth: 19, 
            frameHeight: 21  
        });
        this.load.spritesheet('key_Space_spritesheet', 'assets/images/SPACE.png', {
            frameWidth: 98, 
            frameHeight: 21  
        });

        // Load Audio 
        this.load.audio('backgroundMusic', ['assets/audio/background_music.ogg', 'assets/audio/background_music.mp3']);
        this.load.audio('shootSFX', 'assets/audio/shoot.mp3');
        this.load.audio('hitSFX', 'assets/audio/explosion.wav');
    }

    create() {
        console.log('MenuScene started');
        // Add a background
        this.add.image(gameConfig.width / 2, gameConfig.height / 2, 'backgroundTile')
            .setDisplaySize(gameConfig.width, gameConfig.height);

        this.add.text(gameConfig.width / 2, gameConfig.height * 0.25, 'Into the Void', {
            fontSize: '48px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);

        const playButton = this.add.image(gameConfig.width / 2, gameConfig.height * 0.45, 'playButton')
            .setInteractive({ useHandCursor: true })
            .setScale(0.8);

        playButton.on('pointerdown', () => {
            if (!this.sys.game.isMusicPlaying) {
                this.sys.game.bgMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.4 });
                this.sys.game.bgMusic.play();
                this.sys.game.isMusicPlaying = true;
            }
            this.scene.start('GameScene');
        });
        playButton.on('pointerover', () => playButton.setScale(0.9));
        playButton.on('pointerout', () => playButton.setScale(0.8));

        // Title
        this.add.text(gameConfig.width / 2, 350, 'Controls:', {
            fontSize: '28px', fill: '#fff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create animations for the keys
        this.anims.create({
            key: 'keyA_anim',
            frames: this.anims.generateFrameNumbers('key_A_spritesheet', { start: 0, end: 2 }), 
            frameRate: 4, 
            repeat: -1 
        });

        this.anims.create({
            key: 'keyD_anim',
            frames: this.anims.generateFrameNumbers('key_D_spritesheet', { start: 0, end: 2 }),
            frameRate: 4, 
            repeat: -1 
        });

        this.anims.create({
            key: 'keySpace_anim',
            frames: this.anims.generateFrameNumbers('key_Space_spritesheet', { start: 0, end: 2 }), 
            frameRate: 4,
            repeat: -1 
        });

        // Key Sprite
        let keyA = this.add.sprite(375, 400, 'key_A_spritesheet');
        keyA.setScale(2); 
        keyA.play('keyA_anim'); 

       
        let keyD = this.add.sprite(425, 400, 'key_D_spritesheet');
        keyD.setScale(2);
        keyD.play('keyD_anim');

        
        let keySpace = this.add.sprite(400, 450, 'key_Space_spritesheet');
        keySpace.setScale(1.5);
        keySpace.play('keySpace_anim');
    }
}
