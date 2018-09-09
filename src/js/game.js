/*globals CONFIG */

(function() {
	'use strict';

	function Game() {
		this.score = 0;
		this.player = null;
		this.lastUpdate = 0;
		this.delta = 0;

		this.STATE = {
			preplay:  0,
			play: 		1,
			postplay: 2
		};

		this.gameState = null;
	}

	Game.prototype = {
		create: function () {
			this.gameState = this.STATE.preplay;

			this.createWorld();
			this.createGround();
			this.scrollSpeed = CONFIG.SCROLL_SPEED;

			var i, o;

			this.bonusPool =  this.add.group();
			for (i = 0; i < CONFIG.BONUSPOOL_SIZE; i++) {
				o = new window['catathonic'].Collectible(this, 'bonus_cube');
				this.bonusPool.add(o);
				o.exists = false;
				o.alive = false;
			}

			this.createEnemies();

			this.player = new window['catathonic'].Player(this);
			this.score = 0;

			this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

			this.input.onDown.add(this.onInputDown, this);
			this.cursors = this.input.keyboard.createCursorKeys();

			this.createGUI();

			this.createAudio();
		},

		createGUI: function () {
			this.guiText0 = this.add.bitmapText(0, 0, 'minecraftia', 'Get ready');
			this.guiText0.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.guiText0.x = (this.game.width - this.guiText0.textWidth * CONFIG.PIXEL_RATIO) / 2;
			this.guiText0.y = (this.game.height- this.guiText0.textHeight * CONFIG.PIXEL_RATIO) / 2;
			this.guiText0.fixedToCamera = true;

			this.guiText1 = this.add.bitmapText(0, -5 * CONFIG.PIXEL_RATIO, 'minecraftia', '');
			this.guiText1.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.guiText1.fixedToCamera = true;

			this.guiText2 = this.add.bitmapText(0, 32, 'minecraftia', '');
			this.guiText2.scale.setTo(CONFIG.PIXEL_RATIO / 4, CONFIG.PIXEL_RATIO / 4);
			this.guiText2.fixedToCamera = true;

			this.updateGUI();
		},

		createWorld: function () {
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.world.setBounds(0, 0, 24 * CONFIG.WORLD_WIDTH * CONFIG.PIXEL_RATIO, CONFIG.GAME_HEIGHT * CONFIG.PIXEL_RATIO);
		},

		createGround: function () {
			this.map = this.game.add.tilemap();
			this.map.addTilesetImage('tileset', 'tileset', 24, 28, null, null, 0);

			this.groundWidth = CONFIG.WORLD_WIDTH;
			this.groundHeight = Math.round(CONFIG.GAME_HEIGHT / 28) + 1 + CONFIG.WORLD_SWAP_HEIGHT;

			this.ground = this.map.create('layer0', this.groundWidth, this.groundHeight, 24, 28);
			this.ground.fixedToCamera = false;
			this.ground.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.ground.scrollFactorX = 0.0000125; /// Layer have double x scroll speed

			this.scrollMax = CONFIG.WORLD_SWAP_HEIGHT * CONFIG.PIXEL_RATIO * 28 - 1;
			this.ground.y = - this.scrollMax;

			var terrain = new window['catathonic'].Terrain(this);
			this.terrainData = terrain.generateTerrain();

			this.scrollCounter = 0;

			this.drawGround();
		},

		createEnemies: function () {
			var mob, o, i;

			this.projectilePoolsMob = [];

			this.projectilePoolsMob[0] = this.add.group();

			for (i = 0; i < CONFIG.PROJECTILEPOOL_SIZE_ENNEMY; i++) {
				o = new window['catathonic'].Projectile(this, 0);
				this.projectilePoolsMob[0].add(o);
				o.exists = false;
				o.alive = false;
			}

			this.projectilePoolsMob[1] = this.add.group();

			for (i = 0; i < CONFIG.PROJECTILEPOOL_SIZE_ENNEMY; i++) {
				o = new window['catathonic'].Projectile(this, 1);
				this.projectilePoolsMob[1].add(o);
				o.exists = false;
				o.alive = false;
			}

			this.mobPools = [];

			this.mobPools[0] = this.add.group();
			for (i = 0; i < CONFIG.MOBPOOL_SIZE; i++) {
				mob = new window['catathonic'].MobLight(this);
				this.mobPools[0].add(mob);
				mob.exists = false;
				mob.alive = false;
			}

			this.mobPools[1] = this.add.group();
			for (i = 0; i < CONFIG.MOBPOOL_SIZE; i++) {
				mob = new window['catathonic'].MobHavy(this);
				this.mobPools[1].add(mob);
				mob.exists = false;
				mob.alive = false;
			}

			this.mobPools[2] = this.add.group();
			for (i = 0; i < CONFIG.MOBPOOL_SIZE; i++) {
				mob = new window['catathonic'].MobBoss(this);
				this.mobPools[2].add(mob);
				mob.exists = false;
				mob.alive = false;
			}

			this.enemyDelay = [];
			this.nextEnemyAt = [];

			this.enemyDelay[0] = 1000;
			this.enemyDelay[1] = 5000;
			this.enemyDelay[2] = 30000;
		},

		createAudio: function () {
			this.sound['shoot_cat'] = this.add.audio('shoot_cat');
			this.sound['explosion'] = this.add.audio('explosion');
			this.sound['death'] = this.add.audio('death');
			this.sound['hurt'] = this.add.audio('hurt');
			this.sound['collect_2'] = this.add.audio('collect_2');
		},

		statePreplay2Play: function () {
			this.gameState = this.STATE.play;

			this.nextEnemyAt[0] = this.time.now + this.enemyDelay[0];
			this.nextEnemyAt[1] = this.time.now + this.enemyDelay[1];
			this.nextEnemyAt[2] = this.time.now + this.enemyDelay[2];

			this.guiText0.setText('');
		},

		statePlay2Postplay: function () {
			this.gameState = this.STATE.postplay;
            var go = 'Game over',
				leaderboard = 'Leaderboard',
				list = '\n1. Dima          100000\n2. Catalin         20000 \n3. Evreu         10000';

            this.add.bitmapText(CONFIG.GAME_WIDTH - (go.length * 10), 160, 'minecraftia', go);
            this.add.bitmapText(CONFIG.GAME_WIDTH - 90, 180, 'minecraftia', '---------');
            this.add.bitmapText(CONFIG.GAME_WIDTH - (leaderboard.length * 10), 230, 'minecraftia', leaderboard);
            this.add.bitmapText(60, 260, 'minecraftia', list);
		},

		update: function () {
			this.delta = (this.game.time.now - this.lastUpdate) / 1000;
			this.lastUpdate = this.game.time.now;

			if (this.gameState !== this.STATE.preplay) {
				this.updateEnemySpawn();
			}

			this.updateCollisions();

			this.updateBackground(this.delta);

			this.player.fire();
		},

		updateEnemySpawn: function () {
			var enemy, i;

			for (i = 0; i < this.mobPools.length; i++) {
				if (this.nextEnemyAt[i] < this.time.now && this.mobPools[i].countDead() > 0) {
					this.nextEnemyAt[i] = this.time.now + this.enemyDelay[i];
					enemy = this.mobPools[i].getFirstExists(false);
					enemy.revive();
				}
			}
		},

		updateCollisions: function () {
			var i;

			for (i = 0; i < this.mobPools.length; i++) {
				this.physics.arcade.overlap(this.player.projectilePool, this.mobPools[i], this.projectileVSmob, null, this);
				this.physics.arcade.overlap(this.player, this.mobPools[i], this.playerVSmob, null, this);
			}

			for (i = 0; i < this.projectilePoolsMob.length; i++) {
				this.physics.arcade.overlap(this.projectilePoolsMob[i], this.player, this.playerVSprojectile, null, this);
			}

			this.physics.arcade.overlap(this.bonusPool, this.player, this.playerVSbonus, null, this);
		},

		projectileVSmob: function (projectile, mob) {
			projectile.kill();
			mob.takeDamage(this.player.damage / 5);

			if (mob.health <= 0) {
				mob.die();
				this.explode(mob);

				this.score += mob.points;
				this.updateGUI();
			}
		},

		playerVSmob: function (player, mob) {
			mob.kill();
			this.explode(mob);

			this.playerVSenemy(player);
		},

		playerVSprojectile: function (player, projectile) {
			projectile.kill();

			this.playerVSenemy(player);
		},

		playerVSenemy: function (player) {
			if (!CONFIG.DEBUG.immortality) {
				player.takeDamage(10);
			}

			if (player.health <= 0) {
				player.kill();
				player.alive = false;
				this.explode(player);

				this.sound['death'].play();

				this.statePlay2Postplay();

			} else {
				this.sound['hurt'].play();
			}

			this.updateGUI();
		},

		playerVSbonus: function (player, bonus) {
			bonus.kill();
			player.collectUpgrade(bonus.bonusClass);

			this.updateGUI();
		},

		explode: function (thing) {
			var explosion = this.add.sprite(thing.x, thing.y, 'explosion');
			explosion.anchor.setTo(0.5, 0.5);
			explosion.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			explosion.animations.add('boom', [ 0, 1, 2, 3, 4 ], 30, false);
			explosion.play('boom', 15, false, true);
		},

		updateGUI: function () {
			var gui = '';

			var life = '';
			for (var i = 0; i < Math.round(this.player.health / 20); i++) {
				life += '@';
			}

			gui += 'HP  ' + life + '\n';

			gui += 'DMG ' + this.player.playerStats.damage + '\n';
			gui += 'RAT ' + this.player.playerStats.rate + '\n';
			gui += 'SPD ' + this.player.playerStats.speed + '\n';
			gui += 'ACC ' + this.player.playerStats.accel + '\n';

			this.guiText1.setText(this.score + '');
			this.guiText2.setText(gui);
		},

		updateBackground: function (delta) {
			if (this.player.isAlive) {
				this.scrollSpeed += CONFIG.SCROLL_ACCEL * delta / 60;
			}

			if (this.ground.y < 0 ) {
				this.ground.y += this.scrollSpeed * CONFIG.PIXEL_RATIO * delta;
			} else {
				this.scrollCounter += CONFIG.WORLD_SWAP_HEIGHT;
				if (this.scrollCounter > CONFIG.WORLD_HEIGHT) {
					this.scrollCounter = 0;
				}
				this.drawGround();
				this.ground.y = - this.scrollMax;
			}
		},

		drawGround: function () {
			for (var i = 0; i < CONFIG.WORLD_WIDTH; i++) {
				for(var j = 0; j < this.groundHeight; j++) {
					var rowOffset = CONFIG.WORLD_HEIGHT - (this.groundHeight + this.scrollCounter) + j;
					if (rowOffset < 0) {
						rowOffset += CONFIG.WORLD_HEIGHT;
					}
					this.map.putTile(this.terrainData[i][rowOffset],i,j,this.ground);
				}
			}
		},

		onInputDown: function () {
			this.game.state.start('menu');
		},
	};

	window['catathonic'] = window['catathonic'] || {};
	window['catathonic'].Game = Game;

}());
