var MainMenu = function(game) {};

<<<<<<< HEAD
var imagePig;
var imageHorse;
var imageEng;
var imageShi;
var imageRose;

MainMenu.prototype = {
  preload: function() {
    this.game.load.image("mainMenuBg", "media/main_menu/main_menu_bg.jpg");
    this.game.load.image("mainMenuPig", "media/main_menu/pig.png");
    this.game.load.image("mainMenuHorse", "media/main_menu/horse.png");
    this.game.load.image("mainMenuEng", "media/main_menu/eng.png");
    this.game.load.image("mainMenuShi", "media/main_menu/shi.png");
    this.game.load.image("mainMenuRose", "media/main_menu/rose.png");
  },
  create: function() {
    this.game.add.image(0, 0, "mainMenuBg");

    imagePig = this.game.add.image(790, 240, "mainMenuPig");
    imagePig.scale.set(0.33);

    imageHorse = this.game.add.image(510, 110, "mainMenuHorse");
    imageHorse.scale.set(0.37);

    imageEng = this.game.add.image(220, 320, "mainMenuEng");
    imageEng.scale.set(0.33);

    imageShi = this.game.add.image(1070, 520, "mainMenuShi");
    imageShi.scale.set(0.33);

    imageRose = this.game.add.image(600, 100, "mainMenuRose");
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
    }

    images[3].events.onInputDown.add(function() {
      this.game.state.start("ShakeHandIntro");
    }, images[3]);
  },
};
=======
(function() {
  var imagePig;
  var imageHorse;
  var imageEng;
  var imageShi;
  var imageRose;

  MainMenu.prototype = {
    preload: function() {
      game.load.image("mainMenuBg", "media/main_menu/main_menu_bg.jpg");
      game.load.image("mainMenuPig", "media/main_menu/pig.png");
      game.load.image("mainMenuHorse", "media/main_menu/horse.png");
      game.load.image("mainMenuEng", "media/main_menu/eng.png");
      game.load.image("mainMenuShi", "media/main_menu/shi.png");
      game.load.image("mainMenuRose", "media/main_menu/rose.png");
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
              subtitleText: "在我任期內，一定會做好做滿。"
            }
          );
        }, images[0]);
      }
    },
  };
})();
>>>>>>> 6955f2493070e4ed6febe2411404bcc8973a9a06
