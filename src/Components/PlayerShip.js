import * as Phaser from 'Phaser';

class PlayerShip extends Phaser.Sprite {
	constructor(game) {
		super(game, 0, 0, 'ship');
		this.scale.set(0.5);
		this.anchor.set(0.5);
		game.physics.arcade.enable(this);
		this.body.maxVelocity = 100;
		
		game.stage.addChild(this);
	}
}

module.exports = PlayerShip;
