var StageIntro = function(game) {};

(function() {

  var imageIntro;

  var titleText = "";
  var subtitleText = "";

  var continueText;
  var alphaStep = 0.02;

  var stageKey = "";

  StageIntro.prototype = {

    init: function(args) {

      titleText = args.titleText;
      subtitleText = args.subtitleText;
      stageKey = args.stageKey;

    },

    preload: function() {

      game.load.image("stageIntro", "media/stage_intro.png");

    },

    create: function() {

      game.stage.setBackgroundColor(0xFFFFFF);

      imageIntro = game.add.image(0, 0, "stageIntro");
      imageIntro.scale.set(gameWidth / imageIntro.width);

      var text;

      text = game.add.text(
        gameWidth / 2,
        imageIntro.height + 30,
        titleText,
        {
          font: "40px PingFang-UltraLight",
          fill: "#000000"
        }
      );
      text.anchor.set(0.5, 0);

      text = game.add.text(
        gameWidth / 2,
        text.y + text.height + 10,
        subtitleText,
        {
          font: "20px PingFang-UltraLight",
          fill: "#000000"
        }
      );
      text.anchor.set(0.5, 0);

      text = game.add.text(
        gameWidth / 2,
        text.y + text.height + 10,
        "請按空白鍵繼續",
        {
          font: "15px PingFang-UltraLight",
          fill: "#000000"
        }
      );
      text.anchor.set(0.5, 0);

      continueText = text;
      continueText.alpha = 0.0;

    },

    update: function() {

      continueText.alpha += alphaStep;
      if (continueText.alpha >= 1.0) {
        continueText.alpha = 1.0;
        alphaStep *= -1;
      } else if (continueText.alpha <= 0.0) {
        continueText.alpha = 0.0;
        alphaStep *= -1;
      }

      // Press spacebar to continue to the game
      if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        game.state.start(stageKey);
      }

    }

  };

})();
