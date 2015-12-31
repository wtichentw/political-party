var Intro = function(game) {};

(function() {
  Intro.prototype = {
    preload: function() {
      game.load.video("introVideo", "media/intro.webm");
    },
    create: function() {
      var introVideo = game.add.video("introVideo");
      introVideo.addToWorld();
      introVideo.play();
      introVideo.onComplete.add(function() {
        this.game.state.start("MainMenu");
      }, introVideo);

      var skipText = game.add.text(
        game.width - 50,
        game.height - 30,
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
      }, skipText);
    }
  };
})();
