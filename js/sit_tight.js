var SitTightGame = function(game) {
  this.game = game;
};

(function() {
  "use strict";

  // var blahTexts = [
  //   "都快坐到桌子下面了啦",
  //   "屁股坐的好酸喔",
  //   "我說過會坐好坐滿嘛",
  //   "好想站起來休息一下",
  //   "啊唷！真拿你沒辦法",
  //   "這麼雷的遊戲你也敢玩？",
  //   "有必要這樣逼人家坐著嗎？",
  //   "我要使出全力站起來囉",
  //   "淡水阿嬤在找我啦！",
  //   "啊啊啊！快站起來了！"
  // ];

  // var grandmaWords = "記得有一次到淡水去拜拜的時候\n一個阿嬤跟我說：\n「市長，你一定要出來選。」\n我說：「我已經承諾所有辛北市民\n阿嬤跟我說：「你如果不出來，\n連天公伯都不會原諒你。」\n這段話讓我非常感動！";

  SitTightGame.prototype = {

    images: {
      bg: {
        path: "/media/sit_tight/bg.png",
        key: "SitTightBg",
        image: {}
      },
      pig: {
        path: "/media/sit_tight/pig.png",
        key: "SitTightPig",
        image: {}
      },
      desk: {
        path: "/media/sit_tight/desk.png",
        key: "SitTightDesk",
        image: {}
      }
    },

    draw: {
      bg: function(game) {
        var imageBg = game.add.image(0, 0, "SitTightBg");

        return imageBg;
      },
      pig: function(game) {
        var imagePig = game.add.image(gameWidth / 2, gameHeight + 200, "SitTightPig");
        imagePig.anchor.set(0.5, 1);

        return imagePig;
      },
      desk: function(game) {
        var imageDesk = game.add.image(gameWidth / 2, gameHeight, "SitTightDesk");
        imageDesk.anchor.set(0.5, 1);

        return imageDesk;
      },
      keyboard: function(game, text) {
        var keyboardWidth = 70;
        var keyboardHeight = keyboardWidth;
        var keyboardX = 100;
        var keyboardY = 100;

        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x333333);
        graphics.drawRoundedRect(
          keyboardX,
          keyboardY,
          keyboardWidth,
          keyboardHeight,
          10
        );
        graphics.endFill();

        var keyText = game.add.text(
          keyboardX + keyboardWidth / 2,
          keyboardY + keyboardHeight / 2,
          text,
          {
            font: "40px Arial",
            fill: "#FFFFFF"
          }
        );
        keyText.anchor.set(0.5);

        var layer = game.add.group();
        layer.add(graphics);
        layer.add(keyText);

        return layer;
      }
    },

    keyboard: {
      keys: {
        "A": Phaser.KeyCode.A,
        "B": Phaser.KeyCode.B,
        "C": Phaser.KeyCode.C,
        "D": Phaser.KeyCode.D,
        "E": Phaser.KeyCode.E,
        "F": Phaser.KeyCode.F,
        "G": Phaser.KeyCode.G,
        "H": Phaser.KeyCode.H,
        "I": Phaser.KeyCode.I,
        "J": Phaser.KeyCode.J,
        "K": Phaser.KeyCode.K,
        "L": Phaser.KeyCode.L,
        "M": Phaser.KeyCode.M,
        "N": Phaser.KeyCode.N,
        "O": Phaser.KeyCode.O,
        "P": Phaser.KeyCode.P,
        "Q": Phaser.KeyCode.Q,
        "R": Phaser.KeyCode.R,
        "S": Phaser.KeyCode.S,
        "T": Phaser.KeyCode.T,
        "U": Phaser.KeyCode.U,
        "V": Phaser.KeyCode.V,
        "W": Phaser.KeyCode.W,
        "X": Phaser.KeyCode.X,
        "Y": Phaser.KeyCode.Y,
        "Z": Phaser.KeyCode.Z
      },

      nextKey: function() {
        var keysKeys = Object.keys(this.keys);
        var keyText = keysKeys[game.rnd.between(0, keysKeys.length - 1)];
        return {
          text: keyText,
          key: this.keys[keyText]
        };
      },

      currentKey: {
        text: "A",
        key: Phaser.KeyCode.A
      }
    },

    preload: function() {

      // game.load.audio("SitTightBGM", this.background.auidioPath);
      // game.load.audio("SitTightGrandmaMusic", "media/sit_tight/grandma_music.mp3");

      game.load.image(this.images.pig.key, this.images.pig.path);
      game.load.image(this.images.bg.key, this.images.bg.path);
      game.load.image(this.images.desk.key, this.images.desk.path);
      // game.load.image("SitTightDialog", "media/sit_tight/dialog.png");
      // game.load.image("SitTightGrandma", "media/sit_tight/grandma.png");
      // game.load.image("SitTightExplanation1", this.explanations.imagePaths[0]);
      // game.load.image("SitTightExplanation2", this.explanations.imagePaths[1]);
      // game.load.image("SitTightExplanation3", this.explanations.imagePaths[2]);

    },

    create: function() {

      game.stage.setBackgroundColor(0xFFFFFF);

      // this.background.audio = game.add.audio("SitTightBGM", 1, true);
      // grandmaMusic = game.add.audio("SitTightGrandmaMusic");

      // this.background.audio.play();

      this.images.bg.image = this.draw.bg(this.game);
      this.images.pig.image = this.draw.pig(this.game);
      this.images.desk.image = this.draw.desk(this.game);

      drawLayersInOrder(
        [
          [this.images.bg.image],
          [this.images.pig.image],
          [this.images.desk.image],
          this.draw.keyboard(this.game, this.keyboard.currentKey.text)
        ],
        this.game
      );

    },

    update: function() {

      //       if (isStageStarted) {

      //         if (!isTimerStarted) {
      //           var KEY_CHANGE_INTERVAL = 2000;
      //           game.time.events.loop(KEY_CHANGE_INTERVAL, function() {
      //             keysIdx = game.rnd.between(0, keys.length - 1);
      //             keyText.setText(keys[keysIdx].text);

      //             var BLAH_TEXT_X = imagePig.x + 400;
      //             var BLAH_TEXT_Y = 100;
      //             var blahText = game.add.text(
      //               BLAH_TEXT_X,
      //               BLAH_TEXT_Y,
      //               blahTexts[game.rnd.between(0, blahTexts.length - 1)],
      //               {
      //                 font: "40px Arial",
      //                 fill: "#000000"
      //               }
      //             );
      //             blahText.anchor.set(0.5);

      //             var dialogImage = game.add.image(blahText.x, blahText.y, "SitTightDialog");
      //             dialogImage.anchor.set(0.5);

      //             var blahLayer = game.add.group();
      //             blahLayer.add(dialogImage);
      //             blahLayer.add(blahText);
      //             blahLayer.z = 5;

      //             var BLAH_DISAPPEAR_INTERVAL = 1500;
      //             game.time.events.add(BLAH_DISAPPEAR_INTERVAL, function() {
      //               blahLayer.destroy();
      //             });

      //           });

      //           var warningText = game.add.text(
      //             gameWidth / 2,
      //             gameHeight / 2,
      //             "WARNING",
      //             {
      //               font: "200px Arial",
      //               fill: "#FF0000"
      //             }
      //           );
      //           warningText.alpha = 0.0;
      //           warningText.anchor.set(0.5);
      //           var GRANDMA_INTERVAL = 10000;
      //           game.time.events.add(GRANDMA_INTERVAL, function() {
      //             var warningTextTween = game.add.tween(warningText).to(
      //               {
      //                 alpha: 1
      //               },
      //               200,
      //               "Linear",
      //               true,
      //               0,
      //               10,
      //               true
      //             );
      //             warningTextTween.onComplete.add(function() {
      //               var imageGrandma = game.add.image(0, gameHeight, "SitTightGrandma");
      //               imageGrandma.scale.set(0.5);
      //               imageGrandma.anchor.set(0.5, 1);
      //               var imageGrandmaTween = game.add.tween(imageGrandma).to(
      //                 {
      //                   x: gameWidth + imageGrandma.width / 2
      //                 },
      //                 5000,
      //                 "Linear",
      //                 true
      //               );
      //               imageGrandmaTween.onComplete.add(function() {
      //                 game.time.removeAll();
      //                 isStageStarted = false;
      //                 var graphics = game.add.graphics(0, 0);
      //                 graphics.beginFill(0x000000, 0.5);
      //                 graphics.drawRect(0, 0, gameWidth, gameHeight);
      //                 graphics.endFill();
      //                 var grandmaText = game.add.text(
      //                   gameWidth / 2,
      //                   gameHeight,
      //                   grandmaWords,
      //                   {
      //                     font: "60px Arial",
      //                     fill: "#FFFFFF"
      //                   }
      //                 );
      //                 grandmaText.anchor.set(0.5, 1);
      //                 bgm.pause();
      //                 grandmaMusic.play();
      //                 var grandmaTextTween = game.add.tween(grandmaText).to(
      //                   {
      //                     y: 0
      //                   },
      //                   15000,
      //                   "Linear",
      //                   true
      //                 );
      //                 grandmaTextTween.onComplete.add(function() {
      //                   graphics.clear();
      //                   grandmaMusic.stop();
      //                   bgm.resume();
      //                   imagePig.y -= 200;
      //                   isStageStarted = true;
      //                   isTimerStarted = false;
      //                 }, grandmaTextTween);
      //               }, imageGrandmaTween);
      //             }, warningTextTween);
      //           });

      //           isTimerStarted = true;
      //         }

      //         if (imagePig.y >= gameHeight) {
      //           imagePig.y -= sitSpeed;
      //         } else {
      //           alert("請坐好，坐滿");
      //           bgm.stop();
      //           game.state.start("MainMenu");
      //           return;
      //         }

      //         if (game.input.keyboard.isDown(keys[keysIdx].key) && imagePig.y < gameHeight + 400) {
      //           imagePig.y += (sitSpeed + 1);
      //         }

      //       }
    }

  };

})();
