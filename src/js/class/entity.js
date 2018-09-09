(function() {
	'use strict';

	function Entity(state, image) {

		this.state = state;
		this.game = state.game;
		window['catathonic'].Spriter.call(this, state, image);

		this.isPinnedToGround = false;
	}

	Entity.prototype = Object.create(window['catathonic'].Spriter.prototype);
	Entity.prototype.constructor = Entity;

	Entity.prototype.getAngleTo = function (target) {
		var angle;
		if (target.x || target.y) {
			angle = Math.atan2(target.x - this.x, target.y - this.y);
		}
		return angle;
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Entity = Entity;
}());
