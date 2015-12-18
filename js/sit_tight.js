SitTightGame = function(game) {};

(function() {

  var imagePig;

  SitTightGame.prototype = {

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
