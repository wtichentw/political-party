var Intro = function(game) {};

Intro.prototype = {
  preload: function() {
    this.game.load.video("introVideo", "media/intro.webm");
  },
  create: function() {
    var introVideo = this.game.add.video("introVideo");
    introVideo.play();
    introVideo.addToWorld();
    introVideo.onComplete.add(function() {
      this.game.state.start("MainMenu");
    }, this);

    var skipText = this.game.add.text(
      this.game.width - 50,
      this.game.height - 30,
      "Skip",
      {
        font: "16px Arial",
        fill: "#868988"
      }
    );
    skipText.inputEnabled = true;
    skipText.events.onInputDown.add(function() {
      introVideo.stop();
      this.game.state.start("MainMenu");
    }, this);
  }
};
