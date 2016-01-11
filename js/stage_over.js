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
  function btnOnClick() {
    switch (this) {
      case knowMoreBtn:
        break;
      case againBtn:
        game.state.start(againState);
        break;
      case policyBtn:
        break;
    }
  }

  StageOver.prototype = {

    init: function(args) {

      logoImagePath = args.logoImagePath;
      score = args.score;
      againState = args.againState;
      knowMoreUrl = args.knowMoreUrl;
      policyUrl = args.policyUrl;

    },

    preload: function() {

      this.game.load.image(logoImagePath, logoImagePath);
      this.game.load.image("backToMainMenu", "/media/ending/back_to_main_menu.png");
      this.game.load.spritesheet("knowMoreBtn", "/media/ending/know_more_btn.png", btnWidth, btnHeight);
      this.game.load.spritesheet("againBtn", "/media/ending/again_btn.png", btnWidth, btnHeight);
      this.game.load.spritesheet("policyBtn", "/media/ending/policy_btn.png", btnWidth, btnHeight);

    },

    create: function() {

      this.stage.setBackgroundColor(0xFFFFFF);

      this.game.add.image(0, 0, logoImagePath);
      this.game.add.text(
        gameWidth / 2 + 250,
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
