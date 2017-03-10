import * as Phaser from 'Phaser';
import PlayerShip from '../Components/PlayerShip';
import AsteroidFactory from '../Components/AsteroidFactory';
import Nebula from '../Components/Bg/Nebula';

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
		this.game.load.image('nebula', '/images/spaceArt/png/Background/nebula.png');
	}

	create() {
		this.backgroundSprite = this.game.add.tileSprite(0, 0, 800, 600, 'background');
		// this.entities = {};
		// this.entities.myEntity = new Entity(this.game, this.entities);
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.nebulas = this.game.add.group();

		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.ship = new PlayerShip(this.game, this.keyboard, this.bullets);

		this.asteroidFactory = new AsteroidFactory(this.game);
		this.asteroids = this.asteroidFactory.getAsteroids();

		// this.laserHitEmitter = this.game.add.emitter(0, 0, 1);
		// this.laserHitEmitter.makeParticles('laser-impact');
		// this.laserHitEmitter.setScale(0.5, 0.5);
		// this.laserHitEmitter.setRotation(0, 0);
		// this.laserHitEmitter.setAlpha(0.2, 1, 100, Phaser.Easing.Linear.None, false);
		// this.laserHitEmitter.autoAlpha = true;
		// this.laserHitEmitter.minParticleSpeed = 0;
		// this.laserHitEmitter.maxParticleSpeed = 0;

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
		this.backgroundSprite.tilePosition.x += 0.2;
		this.backgroundSprite.tilePosition.y += 0.2;

		//Collision detection
		this.game.physics.arcade.overlap(this.ship, this.asteroids, function(ship, asteroid) {
			this.ship.kill();
			this.gameOver = true;
		}, null, this);
		this.game.physics.arcade.overlap(this.bullets, this.asteroids, function(bullet, asteroid) {
			if (!bullet.alive || !asteroid.alive) {return;}
			this.score += 100;

			this.asteroidFactory.killAsteroid(asteroid);

			//TODO find better laser impact
			// console.log('laser', bullet.centerX, bullet.centerY);
			// this.laserHitEmitter.x = bullet.centerX;
			// this.laserHitEmitter.y = bullet.centerY;
			// this.laserHitEmitter.angle = bullet.angle;
			// this.laserHitEmitter.start(true, 200, null, 1);
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
		var nebulaCount = new Phaser.RandomDataGenerator().between(0, 3);
		for (i = 0; i < nebulaCount ; i++)
		{
			this.nebulas.add(new Nebula(this.game));
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
		this.nebulas.removeAll(true);

		//Revive, center ship & set velocity to 0
		this.ship.reset();
	}
}

export default GameState;
