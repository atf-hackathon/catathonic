(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(320, 240, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);

      this.load.image('tileset', 'assets/tileset.png');

      this.load.spritesheet('cat', 'assets/cat.png', 24*2, 28*2);

      this.load.spritesheet('player_projectile', 'assets/player_projectiles.png', 16, 16);
      this.load.image('mob_projectile_1', 'assets/mob_projectile_1.png');
      this.load.image('mob_projectile_2', 'assets/mob_projectile_2.png');
      this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);

      this.load.spritesheet('mob_light', 'assets/mob_light.png', 32, 32);
      this.load.spritesheet('mob_havy', 'assets/mob_havy.png', 37, 28);
      this.load.spritesheet('mob_boss', 'assets/mob_boss.png', 93, 80);

      this.load.spritesheet('bonus_cube', 'assets/cubes.png', 24, 24);

      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');

      this.load.image('cat_main_page', 'assets/cat_main_page.png');

      // Audio

      this.load.audio('shoot_cat', 'assets/audio/shoot_cat.mp3');

      this.load.audio('explosion', 'assets/audio/explosion.wav');
      this.load.audio('death', 'assets/audio/death.mp3');

      this.load.audio('hurt', 'assets/audio/hurt.wav');
      this.load.audio('collect_2', 'assets/audio/collect_2.wav');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['catathonic'] = window['catathonic'] || {};
  window['catathonic'].Preloader = Preloader;

}());
