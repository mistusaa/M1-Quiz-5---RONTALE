const gameConfig = {
    type: Phaser.AUTO,
    width: 800,  
    height: 600,
    parent: 'game-container', 
    physics: {
        default: 'arcade',
        arcade: {
           
            debug: false 
        }
    },
    scene: [MenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(gameConfig);

game.isMusicPlaying = false;
game.bgMusic = null;