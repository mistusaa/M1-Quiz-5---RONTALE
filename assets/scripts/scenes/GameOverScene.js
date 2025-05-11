class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        // Receive data from GameScene
        this.finalScore = data.score;
        this.finalTime = data.timeSurvived;
        this.wonGame = data.won;
    }

    create() {
        console.log('GameOverScene started');
        this.add.image(gameConfig.width / 2, gameConfig.height / 2, 'backgroundTile')
             .setDisplaySize(gameConfig.width, gameConfig.height);

        let message = this.wonGame ? 'YOU WON!' : 'GAME OVER';
        let messageColor = this.wonGame ? '#00ff00' : '#ff0000';

        this.add.text(gameConfig.width / 2, gameConfig.height / 2 - 100, message, {
            fontSize: '64px', fill: messageColor, fontStyle: 'bold', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(gameConfig.width / 2, gameConfig.height / 2, `Score: ${this.finalScore}`, {
            fontSize: '32px', fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(gameConfig.width / 2, gameConfig.height / 2 + 40, `Time Survived: ${this.finalTime}s`, {
            fontSize: '32px', fill: '#fff'
        }).setOrigin(0.5);

        const restartButton = this.add.image(gameConfig.width / 2, gameConfig.height / 2 + 120, 'restartButton')
            .setInteractive({ useHandCursor: true })
            .setScale(0.4);

        restartButton.on('pointerdown', () => {
            
            this.scene.start('MenuScene'); 
        });
        restartButton.on('pointerover', () => restartButton.setScale(0.5));
        restartButton.on('pointerout', () => restartButton.setScale(0.4));
    }
}
