var Boot = function(game) {};

Boot.prototype = {
  preload: function() {
  },
  create: function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.game.state.start("Intro");
  }
};
