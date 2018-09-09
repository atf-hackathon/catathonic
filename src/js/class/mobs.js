(function() {
	'use strict';

	function MobLight(state) {

		window['catathonic'].Enemy.call(this, state, 'mob_light');

		this.maxHealth = 30;
		this.speed = 60;
		this.shootDelay = 3000;
		this.projectileSpeed = 125;
		this.points = 100;
		this.lootProbability = 0.1;

		this.shootConfig = {
			projectileType: 0,
			nProjectiles: 1,
			projectileDelay: 0,
			projectileAngle: 0,
			projectileSpread: 0,

			nShoots: 1,
			shootDelay: 0,
			shootAngle: 999,
			shootRotationSpeed: 0
		};

		this.mobClass = state.rnd.integerInRange(0, 7);

		var offset = this.mobClass * 3;
		this.animations.add('idle', [offset + 1], 5, true);
		this.animations.add('left', [offset + 0], 5, true);
		this.animations.add('right', [offset + 2], 5, true);
		this.play('idle');
	}

	MobLight.prototype = Object.create(window['catathonic'].Enemy.prototype);
	MobLight.prototype.constructor = MobLight;

	MobLight.prototype.update = function () {

		window['catathonic'].Enemy.prototype.update.call(this);
	};

	function MobHavy(state) {

		window['catathonic'].Enemy.call(this, state, 'mob_havy');

		this.maxHealth = 100;
		this.speed = 30;
		this.shootDelay = 2000;
		this.points = 500;
		this.lootProbability = 0.5;

		this.shootConfig = {
			projectileType: 0,
			nProjectiles: 5,
			projectileDelay: 0,
			projectileAngle: 0,
			projectileSpread: 0.2,

			nShoots: 1,
			shootDelay: 0,
			shootAngle: 999,
			shootRotationSpeed: 0
		};

		this.animations.add('idle', [0], 5, true);
		this.play('idle');
	}

	MobHavy.prototype = Object.create(window['catathonic'].Enemy.prototype);
	MobHavy.prototype.constructor = MobHavy;

	MobHavy.prototype.update = function () {
		window['catathonic'].Enemy.prototype.update.call(this);
	};

	function MobBoss(state) {

		window['catathonic'].Enemy.call(this, state, 'mob_boss');

		this.maxHealth = 750;
		this.speed = 10;
		this.shootDelay = 3000;
		this.points = 2000;
		this.lootProbability = 0.8;
		this.projectileCancel = true;

		this.shootConfig = {
			projectileType: 1,
			nProjectiles: 7,
			projectileDelay: 0,
			projectileAngle: 0,
			projectileSpread: 0.2,

			nShoots: 3,
			shootDelay: 500,
			shootAngle: 0,
			shootRotationSpeed: 0.2
		};

		this.animations.add('idle', [0], 5, true);
		this.play('idle');
	}

	MobBoss.prototype = Object.create(window['catathonic'].Enemy.prototype);
	MobBoss.prototype.constructor = MobBoss;

	MobBoss.prototype.update = function () {
		window['catathonic'].Enemy.prototype.update.call(this);
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].MobLight = MobLight;
	window['catathonic'].MobHavy = MobHavy;
	window['catathonic'].MobBoss = MobBoss;
}());
