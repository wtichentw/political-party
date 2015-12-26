SitTightGame = function(game) {};

(function() {

  var imagePig;
  var sitSpeed = 1;

  var keyText;
  // 我是朱立倫
  var keys = [
    {
      text: "J",
      key: Phaser.KeyCode.J
    },
    {
      text: "I",
      key: Phaser.KeyCode.I
    },
    {
      text: "3",
      key: Phaser.KeyCode.THREE
    },
    {
      text: "G",
      key: Phaser.KeyCode.G
    },
    {
      text: "4",
      key: Phaser.KeyCode.FOUR
    },
    {
      text: "5",
      key: Phaser.KeyCode.FIVE
    },
    {
      text: "J",
      key: Phaser.KeyCode.J
    },
    {
      text: "空白鍵",
      key: Phaser.KeyCode.SPACEBAR
    },
    {
      text: "X",
      key: Phaser.KeyCode.X
    },
    {
      text: "U",
      key: Phaser.KeyCode.U
    },
    {
      text: "4",
      key: Phaser.KeyCode.FOUR
    },
    {
      text: "X",
      key: Phaser.KeyCode.X
    },
    {
      text: "J",
      key: Phaser.KeyCode.J
    },
    {
      text: "P",
      key: Phaser.KeyCode.P
    },
    {
      text: "6",
      key: Phaser.KeyCode.SIX
    },
  ];
  var keysIdx;

  var graphics;
  var keyboardWidth;
  var keyboardHeight;
  var keyboardX;
  var keyboardY;

  var isStageStarted;
  var isTimerStarted;

  SitTightGame.prototype = {

    preload: function() {

      game.load.image("SitTightPig", "images/sit_tight/pig.png");
      game.load.image("SitTightBg", "images/sit_tight/bg.png");
      game.load.image("SitTightDesk", "images/sit_tight/desk.png");

      keysIdx = 0;
      isStageStarted = false;
      isTimerStarted = false;

    },

    create: function() {

      game.stage.setBackgroundColor(0xFFFFFF);

      // Draw background
      var imageBg = game.add.image(0, 0, "SitTightBg");

      var bgLayer = game.add.group();
      bgLayer.add(imageBg);
      bgLayer.z = 0;

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
      pigLayer.z = 1;

      // Draw desk
      var imageDesk = game.add.image(gameWidth / 2, gameHeight, "SitTightDesk");
      imageDesk.anchor.set(0.5, 1);

      var deskLayer = game.add.group();
      deskLayer.add(imageDesk);
      deskLayer.z = 2;

      // Draw HUD
      var initialKeyboardWidth = 70;
      var initialKeyboardHeight = initialKeyboardWidth;
      var initialKeyboardX = 100;
      var initialKeyboardY = 100;

      keyText = game.add.text(
        initialKeyboardX + initialKeyboardWidth / 2,
        initialKeyboardY + initialKeyboardHeight / 2,
        keys[keysIdx].text,
        {
          font: "40px Arial",
          fill: "#FFFFFF"
        }
      );
      keyText.anchor.set(0.5);

      graphics = game.add.graphics(0, 0);

      graphics.beginFill(0x333333);
      graphics.drawRoundedRect(
        initialKeyboardX,
        initialKeyboardY,
        initialKeyboardWidth,
        initialKeyboardHeight,
        10
      );
      graphics.endFill();

      var HUDLayer = game.add.group();
      HUDLayer.add(graphics);
      HUDLayer.add(keyText);
      HUDLayer.z = 3;

      var introGraphics = game.add.graphics(0, 0);

      introGraphics.beginFill(0x000000, 0.5);
      introGraphics.drawRect(0, 0, gameWidth, gameHeight);
      introGraphics.endFill();

      var startGameRect = new Phaser.Rectangle(gameWidth / 2 - 100, gameHeight - 200, 200, 50);
      introGraphics.beginFill(0xFBE400);
      introGraphics.drawRect(startGameRect.x, startGameRect.y, startGameRect.width, startGameRect.height);
      introGraphics.endFill();

      var startGameText = game.add.text(
        startGameRect.x + startGameRect.width / 2,
        startGameRect.y + startGameRect.height / 2,
        "開始遊戲",
        {
          font: "25px Arial",
          color: "#000000"
        }
      );
      startGameText.anchor.set(0.5);

      var introLayer = game.add.group();
      introLayer.add(introGraphics);
      introLayer.add(startGameText);
      introLayer.z = 4;

      introGraphics.inputEnabled = true;
      introGraphics.events.onInputDown.add(function() {
        if (startGameRect.contains(game.input.x, game.input.y)) {
          isStageStarted = true;
          introLayer.removeAll();
        }
      });

    },

    update: function() {

      if (isStageStarted) {

        if (!isTimerStarted) {
          var time_interval = 2000;
          game.time.events.loop(time_interval, function() {
            ++keysIdx;
            if (keysIdx != keys.length) {
              keyText.setText(keys[keysIdx].text);
            }
          });
          isTimerStarted = true;
        }

        if (keysIdx == keys.length) {
          alert("恭喜你坐好，坐滿");
          game.state.start("MainMenu");
          return;
        }

        if (imagePig.y > gameHeight - imagePig.height) {
          imagePig.y -= sitSpeed;
        } else {
          alert("請坐好，坐滿");
          game.state.start("MainMenu");
          return;
        }

        keyboardWidth = 70;
        keyboardHeight = 70;
        keyboardX = keyText.x - keyboardWidth / 2;
        keyboardY = keyText.y - keyboardHeight / 2;

        if (keys[keysIdx].key == Phaser.KeyCode.SPACEBAR) {
          keyboardWidth = keyText.width + 40;
          keyboardX = keyText.x - keyboardWidth / 2;
        }

        graphics.clear();
        graphics.beginFill(0x333333);
        graphics.drawRoundedRect(
          keyboardX,
          keyboardY,
          keyboardWidth,
          keyboardHeight,
          10
        );
        graphics.endFill();

        if (game.input.keyboard.isDown(keys[keysIdx].key) && imagePig.y < gameHeight - 300) {
          imagePig.y += (sitSpeed + 1);
        }
      }

    }

  };

})();
