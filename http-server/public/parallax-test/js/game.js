window.onload = function() {

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
   
    //background image
    game.load.image('background','img/starfield.jpg');

    //player image
    game.load.image('player', 'img/car.png');

}
var background;
var player;
var cursors;

function create() {
  
    game.stage.backgroundColor = '#182d3b';

    //image is 800 by 600 but we use power of 2 to enable looping of tileSprite
    background = game.add.tileSprite(0, 0, 800, 800, 'background');

    game.world.setBounds(0, 0, 1920, 600);

    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

    player.body.fixedRotation = true;

    cursors = this.input.keyboard.createCursorKeys();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

}

function update() {

    player.body.setZeroVelocity();

    if (cursors.up.isDown)
    {
        player.body.moveUp(300)
    }
    else if (cursors.down.isDown)
    {
        player.body.moveDown(300);
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(300);
    }
        

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);

}

    };