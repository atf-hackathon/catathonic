/*globals CONFIG */

(function() {
	'use strict';

	function Collectible(state, image) {

		window['catathonic'].Entity.call(this, state, image);

		this.alive = true;
		this.updateClass();
	}

	Collectible.prototype = Object.create(window['catathonic'].Entity.prototype);
	Collectible.prototype.constructor = Collectible;

	Collectible.prototype.update = function () {

		window['catathonic'].Entity.prototype.update.call(this);

		if (this.y > CONFIG.GAME_HEIGHT * CONFIG.PIXEL_RATIO + 200) {
			this.kill();
			return;
		}
	};

	Collectible.prototype.updateClass = function () {

		this.bonusClass = this.state.rnd.integerInRange(0, 3);

		var offset = this.bonusClass * 3;

		this.animations.add('idle', [0 + offset, 1 + offset, 2 + offset, 1 + offset], 15, true);
		this.play('idle');
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Collectible = Collectible;
}());
