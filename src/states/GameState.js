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
	}

	preload() {
		this.game.load.image('ship', '/images/ship.png');
		this.game.load.image('asteroid', '/images/asteroid.png');
		this.game.load.image('star', '/images/star.png');
	}

	create() {
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		this.ship = new PlayerShip(this.game, this.keyboard, this.bullets);

		this.asteroids = this.game.add.group();
		this.asteroids.enableBody = true;
		this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

		this.rockEmitter = this.game.add.emitter(0, 0, 50);
		this.rockEmitter.makeParticles('asteroid');
		this.rockEmitter.minParticleScale = 0.05;
		this.rockEmitter.maxParticleScale = 0.1;

		this.startNextLevel();
	}

	update() {
		if (this.gameOver && this.keyboard.space.isDown)
		{
			this.level = 0;
			this.score = 0;
			this.startNextLevel();
		}

		this.ship.update();

		//Collision detection
		this.game.physics.arcade.overlap(this.ship, this.asteroids, function(ship, asteroid) {
			this.ship.kill();
			this.gameOver = true;
		}, null, this);
		this.game.physics.arcade.overlap(this.bullets, this.asteroids, function(bullet, asteroid) {
			if (!bullet.alive || !asteroid.alive) {return;}
			this.score += 100;

			//TODO All this in asteroid.kill override
			this.rockEmitter.x = asteroid.centerX;
			this.rockEmitter.y = asteroid.centerY;
			this.rockEmitter.start(true, 500, null, 5 * asteroid.size);

			//Spawn lesser asteroids if asteroid size > 1
			if (asteroid.size > 1) {
				for (var i = 0; i < 3; i++)
				{
					let newAsteroid = this.asteroids.getFirstExists(false, true, asteroid.centerX, asteroid.centerY, 'asteroid');
					newAsteroid.body.velocity.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
					newAsteroid.body.angularVelocity = Math.random() * 10;
					newAsteroid.size = asteroid.size - 1;
					newAsteroid.anchor.set(0.5);
					newAsteroid.scale.set(newAsteroid.size / 3);
				}
			}
			//TODO END asteroid.kill

			bullet.kill();
			asteroid.kill();

			//Check alive asteroids, and pass to next level
			if (this.asteroids.getFirstAlive(false) === null) {
				this.startNextLevel();
			}
		}, null, this);

		//World-wrap
		this.game.world.wrap(this.ship, 0, true);
		this.asteroids.forEach(function (asteroid) {
			this.game.world.wrap(asteroid, 0, true);
		}, this);
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
			//TODO Asteroids in own class + asteroid factory
			let position = this.findViableAsteroidPosition()
			let asteroid = this.asteroids.getFirstExists(false, true, position.x, position.y, 'asteroid');
			asteroid.body.velocity.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
			asteroid.body.angularVelocity = Math.random() * 10;
			asteroid.size = 3;
			asteroid.anchor.set(0.5);
			asteroid.scale.set(1);
		}
	}

	findViableAsteroidPosition() {
		//TODO Booooo ugly
		let position = {};
		do {
			position.x = Math.random() * 800;
			position.y = Math.random() * 600;
		}
		while (position.x > 200 && position.x < 500 && position.y > 100 && position.y < 400 );
		return position;
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
		this.ship.reset();
	}
}

//TODO dependancy injection for "services": keyboard, factories, shared emitters (and maybe not shared, via not singleton dependancy injection), etc.
//TODO Fading particles
//TODO Get real exemple sprites from phaser.io
//TODO ES6 the shit out of it || with classes, modules and other badasseries :)

export default GameState;
