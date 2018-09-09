/*globals CONFIG */

(function() {
	'use strict';

	function Player(state) {

		this.state = state;
		this.game = state.game;

		this.playerStats = CONFIG.STATS;
		this.classStats = this.playerStats;

		window['catathonic'].Mob.call(this, state, 'cat');

		this.body.setSize(7 * CONFIG.PIXEL_RATIO, 7 * CONFIG.PIXEL_RATIO, 0, 3 * CONFIG.PIXEL_RATIO);

		this.spawn();

		this.animations.add('left_full', [ 0 ], 5, true);
		this.animations.add('left', [ 1 ], 5, true);
		this.animations.add('idle', [ 2 ], 5, true);
		this.animations.add('right', [ 3 ], 5, true);
		this.animations.add('right_full', [ 4 ], 5, true);
		this.play('idle');

		this.health = this.playerStats.health;

		this.updateStats();

		this.nextShotAt = 0;
		this.lastUpdate = 0;

		this.game.add.existing(this);

		this.createProjectilePool();
	}

	Player.prototype = Object.create(window['catathonic'].Mob.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.spawn = function() {

		this.x = this.game.width / 2;
		this.y = this.game.height / 4 * 3;
	};

	Player.prototype.createProjectilePool = function() {

		this.projectilePool = this.game.add.group();
		this.projectilePool.enableBody = true;
		this.projectilePool.physicsBodyType = Phaser.Physics.ARCADE;
		this.projectilePool.createMultiple(100, 'player_projectile');
		this.projectilePool.setAll('anchor.x', 0.5);
		this.projectilePool.setAll('anchor.y', 0.5);
		this.projectilePool.setAll('scale.x', CONFIG.PIXEL_RATIO);
		this.projectilePool.setAll('scale.y', CONFIG.PIXEL_RATIO);
		this.projectilePool.setAll('outOfBoundsKill', true);
		this.projectilePool.setAll('checkWorldBounds', true);

		this.updateProjectilePool();
	};

	Player.prototype.update = function() {

		window['catathonic'].Mob.prototype.update.call(this);

		this.updateInputs();
		this.updateSprite();
		this.updateProjectiles();
	};

	Player.prototype.updateStats = function () {

		this.speed = this.playerStats.speed * CONFIG.PIXEL_RATIO;
		this.accel = this.speed * this.playerStats.accel;
		this.damage = this.playerStats.damage;
		this.shootDelay = 1000 / this.playerStats.rate;
	};

	Player.prototype.updateInputs = function () {

		var cursors = this.state.cursors;
		var keyboard = this.state.input.keyboard;

		if (this.state.gameState === 0) {	// Pre-play

			if (keyboard.isDown(Phaser.Keyboard.W)) {
				this.state.statePreplay2Play();
			}

		} else if (this.state.gameState === 2) {	// Post-play (game over)

			if (keyboard.isDown(Phaser.Keyboard.W)) {
				this.game.state.start('menu');
			}

		} else { // Play
			var delta = (this.game.time.now - this.lastUpdate) / 1000;
			this.lastUpdate = this.game.time.now;

			if (cursors.left.isDown && this.x > 20 * CONFIG.PIXEL_RATIO) {
				this.moveLeft(delta);
			} else if (cursors.right.isDown && this.x < (CONFIG.WORLD_WIDTH * 24 - 20) * CONFIG.PIXEL_RATIO) {
				this.moveRight(delta);
			} else {
				this.floatH(delta);
			}

			if (cursors.up.isDown && this.y > 30 * CONFIG.PIXEL_RATIO) {
				this.moveUp(delta);
			} else if (cursors.down.isDown && this.y < (CONFIG.GAME_HEIGHT - 20) * CONFIG.PIXEL_RATIO) {
				this.moveDown(delta);
			} else {
				this.floatV(delta);
			}

			// Just for demo
			if (keyboard.isDown(Phaser.Keyboard.D)) {
				this.takeDamage(this.health - 5);
			}
		}
	};

	Player.prototype.updateSprite = function () {
		var spd = this.body.velocity.x;

		if (spd < - this.speed / 4 * 3) {
			this.play('left_full');
		} else if (spd > this.speed / 4 * 3) {
			this.play('right_full');
		} else if (spd < - this.speed / 5) {
			this.play('left');
		} else if (spd > this.speed / 5) {
			this.play('right');
		} else {
			this.play('idle');
		}
	};

	Player.prototype.moveLeft = function (delta) {
		this.body.velocity.x -= this.accel * delta;
		if (this.body.velocity.x < - this.speed) {
			this.body.velocity.x = - this.speed;
		}
	};

	Player.prototype.moveRight = function (delta) {
		this.body.velocity.x += this.accel * delta;
		if (this.body.velocity.x > this.speed) {
			this.body.velocity.x = this.speed;
		}
	};

	Player.prototype.moveUp = function (delta) {
		this.body.velocity.y -= this.accel * delta;
		if (this.body.velocity.y < - this.speed) {
			this.body.velocity.y = - this.speed;
		}
	};

	Player.prototype.moveDown = function (delta) {
		this.body.velocity.y += this.accel * delta;
		if (this.body.velocity.y > this.speed) {
			this.body.velocity.y = this.speed;
		}
	};

	Player.prototype.floatH = function (delta) {

		if (this.body.velocity.x > 0) {
			this.body.velocity.x -= this.accel * delta;
			if (this.body.velocity.x < 0) {
				this.body.velocity.x = 0;
			}
		} else {
			this.body.velocity.x += this.accel * delta;
			if (this.body.velocity.x > 0) {
				this.body.velocity.x = 0;
			}
		}
	};

	Player.prototype.floatV = function (delta) {

		if (this.body.velocity.y > 0) {
			this.body.velocity.y -= this.accel * delta;
			if (this.body.velocity.y < 0) {
				this.body.velocity.y = 0;
			}
		} else {
			this.body.velocity.y += this.accel * delta;
			if (this.body.velocity.y > 0) {
				this.body.velocity.y = 0;
			}
		}
	};

	Player.prototype.fire = function() {

		if (this.alive) {
			if (this.nextShotAt > this.game.time.now) {
				return;
			}

			this.nextShotAt = this.game.time.now + this.shootDelay;

			var projectile = this.projectilePool.getFirstExists(false);
			projectile.reset(this.x, this.y - 20);

			projectile.body.velocity.y = -300 * CONFIG.PIXEL_RATIO;

			this.game.sound['shoot_cat'].play('', 0, 0.25);
		}
	};

	Player.prototype.updateProjectiles = function() {
		this.projectilePool.forEachAlive(function (projectile) {
			if (projectile.y < -200) {
				projectile.kill();
				return;
			}
		}, this);
	};

	Player.prototype.updateProjectilePool = function() {
		var _this = this;
		this.projectilePool.forEach(function(projectile) {
			projectile.animations.add('idle', [_this.game.rnd.integerInRange(0, 8) ], 5, true);
			projectile.play('idle');
		}, null);
	};

	Player.prototype.collectUpgrade = function(upgrade) {
		if (upgrade === 0) {
			this.playerStats.damage += 10;
		} else if (upgrade === 1) {
			this.playerStats.rate += 1;
		} else if (upgrade === 2) {
			this.playerStats.speed += 10;
		} else {
			this.playerStats.accel += 1;
		}

		this.updateStats();
		this.updateProjectilePool();

		this.state.sound['collect_2'].play();
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Player = Player;
}());
