var Intro = function(game) {};

Intro.prototype = {
  preload: function() {
    this.game.load.video("introVideo", "media/intro.webm");
  },
  create: function() {
    var introVideo = this.game.add.video("introVideo");
    introVideo.play();
    introVideo.addToWorld();
  }
};
