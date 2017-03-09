import * as Phaser from 'Phaser';
import PlayerShip from '../Components/PlayerShip';
import AsteroidFactory from '../Components/AsteroidFactory';

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
		this.game.load.image('ship', '/images/spaceArt/png/player.png');
		this.game.load.image('asteroid', '/images/spaceArt/png/meteorBig.png');
		this.game.load.image('asteroid-s', '/images/spaceArt/png/meteorSmall.png');
		this.game.load.image('laser', '/images/spaceArt/png/laserGreen.png');
		this.game.load.image('laser-impact', '/images/spaceArt/png/laserGreenShot.png');
		this.game.load.image('star', '/images/star.png');
		this.game.load.image('background', '/images/spaceArt/png/Background/starBackground.png');
	}

	create() {
		this.backgroundSprite = this.game.add.tileSprite(0, 0, 800, 600, 'background');
		// this.entities = {};
		// this.entities.myEntity = new Entity(this.game, this.entities);
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.ship = new PlayerShip(this.game, this.keyboard, this.bullets);

		this.asteroidFactory = new AsteroidFactory(this.game);
		this.asteroids = this.asteroidFactory.getAsteroids();

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

			this.asteroidFactory.killAsteroid(asteroid);
			bullet.kill();

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
		for (var i = 0; i < this.level ; i++)
		{
			this.asteroidFactory.createAsteroid();
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
		this.ship.reset();
	}
}

//GAME
//========
//TODO dependancy injection for "services": keyboard, factories, shared emitters (and maybe not shared, via not singleton dependancy injection), etc.
// => no DI, just shared objects (DI would be such a mess with states management)
//TODO Fading particles
//TODO Get real exemple sprites from phaser.io
// OR my own graphics
//TODO ES6 the shit out of it || with classes, modules and other badasseries :)

//BUILD
//========
//TODO JSHint and JSCS in build!
//TODO Why is phaser in game.js ?
//TODO Make libs integration dynamic: list of dependencies and injection in HTML (CSS too)

export default GameState;
