/*globals*/
/*jshint -W083 */

(function() {
	'use strict';

	function Shoot(state, shooter, shootConfig) {

		this.state = state;
		this.game = state.game;

		this.shooter = shooter;
		this.shootConfig = shootConfig;

		this.projectiles = [];

		this.t = [];

		for (var j = 0; j < shootConfig.nShoots; j++) {
			this.t[j] = window.setTimeout((function(that, x) { return function() {

				var config = that.shootConfig;

				var shootAngle;

				if (config.shootAngle === 999) {	// Auto-aim player
					shootAngle = that.shooter.getAngleTo(that.state.player);
				} else if (config.shootAngle === -999) {	// Random aim
					shootAngle = that.game.rnd.realInRange(0, 2 * Math.PI);
				} else {
					shootAngle = config.shootAngle;
				}

				shootAngle += x * config.shootRotationSpeed;

				var projectileAngleStep = 0;

				if (config.nProjectiles > 1) {
					projectileAngleStep = config.projectileSpread;
				}

				// One salve
				for (var i = 0; i < config.nProjectiles; i++) {
					if (that.state.projectilePoolsMob[config.projectileType].countDead() > 0) {
						that.projectiles[i] = that.state.projectilePoolsMob[config.projectileType].getFirstExists(false);

						var angle;

						if (config.projectileSpread === 0) {
							angle = shootAngle + (i * projectileAngleStep);
						} else {
							angle = shootAngle + ((i - (config.nProjectiles - 1) / 2) * projectileAngleStep);
						}

						if (angle < 0 || angle >= 2 * Math.PI) {
							angle = angle % (2 * Math.PI);
						}

						that.projectiles[i].revive(shooter, angle);
					}
				}
			}; })(this, j), j * shootConfig.shootDelay);
		}
	}

	Shoot.prototype.die = function (projectileCancel) {
		if (projectileCancel) {
			this.projectiles.forEach(function(projectile) {
				projectile.kill();
			});
		}

		this.t.forEach(function(timer) {
			window.clearTimeout(timer);
		});
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Shoot = Shoot;
}());



