var MainMenu = function(game) {};

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
  },
};
