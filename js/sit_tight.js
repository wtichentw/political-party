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

  // var keys = {
  //   "A": Phaser.KeyCode.A,
  //   "B": Phaser.KeyCode.B,
  //   "C": Phaser.KeyCode.C,
  //   "D": Phaser.KeyCode.D,
  //   "E": Phaser.KeyCode.E,
  //   "F": Phaser.KeyCode.F,
  //   "G": Phaser.KeyCode.G,
  //   "H": Phaser.KeyCode.H,
  //   "I": Phaser.KeyCode.I,
  //   "J": Phaser.KeyCode.J,
  //   "K": Phaser.KeyCode.K,
  //   "L": Phaser.KeyCode.L,
  //   "M": Phaser.KeyCode.M,
  //   "N": Phaser.KeyCode.N,
  //   "O": Phaser.KeyCode.O,
  //   "P": Phaser.KeyCode.P,
  //   "Q": Phaser.KeyCode.Q,
  //   "R": Phaser.KeyCode.R,
  //   "S": Phaser.KeyCode.S,
  //   "T": Phaser.KeyCode.T,
  //   "U": Phaser.KeyCode.U,
  //   "V": Phaser.KeyCode.V,
  //   "W": Phaser.KeyCode.W,
  //   "X": Phaser.KeyCode.X,
  //   "Y": Phaser.KeyCode.Y,
  //   "Z": Phaser.KeyCode.Z
  // };

  SitTightGame.prototype = {

    preload: function() {

      this.asset.loadAll();

    },

    create: function() {

      drawLayersInOrder(
        [
          [this.draw.bg.call(this)],
          [this.draw.pig.call(this)],
          [this.draw.desk.call(this)]
        ],
        this.game
      );

    },

    update: function() {
    },

    draw: {

      bg: function() {
        var imageBg = this.game.add.image(0, 0, this.asset.getAssetKey("bg.png"));
        imageBg.scale.set(gameWidth / imageBg.width);

        return imageBg;
      },

      pig: function() {
        var imagePig = this.game.add.image(gameWidth / 2, gameHeight, this.asset.getAssetKey("pig.png"));
        imagePig.anchor.set(0.5, 1);
        imagePig.scale.set((gameHeight - 100) / imagePig.height);

        return imagePig;
      },

      desk: function() {
        var imageDesk = this.game.add.image(gameWidth / 2, gameHeight, this.asset.getAssetKey("desk.png"));
        imageDesk.anchor.set(0.5, 1);
        imageDesk.scale.set((gameHeight - 300) / imageDesk.height);

        return imageDesk;
      }

    }

  };

})();
