var IntroVideo = function(game) {};

(function() {

  var videoPath;
  var nextState;

  IntroVideo.prototype = {

    init: function(args) {

      videoPath = args.videoPath;
      nextState = args.nextState;

    },

    preload: function() {

      game.load.video("introVideo", videoPath);

    },

    create: function() {

      var introVideo = game.add.video("introVideo");
      introVideo.addToWorld();
      introVideo.play();
      introVideo.onComplete.add(function() {
        this.game.state.start(
          nextState.key,
          true,
          false,
          nextState.args
        );
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
        this.game.state.start(
          nextState.key,
          true,
          false,
          nextState.args
        );
      }, skipText);

    }

  };

}());
