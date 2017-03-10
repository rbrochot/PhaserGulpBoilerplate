import {
	Sprite,
	Point,
	RandomDataGenerator,
} from 'Phaser';

var RNG = new RandomDataGenerator();

class Nebula extends Sprite {
	constructor(game) {
		super(game, RNG.between(0, game.width), RNG.between(0, game.height), 'nebula');
		this.scale.set(RNG.realInRange(0.5, 1));
		this.anchor.set(0.5);
		this.alpha = RNG.realInRange(0.4, 0.8);
		this.angle = RNG.angle();
		this.velocity = new Point(RNG.realInRange(-0.2, 0.2), RNG.realInRange(-0.2, 0.2));
		this.angularVelocity = RNG.realInRange(-0.5, 0.5);

		game.stage.addChild(this);
	}

	update() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.angle += this.angularVelocity;
	}

	reset() {
	}
}

module.exports = Nebula;
