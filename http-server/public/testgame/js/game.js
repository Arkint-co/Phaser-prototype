window.onload = function() {

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
   
    //images for buttons
    game.load.image('button', 'img/start-button.png');
    game.load.image('background','img/starfield.jpg');

    //images for car and bullet
    game.load.image('bullet', 'img/bullet.png');
    game.load.image('car', 'img/auto.png');

    //images for rocks
    game.load.spritesheet('invader', 'img/rock.jpg', 32, 32);
}
var button;
var background;
var sprite;
var weapon;
var cursors;
var fireButton;

function create() {
  
    // buttons
    game.stage.backgroundColor = '#182d3b';

    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    button = game.add.button(game.world.centerX -75, game.world.centerY -75 , 'button', actionOnClick, this, 2, 1, 0);
    button.scale.setTo(0.25, 0.25);
    
    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullets will be automatically killed when they are 2000ms old
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2000;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;

    //  Wrap bullets around the world bounds to the opposite side
    weapon.bulletWorldWrap = true;

    sprite = this.add.sprite(400, 300, 'car');
    
    // hide car
    sprite.visible=false;
    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.body.drag.set(70);
    sprite.body.maxVelocity.set(200);

    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    weapon.trackSprite(sprite, 0, 0, true);

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

     //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.startSystem(Phaser.Physics.ARCADE);

     //  The car
    player = game.add.sprite(400, 500, 'car');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The rocks
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
}


function actionOnClick () {
    
    // show car
    sprite.visible=true;
   
    button.destroy();
}
function update() {

    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, 300, sprite.body.acceleration);
    }
    else
    {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 300;
    }
    else
    {
        sprite.body.angularVelocity = 0;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

    game.world.wrap(sprite, 16);

}

function render() {

    weapon.debug();

}

    };