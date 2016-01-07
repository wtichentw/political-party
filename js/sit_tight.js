var SitTightGame = function(game) {

  this.game = game;
  this.asset = new Asset(
    this,
    "/media/sit_tight/",
    {
      images: [
        "bg.png",
        "pig.png",
        "desk.png"
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

  SitTightGame.prototype = {

    preload: function() {

      this.asset.loadAll();

      this.keyboard.game = this.game;
      this.keyboard.keys = this.constant.keys;
      this.keyboard.status = this.status;
      this.keyboard.rnd = this.game.rnd;
      this.keyboard.draw = this.draw;

      this.draw.game = this.game;
      this.draw.asset = this.asset;

    },

    create: function() {

      this.status.keysLayer = this.game.add.group();

      drawLayersInOrder(
        [
          [this.draw.bg()],
          [(this.pig.body = this.draw.pig())],
          [this.draw.desk()],
          this.status.keysLayer
        ],
        this.game
      );

      for (var i = 0; i < 5; ++i) {
        this.keyboard.generateRandomKey();
      }

      this.keyboard.updateAll();

    },

    update: function() {

      this.keyboard.updateAll();

      if (this.pig.body.y >= gameHeight) {
        this.pig.stand();
      } else {
        //lose
      }

    },

    constant: {

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
      }

    },

    status: {

      isStageStarted: false,

      level: 1,

      keysLayer: {},

      currentKeys: []

    },

    pig: {

      body: {},

      standSpeed: 1,

      sitSpeed: 2,

      sit: function() {
        this.body.y += this.sitSpeed;
      },

      stand: function() {
        this.body.y -= this.standSpeed;
      }

    },

    keyboard: {

      game: {},

      keys: {},

      status: {},

      rnd: {},

      draw: {},

      generateRandomKey: function() {
        var keysKeys = Object.keys(this.keys);
        var idx = this.rnd.between(0, keysKeys.length - 1);
        this.status.currentKeys.push(
          {
            key: {
              text: keysKeys[idx],
              keyCode: this.keys[keysKeys[idx]]
            },
            x: this.rnd.between(100, gameWidth - 200),
            y: -70,
            fallSpeed: this.rnd.between(1, 5)
          }
        );
      },

      updateAll: function() {
        this.status.keysLayer.destroy(true);

        var keysLayer = this.game.add.group();
        var currentKeys = this.status.currentKeys;

        for (var i = 0; i < currentKeys.length; ++i) {
          keysLayer.add(
            this.draw.keyboard(
              currentKeys[i].key.text,
              currentKeys[i].x,
              (currentKeys[i].y += currentKeys[i].fallSpeed)
            )
          );
        }
        this.status.keysLayer = keysLayer;
      }

    },

    draw: {

      game: {},

      asset: {},

      bg: function() {
        var imageBg = this.game.add.image(0, 0, this.asset.getAssetKey("bg.png"));
        imageBg.scale.set(gameWidth / imageBg.width);

        return imageBg;
      },

      pig: function() {
        var imagePig = this.game.add.image(gameWidth / 2, gameHeight + 200, this.asset.getAssetKey("pig.png"));
        imagePig.anchor.set(0.5, 1);
        imagePig.scale.set((gameHeight - 100) / imagePig.height);

        return imagePig;
      },

      desk: function() {
        var imageDesk = this.game.add.image(gameWidth / 2, gameHeight, this.asset.getAssetKey("desk.png"));
        imageDesk.anchor.set(0.5, 1);
        imageDesk.scale.set((gameHeight - 300) / imageDesk.height);

        return imageDesk;
      },

      keyboard: function(text, x, y) {
        var width = 70;
        var height = width;
        if (y === undefined) {
          y = -1 * height;
        }

        var graphics = this.game.add.graphics();
        graphics.beginFill(0x333333);
        graphics.drawRoundedRect(
          x,
          y,
          width,
          height,
          10
        );

        var keyText = this.game.add.text(
          x + width / 2,
          y + height / 2,
          text,
          {
            font: "40px Arial",
            fill: "#FFFFFF"
          }
        );
        keyText.anchor.set(0.5);

        var group = this.game.add.group();
        group.add(graphics);
        group.add(keyText);

        return group;
      }

    }

  };

})();
