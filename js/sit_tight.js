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
  var keysIdx = 0;

  var graphics;
  var keyboardWidth;
  var keyboardHeight;
  var keyboardX;
  var keyboardY;

  SitTightGame.prototype = {

    preload: function() {

      game.load.image("SitTightPig", "media/sit_tight/pig.png");
      game.load.image("SitTightBg", "media/sit_tight/bg.png");
      game.load.image("SitTightDesk", "media/sit_tight/desk.png");

      // Reset keyIdx to 0
      keysIdx = 0;

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
        "J",
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

    },

    update: function() {

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
        imagePig.y += (sitSpeed + 20);
        ++keysIdx;
        if (keysIdx == keys.length) {
          keyText.setText("");
        } else {
          keyText.setText(keys[keysIdx].text);
        }
      }

    }

  };

})();
