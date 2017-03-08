import GameState from './states/GameState';
import * as Phaser from 'Phaser';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.CANVAS, 'content', null);
		this.state.add('GameState', GameState, false);
	}

	start() {
		// this.state.start('MenuState');
		this.state.start('GameState');
	}
}

var game = new Game();
game.start();
