var MainMenu = function(game) {};

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
      game.load.image("mainMenuRealPig", "media/main_menu/realpig.png");
      game.load.image("mainMenuSon", "media/main_menu/son.png");
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

      imageRealPig = game.add.image(40, 550, "mainMenuRealPig");
      imageRealPig.scale.set(0.31);

      imageSon = game.add.image(425, 445, "mainMenuSon");
      imageSon.scale.set(0.31);

      var images = [imagePig, imageHorse, imageEng, imageShi, imageRose, imageRealPig, imageSon];
      for (var i = 0; i < images.length; ++i) {
        images[i].inputEnabled = true;
        images[i].events.onInputOver.add(function() {
          this.y -= 20;
        }, images[i]);
        images[i].events.onInputOut.add(function() {
          this.y += 20;
        }, images[i]);
        // ----- ADD EVENT
        images[0].events.onInputDown.add(function() {
          this.game.state.start(
            "StageIntro",
            true,
            false,
            {
              titleText: "第二話｜做好做滿",
              subtitleText: "在我任期內，一定會做好做滿。",
              nextState: {
                key: "IntroVideo",
                args: {
                  videoPath: "media/sit_tight/intro.webm",
                  nextState: {
                    key: "SitTightGame"
                  }
                }
              }
            }
          );
        }, images[0]);

        images[2].events.onInputDown.add(function () {
          //alert('ouch');
          FB.ui({
            method: 'share',
            href: 'http://people.cs.nctu.edu.tw/~wtichen/fb.html',
          }, function(response){});
        }, images[2]);

        images[3].events.onInputDown.add(function() {
          this.game.state.start(
            "StageIntro",
            true,
            false,
            {
              titleText: "第一話｜馬習會",
              subtitleText: "我的一小握，是台灣的一大握",
              nextState: {
                key: "ShakeHandGame"
              }
            }
          );
        }, images[3]);

        images[5].events.onInputDown.add(function() {
          this.game.state.start(
            "StageIntro",
            true,
            false,
            {
              titleText: "第?話｜????",
              subtitleText: "??????",
              nextState: {
                key: "FlappyPig"
              }
            }
          );
        }, images[5]);

        images[6].events.onInputDown.add(function() {
          this.game.state.start(
            'StageIntro',
            true,
            false,
            {
              titleText: '第三話｜宋神掌',
              subtitleText: 'Happy Farm',
              nextState: {
                key: 'IntroVideo',
                args: {
                  videoPath: "media/marmot/intro.webm",
                  nextState: {
                    key: "Marmot"
                  }
                }
              }
            }
          );
        }, images[6]);
        // ----- END
      }
    },
  };
})();
