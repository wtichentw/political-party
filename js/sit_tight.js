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
        "explosion.png",
        "dialog.png",
        "grandma.png",
        "light.png"
      ],
      videos: [
        "grandma.webm"
      ],
      audios: [
        "bgm.mp3"
      ]
    }
  );

};

(function() {
  "use strict";

  var constant = {
    murmurTexts: [
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
    ]
  };

  var state = {
    isPaused: false,
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

      var keyboardGroup = game.add.group();
      keyboardGroup.add(keyUpImage);
      keyboardGroup.add(keyText);

      return keyboardGroup;
    },
    keyboards: function() {
      return game.add.group();
    },
    explosion: function(x) {
      var explosionImage = game.add.image(x, gameHeight, this.asset.getAssetKey("explosion.png"));
      explosionImage.anchor.set(0.5);

      return explosionImage;
    },
    murmur: function(text) {
      var x = gameWidth - 250;
      var y = 200;
      var dialogImage = game.add.image(x, y, this.asset.getAssetKey("dialog.png"));
      dialogImage.anchor.set(0.5);
      dialogImage.scale.set(0.7);

      var murmurText = game.add.text(
        x,
        y,
        text,
        {
          font: "30px Arial",
          fill: "#000000"
        }
      );
      murmurText.anchor.set(0.5);

      var murmurGroup = game.add.group();
      murmurGroup.add(dialogImage);
      murmurGroup.add(murmurText);

      game.add.tween(murmurGroup).to(
        {
          alpha: 0
        },
        500,
        "Linear",
        true,
        2000
      );

      return murmurGroup;
    },
    warning: function() {
      var warningText = game.add.text(
        gameWidth / 2,
        gameHeight / 2,
        "WARNING",
        {
          font: "150px Arial",
          fill: "#FF0000"
        }
      );
      warningText.anchor.set(0.5);

      return warningText;
    },
    grandma: function() {
      var grandmaImage = game.add.image(0, gameHeight, this.asset.getAssetKey("grandma.png"));
      grandmaImage.anchor.set(0, 1);
      grandmaImage.x = -1 * grandmaImage.width;
      grandmaImage.scale.set(0.5);

      return grandmaImage;
    },
    grandmaVideo: function() {
      var graphics = game.add.graphics();
      graphics.beginFill(0x000000, 0.5);
      graphics.drawRect(0, 0, gameWidth, gameHeight);
      graphics.endFill();

      var grandmaVideo = game.add.video(this.asset.getAssetKey("grandma.webm"));

      var grandmaVideoLayer = game.add.group();
      grandmaVideoLayer.add(graphics);
      var videoSprite = grandmaVideoLayer.create(gameWidth / 2, gameHeight / 2, grandmaVideo);
      videoSprite.anchor.set(0.5);
      videoSprite.scale.set(gameHeight / grandmaVideo.height);

      return grandmaVideoLayer;
    },
    light: function(x, y) {
      var lightImage = game.add.image(x, y, this.asset.getAssetKey("light.png"));
      lightImage.anchor.set(0.5);
      lightImage.scale.set(0.5);

      return lightImage;
    },
    score: function() {
      var scoreText = game.add.text(
        50,
        50,
        "Score: 0",
        {
          font: "50px Arial",
          fill: "#FF0000"
        }
      );

      return scoreText;
    }
  };

  var audio = {};

  var layer = {};

  var pig = {
    body: {},
    standSpeed: 0.1,
    sitSpeed: 10,
    sit: function() {
      this.body.y += this.sitSpeed;
    },
    stand: function(speed) {
      var standSpeed = speed || this.standSpeed;
      this.body.y -= standSpeed;
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
    timer: {},
    generateRandomKey: function() {
      var keysKeys = Object.keys(this.keys);
      var idx = game.rnd.between(0, keysKeys.length - 1);
      var group = draw.keyboard(
        game.rnd.between(200, gameWidth - 200),
        -70,
        keysKeys[idx]
      );
      group.fallSpeed = game.rnd.between(1, 5);
      layer.keyboards.add(group);
    },
    updateAll: function() {
      layer.keyboards.forEach(
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

  var score = {
    text: {},
    current: 0,
    add: function(n) {
      this.current += (n || 1);
      this.updateText();
    },
    updateText: function() {
      this.text.text = "Score: " + this.current;
    }
  };

  SitTightGame.prototype = {

    preload: function() {

      this.asset.loadAll();

      draw.asset = this.asset;

    },

    create: function() {

      layer = drawLayersInOrder(
        {
          bg: [draw.bg()],
          pig: [draw.pig()],
          desk: [draw.desk()],
          score: [draw.score()],
          keyboards: draw.keyboards(),
          explanations: draw.explanations()
        },
        game
      );

      pig.body = layer.pig.getChildAt(0);
      score.text = layer.score.getChildAt(0);

      for (var i = 0; i < 5; ++i) {
        keyboard.generateRandomKey();
      }

      audio.bgm = game.add.audio(this.asset.getAssetKey("bgm.mp3"));
      audio.bgm.play();

    },

    update: function() {

      if (!state.isPaused) {

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
              keyboard.timer = game.time.events.loop(
                1000,
                function() {
                  keyboard.generateRandomKey();
                },
                game
              );
              game.time.events.loop(
                5000,
                function() {
                  var murmurTexts = constant.murmurTexts;
                  draw.murmur(murmurTexts[game.rnd.between(0, murmurTexts.length - 1)]);
                },
                game
              );
              game.time.events.add(
                5000,
                function() {
                  var warningText = draw.warning();
                  warningText.alpha = 0;
                  var warningTextTween = game.add.tween(warningText).to(
                    {
                      alpha: 1
                    },
                    500,
                    "Linear",
                    true,
                    0,
                    3,
                    true
                  );
                  warningTextTween.onComplete.add(
                    function() {
                      var grandmaImage = draw.grandma();
                      var grandmaImageTween = game.add.tween(grandmaImage).to(
                        {
                          x: gameWidth
                        },
                        5000,
                        "Linear",
                        true
                      );
                      grandmaImageTween.onComplete.add(
                        function() {
                          game.time.events.pause();
                          state.isPaused = true;
                          audio.bgm.pause();
                          var grandmaVideoLayer = draw.grandmaVideo();
                          var grandmaVideo = grandmaVideoLayer.getChildAt(1).key;
                          grandmaVideo.play();
                          grandmaVideo.onComplete.add(
                            function() {
                              this.destroy();
                              var lightImage = draw.light(
                                pig.body.x,
                                pig.body.y - pig.body.height + 10
                              );
                              lightImage.alpha = 0;
                              layer.pig.add(lightImage);
                              var lightImageTween = game.add.tween(lightImage).to(
                                {
                                  x: pig.body.x + 50,
                                  y: pig.body.y - pig.body.height + 50,
                                  alpha: 1
                                },
                                2000,
                                "Linear",
                                true
                              );
                              game.add.tween(lightImage.scale).to(
                                {
                                  x: 2,
                                  y: 2
                                },
                                2000,
                                "Linear",
                                true
                              );
                              lightImageTween.onComplete.add(
                                function() {
                                  this.destroy();
                                  pig.stand(100);
                                  audio.bgm.resume();
                                  state.isPaused = false;
                                  game.time.events.resume();
                                },
                                lightImage
                              );
                            },
                            grandmaVideoLayer
                          );
                        },
                        this
                      );
                    },
                    this
                  );
                },
                this
              );
            }

            if (pig.body.y >= gameHeight) {
              pig.stand();
            } else {
              state.nextState();
            }

            keyboard.updateAll();

            layer.keyboards.forEachAlive(
              function(child) {
                var childImage = child.getChildAt(0);
                var childText = child.getChildAt(1);
                if (childImage.y + 35 >= gameHeight) {
                  pig.stand(5);
                  var explosionImage = draw.explosion(childImage.x);
                  game.add.tween(explosionImage).to(
                    {
                      alpha: 0
                    },
                    500,
                    "Linear",
                    true
                  );
                  child.fallSpeed = 0;
                  child.alive = false;
                  this.removeChild(child);
                  return;
                }
                if (game.input.keyboard.isDown(keyboard.keys[childText.text])) {
                  score.add();
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
              layer.keyboards
            );

            break;

          case "GameOver":
            if (!currentState.isStarted) {
              audio.bgm.stop();
              game.time.events.stop();
            }

            break;
        }

      }

    }

  };

})();
