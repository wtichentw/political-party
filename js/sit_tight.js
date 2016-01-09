var SitTightGame = function(game) {

  this.game = game;
  this.asset = new Asset(
    this,
    "/media/sit_tight/",
    {
      images: [
        "bg.png",
        "pig.png",
        "desk.png",
        "key_up.png",
        "explanation1.jpg",
        "explanation2.jpg",
        "explanation3.jpg",
        "explosion.png"
      ]
    }
  );

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

  var state = {
    states: [
      {
        name: "Explanation",
        isStarted: false
      },
      {
        name: "CountDown",
        isStarted: false
      },
      {
        name: "Game",
        isStarted: false
      },
      {
        name: "GameOver",
        isStarted: false
      }
    ],
    currentStateIdx: 0,
    getCurrentState: function() {
      return this.states[this.currentStateIdx];
    },
    nextState: function() {
      ++this.currentStateIdx;
    }
  };

  var draw = {
    asset: {},
    bg: function() {
      var bgImage = game.add.image(0, 0, this.asset.getAssetKey("bg.png"));
      bgImage.scale.set(gameWidth / bgImage.width);

      return bgImage;
    },
    pig: function() {
      var pigImage = game.add.image(gameWidth / 2, gameHeight + 200, this.asset.getAssetKey("pig.png"));
      pigImage.anchor.set(0.5, 1);
      pigImage.scale.set((gameHeight - 100) / pigImage.height);

      return pigImage;
    },
    desk: function() {
      var deskImage = game.add.image(gameWidth / 2, gameHeight, this.asset.getAssetKey("desk.png"));
      deskImage.anchor.set(0.5, 1);
      deskImage.scale.set((gameHeight - 300) / deskImage.height);

      return deskImage;
    },
    explanations: function() {
      var explanationLayer = game.add.group();
      for (var i = 3; i >= 1; --i) {
        var explanationImage = game.add.image(0, 0, this.asset.getAssetKey("explanation" + i + ".jpg"));
        explanationImage.scale.set(gameWidth / explanationImage.width);
        explanationImage.inputEnabled = true;
        if (i === 3) {
          explanationImage.events.onInputDown.add(
            function() {
              this.destroy();
              state.nextState();
            },
            explanationImage
          );
        } else {
          explanationImage.events.onInputDown.add(
            function() {
              this.destroy();
            },
            explanationImage
          );
        }
        explanationLayer.add(explanationImage);
      }
      return explanationLayer;
    },
    countDown: function() {
      var texts = ["3", "2", "1", "GO!"];
      for (var i = 0; i < 4; ++i) {
        game.time.events.add(
          i * 1000,
          function(text) {
            var countDownText = game.add.text(
              gameWidth / 2,
              gameHeight / 2,
              text,
              {
                font: "100px Arial",
                fill: "#FF0000"
              }
            );
            countDownText.anchor.set(0.5);
            var countDownTextTween = game.add.tween(countDownText).to(
              {
                alpha: 0
              },
              1000,
              "Linear",
              true
            );
            if (text === "GO!") {
              countDownTextTween.onComplete.add(
                function() {
                  state.nextState();
                },
                game
              );
            }
          },
          game,
          texts[i]
        );
      }
    },
    keyboard: function(x, y, text) {
      var keyUpImage = game.add.image(x, y, this.asset.getAssetKey("key_up.png"));
      keyUpImage.anchor.set(0.5);
      keyUpImage.scale.set(70 / keyUpImage.width);

      var keyText = game.add.text(
        x,
        y,
        text,
        {
          font: "40px Arial",
          fill: "#FFFFFF"
        }
      );
      keyText.anchor.set(0.5);

      var group = game.add.group();
      group.add(keyUpImage);
      group.add(keyText);

      return group;
    },
    keyboards: function() {
      return game.add.group();
    },
    explosion: function(x) {
      var explosionImage = game.add.image(x, gameHeight, this.asset.getAssetKey("explosion.png"));
      explosionImage.anchor.set(0.5);

      return explosionImage;
    }
  };

  var pig = {
    body: {},
    standSpeed: 0.1,
    sitSpeed: 10,
    sit: function() {
      this.body.y += this.sitSpeed;
    },
    stand: function() {
      this.body.y -= this.standSpeed;
    }
  };

  var keyboard = {
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
    layer: {},
    generateRandomKey: function() {
      var keysKeys = Object.keys(this.keys);
      var idx = game.rnd.between(0, keysKeys.length - 1);
      var group = draw.keyboard(
        game.rnd.between(200, gameWidth - 200),
        -70,
        keysKeys[idx]
      );
      group.fallSpeed = game.rnd.between(1, 5);
      this.layer.add(group);
    },
    updateAll: function() {
      this.layer.forEach(
        function(keyboard) {
          keyboard.forEach(
            function(child) {
              child.y += this.fallSpeed;
            },
            keyboard
          );
        },
        this
      );
    }
  };

  SitTightGame.prototype = {

    preload: function() {

      this.asset.loadAll();

      draw.asset = this.asset;

    },

    create: function() {

      drawLayersInOrder(
        [
          [draw.bg()],
          [(pig.body = draw.pig())],
          [draw.desk()],
          [(keyboard.layer = draw.keyboards())],
          draw.explanations()
        ],
        game
      );

      for (var i = 0; i < 5; ++i) {
        keyboard.generateRandomKey();
      }

    },

    update: function() {

      var currentState = state.getCurrentState();
      switch (currentState.name) {

        case "Explantion":
          break;

        case "CountDown":
          if (!currentState.isStarted) {
            currentState.isStarted = true;
            draw.countDown();
          }
          break;

        case "Game":

          if (!currentState.isStarted) {
            currentState.isStarted = true;
            game.time.events.loop(
              1000,
              function() {
                keyboard.generateRandomKey();
              },
              game
            );
          }

          if (pig.body.y >= gameHeight) {
            pig.stand();
          } else {
            state.nextState();
          }

          keyboard.updateAll();

          keyboard.layer.forEachAlive(
            function(child) {
              var childImage = child.getChildAt(0);
              var childText = child.getChildAt(1);
              if (childImage.y + 35 >= gameHeight) {
                var explosionImage = draw.explosion(childImage.x);
                game.add.tween(explosionImage).to(
                  {
                    alpha: 0
                  },
                  500,
                  "Linear",
                  true
                );
                pig.stand();
                child.fallSpeed = 0;
                child.alive = false;
                this.removeChild(child);
                return;
              }
              if (game.input.keyboard.isDown(keyboard.keys[childText.text])) {
                pig.sit();
                child.fallSpeed = 0;
                child.alive = false;
                var childTween = game.add.tween(child).to(
                  {
                    alpha: 0
                  },
                  500,
                  "Linear",
                  true
                );
                childTween.onComplete.add(
                  function() {
                    this.destroy();
                  },
                  child
                );
              }
            },
            keyboard.layer
          );

          break;
      }

    }

  };

})();
