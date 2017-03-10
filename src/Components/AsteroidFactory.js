import {
	Point,
	Physics,
	RandomDataGenerator,
} from 'Phaser';

var RNG = new RandomDataGenerator();

// Should only be a factory, and have kill method (and static emitter) in asteroid class,
//	but it seems overkill in this case...
class AsteroidFactory {
	constructor(game) {
		this.game = game;

		this.asteroids = this.game.add.group();
		this.asteroids.enableBody = true;
		this.asteroids.physicsBodyType = Physics.ARCADE;

		this.rockEmitter = this.game.add.emitter(0, 0, 50);
		this.rockEmitter.makeParticles('asteroid-s');
		this.rockEmitter.minParticleScale = 0.05;
		this.rockEmitter.maxParticleScale = 0.3;
		this.rockEmitter.setAlpha(1, 0, 500);
		this.rockEmitter.autoAlpha = true;
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

	createAsteroid({size, position} = {}) {
		if (_.isUndefined(size)) {
			size = 3;
		}
		if (_.isUndefined(position)) {
			position = this.findViableAsteroidPosition();
		}

		let asteroid = this.asteroids.getFirstExists(false, true, position.x, position.y, 'asteroid');
		asteroid.body.velocity.set(RNG.realInRange(-25, 25), RNG.realInRange(-25, 25));
		asteroid.body.angularVelocity = RNG.realInRange(0, 10);
		asteroid.size = size;
		asteroid.angle = RNG.angle();
		asteroid.anchor.set(0.5);
		asteroid.scale.set(size / 3);
		return asteroid;
	}

	findViableAsteroidPosition() {
		let center = new Point(400, 300);
		let position = new Point();
		do {
			position.x = RNG.between(0, this.game.width);
			position.y = RNG.between(0, this.game.height);
		}
		while (Point.distance(center, position) < 200);
		return position;
	}
}

module.exports = AsteroidFactory;
