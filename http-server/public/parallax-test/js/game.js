window.onload = function() {

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


//this function is used to load images etc before doing something with them
function preload() {
   
    //background image
    game.load.image('background','img/starfield.jpg');

    //player image
    game.load.spritesheet('player', 'img/snake_all.png', 32, 32);




}
var background;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;

//this function is used to initialise base values
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
  
    game.stage.backgroundColor = '#182d3b';

        game.world.setBounds(0, 0, 1920, 600);

    //image is 800 by 600 but we use power of 2 to enable looping of tileSprite
    background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');


    

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);

//add animations
    //every 10 frames define a "move"
    // 0-9 = idle
    // 10-19 = gesture
    // 20-29 = move
    // 30-39 = attack
    // 40-49 = jump
    player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    player.animations.add('gesture', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
    player.animations.add('move', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
    player.animations.add('attack', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 10, true);
    player.animations.add('jump', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);

    cursors = this.input.keyboard.createCursorKeys();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

//this is the game loop, this updates x-times a second
function update() {


    //this makes it so the background moves slowly
    //background.tilePosition.x += 0.5;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.scale.x =1;
            player.animations.play('move');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.scale.x =-1;
            player.animations.play('move');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.play('idle');

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.animations.play('jump');
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
        

}

//an additional layer on top of the game, useful for debugging
function render() {

    game.debug.cameraInfo(game.camera, 32, 32);

}

    };