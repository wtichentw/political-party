var MainMenu = function(game) {};

(function() {
  var imagePig;
  var imageHorse;
  var imageEng;
  var imageShi;
  var imageRose;

  MainMenu.prototype = {

    preload: function() {
      game.load.image("mainMenuBg", "images/main_menu/main_menu_bg.jpg");
      game.load.image("mainMenuPig", "images/main_menu/pig.png");
      game.load.image("mainMenuHorse", "images/main_menu/horse.png");
      game.load.image("mainMenuEng", "images/main_menu/eng.png");
      game.load.image("mainMenuShi", "images/main_menu/shi.png");
      game.load.image("mainMenuRose", "images/main_menu/rose.png");
    },

    create: function() {
      game.add.image(0, 0, "mainMenuBg");

      imagePig = game.add.image(790, 240, "mainMenuPig");
      imagePig.scale.set(0.33);

      imageHorse = game.add.image(510, 110, "mainMenuHorse");
      imageHorse.scale.set(0.37);

      imageEng = game.add.image(220, 320, "mainMenuEng");
      imageEng.scale.set(0.33);

      imageShi = game.add.image(1070, 520, "mainMenuShi");
      imageShi.scale.set(0.33);

      imageRose = game.add.image(600, 100, "mainMenuRose");
      imageRose.scale.set(0.31);

      var images = [imagePig, imageHorse, imageEng, imageShi, imageRose];
      for (var i = 0; i < images.length; ++i) {
        images[i].inputEnabled = true;
        images[i].events.onInputOver.add(function() {
          this.y -= 20;
        }, images[i]);
        images[i].events.onInputOut.add(function() {
          this.y += 20;
        }, images[i]);

        images[0].events.onInputDown.add(function() {
          this.game.state.start(
            "StageIntro",
            true,
            false,
            {
              titleText: "第二話｜做好做滿",
              subtitleText: "在我任期內，一定會做好做滿。",
              stageKey: "SitTightGame"
            }
          );
        }, images[0]);

        images[3].events.onInputDown.add(function() {
          this.game.state.start(
            "StageIntro",
            true,
            false,
            {
              titleText: "第一話｜馬習會",
              subtitleText: "我的一小握，是台灣的一大握",
              stageKey: "ShakeHandGame"
            }
          );
        }, images[3]);
      }

    }

  };

}());
