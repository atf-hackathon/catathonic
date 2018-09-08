/*globals CONFIG */

(function() {
	'use strict';

	function Mob(state, image) {

		window['catathonic'].Entity.call(this, state, image);

		this.alive = true;
		this.health = 100;
		this.maxHealth = this.health;
		this.isDamaged = false;
		this.damageBlinkLast = 0;
		this.tint = 0xffffff;
	}

	Mob.prototype = Object.create(window['catathonic'].Entity.prototype);
	Mob.prototype.constructor = Mob;

	Mob.prototype.update = function () {
		if (this.game.rnd.integerInRange(0, 2) === 0) {
			this.play(['left', 'idle', 'right'][this.game.rnd.integerInRange(0, 2)]);
		}

		window['catathonic'].Entity.prototype.update.call(this);

		if (this.y > CONFIG.GAME_HEIGHT * CONFIG.PIXEL_RATIO + 200) {
			this.kill();
			return;
		}

		this.updateTint();
	};

	Mob.prototype.updateTint = function () {
		if (this.isDamaged) {
			this.damageBlinkLast -= 2;

			if (this.damageBlinkLast < 0) {
				this.isDamaged = false;
			}
		}

		if (this.isDamaged) {
			this.tint = 0xff0000;
		} else {
			this.tint = 0xffffff;
		}
	};

	Mob.prototype.takeDamage = function (damage) {

		this.health -= damage;

		if (this.health <= 0) {
			this.kill();

		} else {
			this.blink();
		}
	};

	Mob.prototype.blink = function () {

		this.isDamaged = true;
		this.damageBlinkLast = CONFIG.BLINK_DAMAGE_TIME;
	};

	Mob.prototype.revive = function () {
		this.health = this.maxHealth;
	};

	Mob.prototype.die = function () {
		this.kill();
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Mob = Mob;
}());
