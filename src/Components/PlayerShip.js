import {
	Sprite,
	Easing,
} from 'Phaser';

//TODO Use DI for game, keyboard, and groups
//TODO Ship reactor particles
class PlayerShip extends Sprite {
	constructor(game, keyboard, bullets) {
		super(game, 0, 0, 'ship');
		this.scale.set(0.5);
		this.anchor.set(0.5);
		game.physics.arcade.enable(this);
		this.body.maxVelocity.set(250);

		this.keyboard = keyboard;
		this.bullets = bullets;
		this.bulletTime = 0;

		//TODO Use DI singleton
		this.starEmitter = this.game.add.emitter(0, 0, 20);
		this.starEmitter.makeParticles('star');
		this.starEmitter.minParticleScale = 0.1;
		this.starEmitter.maxParticleScale = 0.2;
		this.starEmitter.setAlpha(1, 0, 500);
		this.starEmitter.autoAlpha = true;

		game.stage.addChild(this);
	}

	update() {
		if (!this.gameOver) {
			//Rotation
			if (this.keyboard.left.isDown)
			{
				this.angle -= 3;
			}
			if (this.keyboard.right.isDown)
			{
				this.angle += 3;
			}

			//Velocity
			if (this.keyboard.up.isDown)
			{
				let velocityDelta;
				velocityDelta = this.game.physics.arcade.velocityFromAngle(this.angle - 90, 5);
				this.body.velocity.add(velocityDelta.x, velocityDelta.y);
			}
			else if (this.keyboard.down.isDown)
			{
				let velocityDelta = this.game.physics.arcade.velocityFromAngle(this.angle - 90, -5);
				this.body.velocity.add(velocityDelta.x, velocityDelta.y);
			}

			//Shoot
			if (this.keyboard.space.isDown && this.game.time.now > this.bulletTime) {
				this.bulletTime = this.game.time.now + 500;
				let bullet = this.bullets.getFirstExists(false, true, this.x, this.y, 'laser');
				bullet.angle = this.angle;
				bullet.anchor.set(0.5);
				bullet.lifespan = 3000;
				this.game.physics.arcade.velocityFromAngle(this.angle - 90, 400, bullet.body.velocity);
				bullet.body.velocity.add(this.body.velocity.x, this.body.velocity.y);
			}
		}
	}

	reset() {
		super.reset(400 - this.width, 300 - this.height);
		this.body.velocity.set(0);
	}

	kill() {
		this.starEmitter.x = this.x + this.width / 2;
		this.starEmitter.y = this.y + this.height / 2;
		this.starEmitter.start(true, 500, null, 10);

		super.kill();
	}
}

module.exports = PlayerShip;
