var CONFIG = {
    GAME_WIDTH: 320,
    GAME_HEIGHT: 400,
    PIXEL_RATIO: 2,

    WORLD_WIDTH: 16,
    WORLD_HEIGHT: 150,

    WORLD_SWAP_HEIGHT: 8,

    MOBPOOL_SIZE: 25,
    PROJECTILEPOOL_SIZE: 100,
    PROJECTILEPOOL_SIZE_ENNEMY: 100,
    BONUSPOOL_SIZE: 20,

    SCROLL_SPEED: 40,
    SCROLL_ACCEL: 15,

    BLINK_DAMAGE_TIME: 8,

    AUDIO_LEVEL: 0.5,

    STATS: {
        className: 'Cat',
        health: 100,
        speed: 140,
        accel: 8,
        damage: 100,
        rate: 8
    },

	DEBUG: {
		immortality: false,
	},
};

Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

(function () {
    'use strict';

    function Boot() {
    }

    Boot.prototype = {

        create: function () {
            this.game.input.maxPointers = 1;
            this.game.scale.minWidth = CONFIG.GAME_WIDTH;
            this.game.scale.minHeight = CONFIG.GAME_HEIGHT;
            this.game.scale.maxWidth = CONFIG.GAME_WIDTH * 4;
            this.game.scale.maxHeight = CONFIG.GAME_HEIGHT * 4;
            this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            this.game.antialias = false;
            this.game.stage.smoothed = false;
            this.game.scale.width = CONFIG.GAME_WIDTH * CONFIG.PIXEL_RATIO;
            this.game.scale.height = CONFIG.GAME_HEIGHT * CONFIG.PIXEL_RATIO;
            this.game.scale.refresh();
            this.game.state.start('preloader');
        }
    };


    window['catathonic'] = window['catathonic'] || {};
    window['catathonic'].Boot = Boot;

}());

