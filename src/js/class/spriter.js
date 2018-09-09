/*globals CONFIG */

(function() {
	'use strict';

	function Spriter(state, image) {

		this.state = state;
		this.game = state.game;

		Phaser.Sprite.call(this, this.game, 0, 0, image);

		this.game.add.existing(this);

		this.anchor.setTo(0.5, 0.5);
		this.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
		this.game.physics.enable(this, Phaser.Physics.ARCADE);
	}

	Spriter.prototype = Object.create(Phaser.Sprite.prototype);
	Spriter.prototype.constructor = Spriter;

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Spriter = Spriter;
}());
