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

      keysIdx = game.rnd.between(0, keys.length);

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

      // Draw Mr.Pig
      var scaleFactor = 0.5;
      imagePig = game.add.image(gameWidth / 2, gameHeight + 200, "SitTightPig");
      imagePig.scale.set(scaleFactor);
      imagePig.anchor.set(0.5, 1)

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
      var keyboardWidth = 70;
      var keyboardHeight = keyboardWidth;
      var keyboardX = 100;
      var keyboardY = 100;
      keyText = game.add.text(
        keyboardX + keyboardWidth / 2,
        keyboardY + keyboardHeight / 2,
        keys[keysIdx].text,
        {
          font: "40px Arial",
          fill: "#FFFFFF"
        }
      );
      keyText.anchor.set(0.5);

      graphicsHUD = game.add.graphics(0, 0);

      graphicsHUD.beginFill(0x333333);
      graphicsHUD.drawRoundedRect(
        keyboardX,
        keyboardY,
        keyboardWidth,
        keyboardHeight,
        10
      );
      graphicsHUD.endFill();

      var HUDLayer = game.add.group();
      HUDLayer.add(graphicsHUD);
      HUDLayer.add(keyText);
      HUDLayer.z = 3;

      // Draw intro screen
      var graphicsIntro = game.add.graphics(0, 0);

      graphicsIntro.beginFill(0x000000, 0.5);
      graphicsIntro.drawRect(0, 0, gameWidth, gameHeight);
      graphicsIntro.endFill();

      introLayer = game.add.group();
      introLayer.add(graphicsIntro);
      introLayer.z = 4;

    },

    update: function() {

      if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        introLayer.destroy();
        isStageStarted = true;
      }

      if (isStageStarted) {

        if (!isTimerStarted) {
          var KEY_CHANGE_INTERVAL = 2000;
          game.time.events.loop(KEY_CHANGE_INTERVAL, function() {
            keysIdx = game.rnd.between(0, keys.length);
            keyText.setText(keys[keysIdx].text);

            var BLAH_TEXT_X = imagePig.x + 400;
            var BLAH_TEXT_Y = 100;
            var blahText = game.add.text(
              BLAH_TEXT_X,
              BLAH_TEXT_Y,
              blahTexts[game.rnd.between(0, blahTexts.length - 1)],
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
            var BLAH_DISAPPEAR_INTERVAL = 2000;
            game.time.events.add(BLAH_DISAPPEAR_INTERVAL, function() {
              blahLayer.destroy();
              isBlahLayerExist = false;
            });

          });
          isTimerStarted = true;
        }

        if (imagePig.y >= gameHeight) {
          imagePig.y -= sitSpeed;
        } else {
          alert("請坐好，坐滿");
          game.state.start("MainMenu");
          return;
        }

        if (game.input.keyboard.isDown(keys[keysIdx].key) && imagePig.y < gameHeight + 400) {
          imagePig.y += (sitSpeed + 1);
        }

      }
    }

  };

}());
