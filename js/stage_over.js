var StageOver = function(game) {
  this.game = game;
};

(function() {

  var btnWidth = 438;
  var btnHeight = 150;

  var logoImagePath;
  var score;
  var againState;
  var knowMoreUrl;
  var policyUrl;

  var knowMoreBtn;
  var againBtn;
  var policyBtn;
  var fbBtn;

  function btnOnClick(button) {
    switch (button.ID) {
      case 2:
        window.open(knowMoreUrl, "_blank");
        break;
      case 1:
        game.state.start(againState);
        break;
      case 3:
        window.open(policyUrl, "_blank");
        break;
      case 4:
        FB.ui({
          method: "share",
          href: "https://politicalparty.tw",
          title: '期末考前絕對不能點開的小遊戲',
          picture: 'http://politicalparty.tw/media/fb_share.jpg',
          description: '有些人喜歡，有些人不喜歡，因為他有一種政治味'
        });
        break;
    }
  }

  StageOver.prototype = {

    init: function(args) {
      this.game.world.removeAll();
      logoImagePath = args.logoImagePath;
      score = args.score;
      againState = args.againState;
      knowMoreUrl = args.knowMoreUrl;
      policyUrl = args.policyUrl;

    },

    preload: function() {
      this.game.load.image('logoImagePath', logoImagePath);
      this.game.load.image("backToMainMenu", "./media/ending/back_to_main_menu.png");
      this.game.load.image('fbBtn', "./media/fb_icon.png");
      this.game.load.spritesheet("knowMoreBtn", "./media/ending/know_more_btn.png", btnWidth, btnHeight);
      this.game.load.spritesheet("againBtn", "./media/ending/again_btn.png", btnWidth, btnHeight);
      this.game.load.spritesheet("policyBtn", "./media/ending/policy_btn.png", btnWidth, btnHeight);
      this.game.load.audio('gameOverSound', './media/ending/game_over.mp3');
    },

    create: function() {

      var gameOverSound;

      gameOverSound = this.game.add.audio('gameOverSound', 1, false);
      gameOverSound.play();

      this.stage.setBackgroundColor(0xFFFFFF);

      this.game.add.image(0, 0, 'logoImagePath');
      this.game.add.text(
        gameWidth / 2 + 300,
        275,
        score + "分",
        {
          font: "60px Arial",
          fill: "#000000"
        }
      );

      var knowMoreBtnX = gameWidth / 2;
      var knowMoreBtnY = gameHeight / 2 + 150;

      knowMoreBtn = this.game.add.button(
        knowMoreBtnX,
        knowMoreBtnY,
        "knowMoreBtn",
        btnOnClick,
        knowMoreBtn,
        0,
        0,
        1,
        0
      );
      knowMoreBtn.anchor.set(0.5);
      knowMoreBtn.scale.set(0.5);
      knowMoreBtn.ID = 2;

      againBtn = this.game.add.button(
        knowMoreBtnX - btnWidth / 2 - 100,
        knowMoreBtnY,
        "againBtn",
        btnOnClick,
        againBtn ,
        0,
        0,
        1,
        0
      );
      againBtn.anchor.set(0.5);
      againBtn.scale.set(0.5);
      againBtn.ID = 1;

      policyBtn = this.game.add.button(
        knowMoreBtnX + btnWidth / 2 + 100,
        knowMoreBtnY,
        "policyBtn",
        btnOnClick,
        policyBtn,
        0,
        0,
        1,
        0
      );
      policyBtn.anchor.set(0.5);
      policyBtn.scale.set(0.5);
      policyBtn.ID = 3;

      fbBtn = this.game.add.image(
        50,
        this.game.height-50,
        "fbBtn"
      );
      fbBtn.anchor.setTo(0.0, 1.0);
      fbBtn.scale.setTo(0.5);
      fbBtn.inputEnabled = true;
      fbBtn.ID = 4;
      fbBtn.events.onInputDown.add(btnOnClick);

      var backToMainMenuImage = game.add.image(gameWidth, gameHeight, "backToMainMenu");
      backToMainMenuImage.anchor.set(1, 1);
      backToMainMenuImage.scale.set(0.5);
      backToMainMenuImage.inputEnabled = true;
      backToMainMenuImage.events.onInputDown.add(
        function() {
          this.game.state.start("MainMenu");
        },
        this
      );

    }

  };

})();
