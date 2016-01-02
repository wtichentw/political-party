SitTightGame = function(game) {};

(function() {
  var keys = [
    {
      text: "A",
      key: Phaser.KeyCode.A
    },
    {
      text: "B",
      key: Phaser.KeyCode.B
    },
    {
      text: "C",
      key: Phaser.KeyCode.C
    },
    {
      text: "D",
      key: Phaser.KeyCode.D
    },
    {
      text: "E",
      key: Phaser.KeyCode.E
    },
    {
      text: "F",
      key: Phaser.KeyCode.F
    },
    {
      text: "G",
      key: Phaser.KeyCode.G
    },
    {
      text: "H",
      key: Phaser.KeyCode.H
    },
    {
      text: "I",
      key: Phaser.KeyCode.I
    },
    {
      text: "J",
      key: Phaser.KeyCode.J
    },
    {
      text: "K",
      key: Phaser.KeyCode.K
    },
    {
      text: "L",
      key: Phaser.KeyCode.L
    },
    {
      text: "M",
      key: Phaser.KeyCode.M
    },
    {
      text: "N",
      key: Phaser.KeyCode.N
    },
    {
      text: "O",
      key: Phaser.KeyCode.O
    },
    {
      text: "P",
      key: Phaser.KeyCode.P
    },
    {
      text: "Q",
      key: Phaser.KeyCode.Q
    },
    {
      text: "R",
      key: Phaser.KeyCode.R
    },
    {
      text: "S",
      key: Phaser.KeyCode.S
    },
    {
      text: "T",
      key: Phaser.KeyCode.T
    },
    {
      text: "U",
      key: Phaser.KeyCode.U
    },
    {
      text: "V",
      key: Phaser.KeyCode.V
    },
    {
      text: "W",
      key: Phaser.KeyCode.W
    },
    {
      text: "X",
      key: Phaser.KeyCode.X
    },
    {
      text: "Y",
      key: Phaser.KeyCode.Y
    },
    {
      text: "Z",
      key: Phaser.KeyCode.Z
    }
  ];

  var blahTexts = [
    "都快坐到桌子下面了啦",
    "屁股坐的好酸喔",
    "我說過會坐好坐滿嘛",
    "好想站起來休息一下",
    "啊唷！真拿你沒辦法",
    "這麼雷的遊戲你也敢玩？",
    "有必要這樣逼人家坐著嗎？",
    "我要使出全力站起來囉",
    "淡水阿嬤在找我啦！",
    "啊啊啊！快站起來了！"
  ];

  var imagePig;

  var keyText;
  var keysIdx;

  var graphics;
  var keyboardWidth;
  var keyboardHeight;
  var keyboardX;
  var keyboardY;

  var introLayer;

  var isStageStarted;
  var isTimerStarted;

  var sitSpeed = 1;
  var numSitTight = 0;

  var isBlahLayerExist;

  SitTightGame.prototype = {

    preload: function() {

      game.load.image("SitTightPig", "media/sit_tight/pig.png");
      game.load.image("SitTightBg", "media/sit_tight/bg.png");
      game.load.image("SitTightDesk", "media/sit_tight/desk.png");
      game.load.image("SitTightDialog", "media/sit_tight/dialog.png");
      game.load.image("SitTightGrandma", "media/sit_tight/grandma.png");

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

      // Draw intro screen
      var introGraphics = game.add.graphics(0, 0);

      introGraphics.beginFill(0x000000, 0.5);
      introGraphics.drawRect(0, 0, gameWidth, gameHeight);
      introGraphics.endFill();

      introLayer = game.add.group();
      introLayer.add(introGraphics);
      introLayer.z = 4;

    },

    update: function() {

      if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        introLayer.destroy();
        isStageStarted = true;
      }

      if (isStageStarted) {

        if (!isTimerStarted) {

          var time_interval = 3000;
          game.time.events.loop(time_interval, function() {
            keysIdx = Math.floor(Math.random() * keys.length);
            keyText.setText(keys[keysIdx].text);

            var blahText = game.add.text(
              imagePig.x + 500,
              200,
              blahTexts[Math.floor(Math.random() * blahTexts.length)],
              {
                font: "40px Arial",
                fill: "#000000"
              }
            );
            blahText.anchor.set(0.5);

            var dialogImage = game.add.image(blahText.x, blahText.y, "SitTightDialog");
            dialogImage.anchor.set(0.5);

            var blahLayer = game.add.group();
            blahLayer.add(dialogImage);
            blahLayer.add(blahText);
            blahLayer.z = 5;

            isBlahLayerExist = true;
            game.time.events.add(2000, function() {
              blahLayer.destroy();
              isBlahLayerExist = false;
            });

          });
          isTimerStarted = true;

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

        if (imagePig.y >= gameHeight - 300) {
          ++numSitTight;
        }

        if (numSitTight > 500) {
          isWarning = true;
        }

      }

    }

  };

}());
