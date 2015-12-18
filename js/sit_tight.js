var SitTight = {};

(function() {
  var continue_text;
  var alpha_step = 0.02;

  SitTight.Intro = function(game) {};
  SitTight.Intro.prototype = {
    preload: function() {
      game.load.image("GameIntro", "media/stage_intro.png");
    },
    create: function() {
      game.stage.setBackgroundColor(0xFFFFFF);

      imageIntro = game.add.image(0, 0, "GameIntro");
      imageIntro.scale.set(gameWidth / imageIntro.width);

      var text = game.add.text(
        gameWidth / 2,
        imageIntro.height + 30,
        "第二話 | 做好做滿",
        {
          font: "40px PingFang-UltraLight",
          fill: "#000000"
        }
      );
      text.anchor.set(0.5, 0);

      text = game.add.text(
        gameWidth / 2,
        text.y + text.height + 10,
        "在我任期內，一定會做好做滿。",
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

      continue_text = text;
      continue_text.alpha = 0.0;
    },
    update: function() {
      continue_text.alpha += alpha_step;
      if (continue_text.alpha >= 1.0) {
        continue_text.alpha = 1.0;
        alpha_step *= -1;
      } else if (continue_text.alpha <= 0.0) {
        continue_text.alpha = 0.0;
        alpha_step *= -1;
      }

      // Press spacebar to continue to the game
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        game.state.start("SitTightGame");
      }
    }
  }

  var imagePig;

  SitTight.Game = function(game) {};
  SitTight.Game.prototype = {
    preload: function() {
      game.load.image("SitTightPig", "media/sit_tight/pig.png");
    },
    create: function() {
      game.stage.setBackgroundColor(0xFFFFFF);

      // Draw Mr.Pig first to make him under the desk
      var pigWidth = 529;
      var pigHeight = 1334;
      var scaleFactor = 0.5;
      var pigX = gameWidth / 2 - pigWidth * scaleFactor / 2;
      var pigY = gameHeight - pigHeight * scaleFactor + 200;
      imagePig = game.add.image(pigX, pigY, "SitTightPig");
      imagePig.scale.set(scaleFactor);

      var pigLayer = game.add.group();
      pigLayer.add(imagePig);
      pigLayer.z = 0;

      var graphics = game.add.graphics(0, 0);

      // Draw desk
      graphics.beginFill(0xC16A38, 1);
      var deskWidth = 500;
      var deskHeight = 200;
      var deskX = gameWidth / 2 - deskWidth / 2;
      var deskY = gameHeight - deskHeight;
      graphics.drawRect(deskX, deskY, deskWidth, deskHeight);
      var deskTopWidth = deskWidth + 20 * 2;
      var deskTopHeight = 20;
      var deskTopX = gameWidth / 2 - deskTopWidth / 2;
      var deskTopY = deskY - deskTopHeight;
      graphics.drawRect(deskTopX, deskTopY, deskTopWidth, deskTopHeight);
      graphics.endFill();

      var graphicsLayer = game.add.group();
      graphicsLayer.add(graphics);
      graphicsLayer.z = 1;
    },
    update: function() {
      var sitSpeed = 1;

      if (imagePig.y > gameHeight - imagePig.height) {
        imagePig.y -= sitSpeed;
      } else {
        alert("請坐好，坐滿");
        game.state.start("MainMenu");
      }

      var key = Phaser.Keyboard.DOWN;
      if (game.input.keyboard.isDown(key) && imagePig.y < gameHeight - 300) {
        imagePig.y += (sitSpeed + 1);
      }
    }
  };
})();
