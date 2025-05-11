const PLAYER_SPEED = 350;
const BULLET_SPEED = 500;
const OBSTACLE_SPEED_MIN = 100;
const OBSTACLE_SPEED_MAX = 250;
const SPAWN_INTERVAL_INITIAL = 1500; 
const SPAWN_INTERVAL_MIN = 500;
const DIFFICULTY_INCREASE_RATE = 50; 

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player = null;
        this.cursors = null;
        this.keyA = null;     
        this.keyD = null; 
        this.spacebar = null;
        this.bullets = null;
        this.obstacles = null;
        this.lastShotTime = 0;
        this.shootCooldown = 500; 

        this.score = 0;
        this.scoreText = null;
        this.timeSurvived = 0;
        this.timeSurvivedText = null;
        this.gameTimer = null;
        this.obstacleSpawnTimer = null;
        this.currentSpawnInterval = SPAWN_INTERVAL_INITIAL;

        this.winTime = 70; 
    }

    preload() {
        this.load.spritesheet('playerShip', 'assets/images/player_ship.png', {
            frameWidth: 21, 
            frameHeight: 22 
        });


        this.load.spritesheet('playerBullet', 'assets/images/player_bullet.png', {
            frameWidth: 16,
            frameHeight: 16 
        });
        
    }

    create() {
        console.log('GameScene started');
        this.score = 0;
        this.timeSurvived = 0;
        this.currentSpawnInterval = SPAWN_INTERVAL_INITIAL;

        // Background 
        this.background = this.add.tileSprite(0, 0, gameConfig.width, gameConfig.height, 'backgroundTile').setOrigin(0, 0);

        // Player
        this.player = this.physics.add.sprite(gameConfig.width / 2, gameConfig.height - 50, 'playerShip');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(2);
        this.player.setScale(2.5);
        this.player.body.setSize(this.player.width * 0.8, this.player.height * 0.8); 

        // Player Frame
        this.anims.create({
            key: 'playerShip_anim',
            frames: this.anims.generateFrameNumbers('playerShip', { start: 0, end: 4 }), 
            frameRate: 10, 
            repeat: -1 
        });

        // Play the player ship animation
        this.player.play('playerShip_anim');

        //Bullet Frame
        this.anims.create({
            key: 'bulletAnim',
            frames: this.anims.generateFrameNumbers('playerBullet', { start: 0, end: 1 }), 
            frameRate: 10, 
            repeat: -1 
        });

        

        // Bullets Group
        this.bullets = this.physics.add.group({
            defaultKey: 'playerBullet',
            maxSize: 30 
        });

        // Obstacles Group
        this.obstacles = this.physics.add.group();

        // Input
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); 
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); 

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // UI
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' });
        this.timeSurvivedText = this.add.text(gameConfig.width - 16, 16, 'Time: 0s', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(1, 0);

        // Collisions
        this.physics.add.overlap(this.player, this.obstacles, this.playerHitObstacle, null, this);
        this.physics.add.overlap(this.bullets, this.obstacles, this.bulletHitObstacle, null, this);

        // Timers
        // Game timer for score, time survived, and difficulty increase
        this.gameTimer = this.time.addEvent({
            delay: 1000, 
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });

        

        // Obstacle Spawner
        this.spawnObstacle(); 
        this.obstacleSpawnTimer = this.time.addEvent({
            delay: this.currentSpawnInterval,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
    }

    updateGameTime() {
        this.timeSurvived++;
        this.score += 10; 
        this.scoreText.setText('Score: ' + this.score);
        this.timeSurvivedText.setText('Time: ' + this.timeSurvived + 's');

        // Increase difficulty
        if (this.timeSurvived % 5 === 0 && this.currentSpawnInterval > SPAWN_INTERVAL_MIN) {
            this.currentSpawnInterval -= DIFFICULTY_INCREASE_RATE;
            if (this.obstacleSpawnTimer) {
                this.obstacleSpawnTimer.delay = this.currentSpawnInterval; 
            }
        }

        // Check for win condition
        if (this.timeSurvived >= this.winTime) {
            this.gameOver(true); 
        }
    }

    spawnObstacle() {
        const x = Phaser.Math.Between(30, gameConfig.width - 30); // Random X position
        const y = -50; 
        const obstacle = this.obstacles.create(x, y, 'obstacleAsteroid'); 
        obstacle.setVelocityY(Phaser.Math.Between(OBSTACLE_SPEED_MIN, OBSTACLE_SPEED_MAX));
        obstacle.setScale(Phaser.Math.FloatBetween(1.5, 3)); 
        obstacle.setImmovable(true);
        obstacle.body.setSize(obstacle.width * 0.9, obstacle.height * 0.9); 
    }

    playerShoot() {
        const currentTime = this.time.now;
        if (currentTime > this.lastShotTime + this.shootCooldown) {
            const bullet = this.bullets.get(this.player.x, this.player.y - this.player.height / 2);
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setVelocityY(-BULLET_SPEED);
                bullet.setScale(2);
                bullet.body.setSize(bullet.width * 0.7, bullet.height); 
                bullet.play('bulletAnim');
                this.sound.play('shootSFX', { volume: 1 });
                this.lastShotTime = currentTime;
            }
        }
    }

    playerHitObstacle(player, obstacle) {
        this.sound.play('hitSFX', {volume: 0.7});
        
        this.gameOver(false); 
    }

    bulletHitObstacle(bullet, obstacle) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.destroy(); 

        obstacle.setActive(false);
        obstacle.setVisible(false);
        obstacle.destroy(); 

        this.score += 50; 
        this.scoreText.setText('Score: ' + this.score);
        this.sound.play('hitSFX', { volume: 0.6 });
        

        this.spawnObstacle(); 
    }

    gameOver(didWin) {
        console.log('Game Over. Win:', didWin);
        this.physics.pause();
        if (this.gameTimer) this.gameTimer.remove(false);
        if (this.obstacleSpawnTimer) this.obstacleSpawnTimer.remove(false);
        

        // Pass score and time to GameOverScene
        this.scene.start('GameOverScene', {
            score: this.score,
            timeSurvived: this.timeSurvived,
            won: didWin
        });
    }


    update(time, delta) {
        // Scroll background
        this.background.tilePositionY -= 2; 

        // Player Movement
        this.player.setVelocityX(0);
        if (this.keyA.isDown) {
            this.player.setVelocityX(-PLAYER_SPEED);
        } else if (this.keyD.isDown) {
            this.player.setVelocityX(PLAYER_SPEED);
        }

        // Player Shooting
        if (this.spacebar.isDown) {
            this.playerShoot();
        }

        // Bullet cleanup
        this.bullets.children.each(bullet => {
            if (bullet.active && bullet.y < -bullet.height) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.destroy();
            }
        });

        // Obstacle cleanup and respawn
        this.obstacles.children.each(obstacle => {
            if (obstacle.active && obstacle.y > gameConfig.height + obstacle.height) {
                obstacle.setActive(false);
                obstacle.setVisible(false);
                obstacle.destroy();
                this.spawnObstacle(); 
            }
        });
    }
}