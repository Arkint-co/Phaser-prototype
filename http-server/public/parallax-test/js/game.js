window.onload = function() {

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


//this function is used to load images etc before doing something with them
function preload() {
   
    //load background layers
    game.load.image('background_back','img/background_back.png');
    game.load.image('background_layer1','img/background_layer1.png');
    game.load.image('background_layer2','img/background_layer2.png');
    game.load.image('background_layer3','img/background_layer3.png');
    game.load.image('background_layer4','img/background_layer4.png');

    //player image, the 32, 32 determine the width and height of each sprite
    game.load.spritesheet('player', 'img/snake_all.png', 32, 32);

    // platform image
    game.load.image('background','img/starfield.jpg');




}
var background;
var player;
var facing = 'idle';
var jumpTimer = 0;
var attackTimer = 0;
var cursors;
var jumpButton;
var floor; 
var jumping;
var platform;
var attacking = 1;


//this function is used to initialise base values
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
  
    //game.stage.backgroundColor = '#182d3b';

        game.world.setBounds(0, 0, 1920, 600);

    //image is 800 by 600 but we use power of 2 to enable looping of tileSprite
    //order in which these are loaded are important!
    background_back = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background_back');
    background_layer4 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background_layer4');
    background_layer3 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background_layer3');
    background_layer2 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background_layer2');
    background_layer1 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background_layer1');





    

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);

//add animations
    //every 10 frames define a "move", the 10 after that means the duration of the aniamtion, true just means it will keep looping
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
    attackButton = game.input.keyboard.addKey(Phaser.Keyboard.F);

    player.body.collideWorldBounds = true;
    game.physics.arcade.gravity.y = 150;
    player.body.gravity.y = 150;
}

//this is the game loop, this updates x-times a second
function update() {


    //this makes it so the background moves slowly
    //background.tilePosition.x += 0.5;
    background_layer4.tilePosition.x = -player.body.x*0.01;
    background_layer3.tilePosition.x = -player.body.x*0.1;
    background_layer2.tilePosition.x = -player.body.x*0.2;
    background_layer1.tilePosition.x = -player.body.x*0;
    // if left button is down
    if (cursors.left.isDown)
    {
        // set velocity to negative value (so the physics will move to left) 
        player.body.velocity.x = -150;

        // if the player is not yet facing left
        if (facing != 'left')
        {
            // invert sprite (mirror)
            player.scale.x = 1;
            // start the 'move' animation
            player.animations.play('move');
            // set facing to left so this condition does not get triggered constantly
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
    // if player has started jumping and landed (a.k.a. jump has ended) set jumping back to false
    else if (jumping == true && player.body.onFloor() ) {
            facing = 'idle';
            jumping = false 
    }
    // in all other cases
    else
    { 
        // because jumping is seperate from this if/else we need to test for it here
        // if not jumping or attacking, then it must be idle (because this is the only other statement for movement)
        if (facing != 'jump' && facing != 'attack'){
            facing = 'idle';
        }
        //set velocity to 0 so it stops moving
        player.body.velocity.x = 0;
        
        if (facing == 'idle')
        {
            player.animations.play('idle');
        }
    }

    // seperate from above if/else statements because you can do it simultaneously e.g. you can jump while moving right
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        
        // set y velocity to negative value to move player up
        player.body.velocity.y = -250;
       
        if (facing != 'jump')
        {
            player.animations.play('jump');
            jumpTimer = game.time.now + 750;
            facing = 'jump';
            jumping = true; 
        }
    }
    // seperate from above if/else statements because you can do it simultaneously e.g. you can attack while moving right
    if (attackButton.isDown && game.time.now > attackTimer) {
        
        // do something
       
        if (facing != 'attack' && attacking == 1)
        {
            player.animations.play('attack');
            // the timer determines for how long the animation will play, 1000 == 1 second
            attackTimer = game.time.now + 1000;
            facing = 'attack';
            // increase attacking so it's no longer 1
            attacking++;
        }
    }
    // the state of attack and timer determinen when the animation is over, if so, the state will be set to idle
    if(attacking>1 && game.time.now > attackTimer){
        facing = 'idle';
        attacking = 1;
    }
}

//an additional layer on top of the game, useful for debugging
function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text('local / 2',  32, 150);
}

    };