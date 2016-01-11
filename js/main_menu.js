var MainMenu = function(game) {};

(function() {
  var imagePig;
  var imageHorse;
  var imageEng;
  var imageShi;
  var imageRose;
  var imageSon;
  var imageRealPig;
  var imageFB;
  var imageLazy;
  var imageCredit;
  var imageTeam;

  var imageTeamLayer;
  var objLayer;

  const lazyURL = 'https://www.facebook.com/1683872658494869/photos/a.1690070997875035.1073741829.1683872658494869/1690071014541700/?type=3&theater';

  MainMenu.prototype = {
    preload: function() {
      game.load.image("mainMenuBg", "media/main_menu/main_menu_bg.png");
      game.load.image("mainMenuPig", "media/main_menu/pig.png");
      game.load.image("mainMenuHorse", "media/main_menu/horse.png");
      game.load.image("mainMenuEng", "media/main_menu/eng.png");
      game.load.image("mainMenuShi", "media/main_menu/shi.png");
      game.load.image("mainMenuRose", "media/main_menu/rose.png");
      game.load.image("mainMenuRealPig", "media/main_menu/realpig.png");
      game.load.image("mainMenuSon", "media/main_menu/son.png");
      game.load.image('mainMenuLazy', "media/main_menu/lazy.png");
      game.load.image('mainMenuCredit', "media/main_menu/credit.png");
      game.load.image('mainMenuTeam', "media/main_menu/team.png");

      game.load.image('mainMenuFBShare', "media/fb_icon.png");
    },
    create: function() {
      game.add.image(0, 0, "mainMenuBg");
      game.stage.setBackgroundColor(0xACEBFA);

      imageTeam = game.add.image(game.width/2, game.height/2, "mainMenuTeam");
      imageTeam.anchor.set(0.5, 0.5);
      imageTeam.scale.set(0.7, 0.7);
      imageTeam.alpha = 0;
      imageTeam.inputEnabled = true;

      imageTeamLayer = game.add.group();
      objLayer = game.add.group();
      imageTeamLayer.add(imageTeam);

      imageFB = this.game.add.image(50, this.game.height-50, "mainMenuFBShare");
      imageFB.anchor.setTo(0.0, 1.0);
      imageFB.scale.setTo(0.5);
      imageFB.inputEnabled = true;

      imageLazy = game.add.image(790, 280, "mainMenuLazy");
      imageLazy.inputEnabled = true;

      imageCredit = game.add.image(355, 415, "mainMenuCredit");
      imageCredit.inputEnabled = true;

      imagePig = game.add.image(890, 330, "mainMenuPig");
      imagePig.scale.set(0.33);
      //
      // imageHorse = game.add.image(510, 110, "mainMenuHorse");
      // imageHorse.scale.set(0.37);

      imageEng = game.add.image(220, 320, "mainMenuEng");
      imageEng.scale.set(0.33);

      // imageShi = game.add.image(1070, 520, "mainMenuShi");
      // imageShi.scale.set(0.33);
      //
      // imageRose = game.add.image(600, 100, "mainMenuRose");
      // imageRose.scale.set(0.31);

      // imageRealPig = game.add.image(40, 550, "mainMenuRealPig");
      // imageRealPig.scale.set(0.31);

      imageSon = game.add.image(625, 495, "mainMenuSon");
      imageSon.scale.set(0.31);


      objLayer.add(imageFB);
      objLayer.add(imageLazy);
      objLayer.add(imageCredit);
      objLayer.add(imagePig);
      objLayer.add(imageEng);
      objLayer.add(imageSon);

      var images = [imagePig, imageHorse, imageEng, imageShi, imageRose, imageRealPig, imageSon, imageLazy, imageCredit];
      var allow = [true, false, true, false, false, false, true, true, true];
      for (var i = 0; i < images.length; ++i) {
        if (!allow[i]) {
          continue;
        }
        images[i].inputEnabled = true;
        images[i].events.onInputOver.add(function() {
          this.y -= 20;
        }, images[i]);
        images[i].events.onInputOut.add(function() {
          this.y += 20;
        }, images[i]);

      }

      game.add.tween(imageLazy).to(
        {
          y: imageLazy.y-20
        },
        300,
        "Linear",
        true,
        0,
        10,
        true
      );

      game.add.tween(imageCredit).to(
        {
          y: imageCredit.y-20
        },
        300,
        "Linear",
        true,
        0,
        10,
        true
      );


      // ----- ADD PIC CLICK EVENT ----- //
      imagePig.events.onInputDown.add(function() {
        this.game.state.start(
          "StageIntro",
          true,
          false,
          {
            titleText: "第一話｜坐好坐滿",
            subtitleText: "在我任期內，一定會坐好坐滿。",
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
      }, imagePig);

      imageEng.events.onInputDown.add(function() {
        this.game.state.start(
          "StageIntro",
          true,
          false,
          {
            titleText: "第二話｜絕地女士",
            subtitleText: "小英的真實身份居然是…",
            nextState: {
              key: "IntroVideo",
              args: {
                videoPath: "media/yoda/intro.webm",
                nextState: {
                  key: "Yoda"
                }
              }
            }
          }
        );
      }, imageEng);

      // images[3].events.onInputDown.add(function() {
      //   this.game.state.start(
      //     "StageIntro",
      //     true,
      //     false,
      //     {
      //       titleText: "第四話｜馬習會",
      //       subtitleText: "我的一小握，是台灣的一大握",
      //       nextState: {
      //         key: "ShakeHandGame"
      //       }
      //     }
      //   );
      // }, images[3]);

      // images[5].events.onInputDown.add(function() {
      //   this.game.state.start(
      //     "StageIntro",
      //     true,
      //     false,
      //     {
      //       titleText: "第?話｜????",
      //       subtitleText: "??????",
      //       nextState: {
      //         key: "FlappyPig"
      //       }
      //     }
      //   );
      // }, images[5]);

      imageSon.events.onInputDown.add(function() {
        this.game.state.start(
          "StageIntro",
          true,
          false,
          {
            titleText: "第三話｜宋神掌",
            subtitleText: "捏泥巴，捏泥巴，捏捏捏捏捏泥巴",
            nextState: {
              key: "IntroVideo",
              args: {
                videoPath: "media/marmot/intro.webm",
                nextState: {
                  key: "Marmot"
                }
              }
            }
          }
        );
      }, imageSon);

      // ----- Lazy policy package
      imageLazy.events.onInputDown.add(function(){
        window.open(lazyURL, '_blank')
      });

      // ----- Team
      imageCredit.events.onInputDown.add(function(){

        game.add.tween(imageTeam).to( { alpha: 1 }, 500, "Linear", true);
        game.world.bringToTop(imageTeamLayer);
      });

      imageTeam.events.onInputDown.add(function(){
        game.add.tween(imageTeam).to( { alpha: 0 }, 500, "Linear", true);
        game.world.bringToTop(objLayer);
      })

      // ----- FB Share
      imageFB.events.onInputDown.add(function(){
        FB.ui({
          method: "share",
          href: "https://politicalparty.tw",
          title: '期末考前絕對不能點開的小遊戲',
          picture: 'http://politicalparty.tw/media/fb_share.jpg',
          description: '有些人喜歡，有些人不喜歡，因為他有一種政治味'
        });
      });
      // ----- END PIC CLICK EVENT ----- //
    }
  };
})();
