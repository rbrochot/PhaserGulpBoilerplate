import * as Phaser from 'Phaser';
import PlayerShip from '../Components/PlayerShip';

class GameState extends Phaser.State {

	constructor() {
		super();
		this.score = 0;
		this.level = 0;
		this.ship;
		this.keyboard;
		this.gameOver = false;
		this.bulletTime = 0;
	}

	preload() {
		this.game.load.image('ship', '/images/ship.png');
		this.game.load.image('asteroid', '/images/asteroid.png');
		this.game.load.image('star', '/images/star.png');
	}

	create() {
		// this.ship = this.game.add.sprite(0, 0, 'ship');
		this.ship = new PlayerShip(this.game);
		// this.ship.scale.set(0.5);
		// this.ship.anchor.set(0.5);
		// this.game.physics.arcade.enable(this.ship);
		// this.ship.body.maxVelocity = 100;

		this.asteroids = this.game.add.group();
		this.asteroids.enableBody = true;
		//TODO check if bounce is mandatory
		// this.asteroids.body.bounce.set(1);
		// this.asteroids.body.collideWorldBounds = true;

		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;

		this.starEmitter = this.game.add.emitter(0, 0, 20);
		this.starEmitter.makeParticles('star');
		this.starEmitter.minParticleScale = 0.1;
		this.starEmitter.maxParticleScale = 0.2;

		this.rockEmitter = this.game.add.emitter(0, 0, 50);
		this.rockEmitter.makeParticles('asteroid');
		this.rockEmitter.minParticleScale = 0.05;
		this.rockEmitter.maxParticleScale = 0.1;

		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.startNextLevel();
	}

	update() {
		if (this.gameOver && this.keyboard.space.isDown)
		{
			this.level = 0;
			this.score = 0;
			this.startNextLevel();
		}

		if (!this.gameOver) {
			//Rotation
			if (this.keyboard.left.isDown)
			{
				this.ship.rotation -= 0.1;
			}
			if (this.keyboard.right.isDown)
			{
				this.ship.rotation += 0.1;
			}

			//Velocity
			if (this.keyboard.up.isDown)
			{
				let velocityDelta;
				velocityDelta = this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 5);
				this.ship.body.velocity.add(velocityDelta.x, velocityDelta.y);
			}
			else if (this.keyboard.down.isDown)
			{
				let velocityDelta = this.game.physics.arcade.velocityFromRotation(this.ship.rotation, -5);
				this.ship.body.velocity.add(velocityDelta.x, velocityDelta.y);
			}

			//Shoot
			if (this.keyboard.space.isDown && this.game.time.now > this.bulletTime) {
				this.bulletTime = this.game.time.now + 500;
				let bullet = this.bullets.getFirstExists(false, true, this.ship.x, this.ship.y, 'bullet');
				bullet.rotation = this.ship.rotation;
				bullet.anchor.set(0.5);
				bullet.lifespan = 3000;
				this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 150, bullet.body.velocity);
			}
		}

		//Collision detection
		//TODO collide asteroids?
		// this.game.physics.arcade.collide(this.asteroids, this.asteroids);
		this.game.physics.arcade.overlap(this.ship, this.asteroids, function(ship, asteroid) {
			this.starEmitter.x = ship.x + ship.width / 2;
			this.starEmitter.y = ship.y + ship.height / 2;
			this.starEmitter.start(true, 500, null, 10);

			this.ship.kill();
			this.gameOver = true;
		}, null, this);
		this.game.physics.arcade.overlap(this.bullets, this.asteroids, function(bullet, asteroid) {
			this.score += 100;

			this.rockEmitter.x = asteroid.x + asteroid.width / 2;
			this.rockEmitter.y = asteroid.y + asteroid.height / 2;
			this.rockEmitter.start(true, 500, null, 5);

			//Spawn lesser asteroids if asteroid size > 1
			if (asteroid.size > 1) {
				for (var i = 0; i < 3; i++)
				{
					// let newAsteroid = this.asteroids.create(, 'asteroid');
					let newAsteroid = this.asteroids.getFirstExists(false, true, asteroid.x, asteroid.y, 'asteroid');
					newAsteroid.body.velocity.set((Math.random - 1) * Math.random() * 20, (Math.random - 1) * Math.random() * 20);
					newAsteroid.body.angularVelocity = Math.random() * 10;
					newAsteroid.size = asteroid.size - 1;
					newAsteroid.anchor.set(0.5);
					newAsteroid.scale.set(newAsteroid.size / 3);
				}
			}

			bullet.kill();
			asteroid.kill();

			//Check alive asteroids, and pass to next level
			if (this.asteroids.getFirstAlive(false) === null) {
				this.startNextLevel();
			}
		}, null, this);

		//World-wrap
		this.game.world.wrap(this.ship, 0, true);
		// this.game.world.wrap(this.asteroids, 0, true);
		this.asteroids.forEach(function (asteroid) {
			this.game.world.wrap(asteroid, 0, true);
		}, this);
		// this.game.world.wrap(this.bullets, 0, true);
		this.bullets.forEach(function (bullet) {
			this.game.world.wrap(bullet, 0, true);
		}, this);
	}

	render() {
		//TODO find better score display
		this.game.debug.text('Score: ' + this.score, 620, 18, 'rgb(0,255,0)');
	}

	startNextLevel() {
		this.clean();
		this.level++;
		for (var i = 0; i < this.level; i++)
		{
			let asteroid = this.asteroids.getFirstExists(false, true, i * 70, 150, 'asteroid');
			asteroid.body.velocity.set((Math.random - 1) * Math.random() * 20, (Math.random - 1) * Math.random() * 20);
			asteroid.body.angularVelocity = Math.random() * 10;
			asteroid.size = 3;
			asteroid.anchor.set(0.5);
			asteroid.scale.set(1);
		}
	}

	clean() {
		this.gameOver = false;
		this.asteroids.forEach(function (asteroid) {
			asteroid.kill();
		}, this);
		this.bullets.forEach(function (bullet) {
			bullet.kill();
		}, this);

		//Revive, center ship & set velocity to 0
		this.ship.reset(400 - this.ship.width, 300 - this.ship.height);
		this.ship.body.velocity.set(0);
	}
}

//TODO Fading particles
//TODO Ship reactor particles
//TODO Better asteroids spawns
//TODO Get real exemple sprites from phaser.io
//TODO ES6 the shit out of it || with classes, modules and other badasseries :)

export default GameState;
