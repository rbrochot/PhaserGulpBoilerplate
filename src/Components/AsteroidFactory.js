import * as Phaser from 'Phaser';

//TODO Should be a singleton with setable "game" property
//TODO Should only be a factory, and have kill method (and static emitter) in asteroid class,
//	but it seems overkill in this case...
class AsteroidFactory {
	constructor(game) {
		this.game = game;

		this.asteroids = this.game.add.group();
		this.asteroids.enableBody = true;
		this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

		this.rockEmitter = this.game.add.emitter(0, 0, 50);
		this.rockEmitter.makeParticles('asteroid');
		this.rockEmitter.minParticleScale = 0.05;
		this.rockEmitter.maxParticleScale = 0.1;
	}

	getAsteroids() {
		return this.asteroids;
	}

	killAsteroid(asteroid) {
		this.rockEmitter.x = asteroid.centerX;
		this.rockEmitter.y = asteroid.centerY;
		this.rockEmitter.start(true, 500, null, 5 * asteroid.size);

		//Spawn lesser asteroids if asteroid size > 1
		if (asteroid.size > 1) {
			for (var i = 0; i < 3; i++)
			{
				let newAsteroid = this.createAsteroid({
					size: asteroid.size - 1,
					position: {
						x: asteroid.centerX,
						y: asteroid.centerY
					}
				});
			}
		}
		asteroid.kill();
	}

	createAsteroid({
		size = 3,
		position = this._findViableAsteroidPosition()
	} = {}) {
		let asteroid = this.asteroids.getFirstExists(false, true, position.x, position.y, 'asteroid');
		asteroid.body.velocity.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
		asteroid.body.angularVelocity = Math.random() * 10;
		asteroid.size = size;
		asteroid.anchor.set(0.5);
		asteroid.scale.set(size / 3);
		return asteroid;
	}

	_findViableAsteroidPosition() {
		//TODO Booooo ugly
		let position = {};
		do {
			position.x = Math.random() * 800;
			position.y = Math.random() * 600;
		}
		while (position.x > 200 && position.x < 500 && position.y > 100 && position.y < 400);
		return position;
	}
}

module.exports = AsteroidFactory;
