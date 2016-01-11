var Marmot = function (game) {};

(function () {
  "use strict";
  // ----- AUDIO
  var dirtSound, toolSound, waterSound, wrongSound, startSound;
  // ----- STATE
  var isIntro = false, isPlay = false, isOver = false;
  // ----- START EXPLAIN VAR
  var explainIndex, explainCur;
  var EXPLAIN_COUNT = 3+1;
  // ----- START RESULT VARIABLE
  var againBtn, moreBtn, policyBtn, menuBtn, fbBtn;
  var againBtnPress, moreBtnPress, policyBtnPress;
  // ----- START GAME VARIABLE
  var GAME_TIME = 60*1000;
  var MONSTER_SPAWN_TIME = 2500;
  var currentState;
  var bg, bgm, score, scoreText, timeText, gameTimer;
  var toolsLayer;
  var monsterTypes = ["marmot", "leaf", "son"];
  var monsterEmptyPos = [];
  var monsterPositions = [
    {},
    {x: 375, y: 290},
    {x: 580, y: 290},
    {x: 790, y: 290},
    {x: 375, y: 390},
    {x: 580, y: 390},
    {x: 790, y: 390},
    {x: 375, y: 490},
    {x: 580, y: 490},
    {x: 790, y: 490}
  ];
  var playerTools = {};
  var player = {
    tool: "",
    init: function (tool) {
      this.tool = tool;
      playerTools[this.tool].visible = true;
    },
    changeTool: function (tool) {
      toolSound.play();
      playerTools[this.tool].visible = false;
      playerTools[tool].visible = true;
      this.tool = tool;
    }
  };
  // ----- END GAME VARIABLE
  function countDown() {
   var texts = ["3", "2", "1", "GO!"];
   for (var i = 0; i < 4; ++i) {
     game.time.events.add(
       i * 1000,
       function(text) {
         var countDownText = game.add.text(
           gameWidth / 2,
           gameHeight / 2,
           text,
           {
             font: "100px Arial",
             fill: "#FF0000"
           }
         );
         countDownText.anchor.set(0.5);
         var countDownTextTween = game.add.tween(countDownText).to(
           {
             alpha: 0
           },
           1000,
           "Linear",
           true
         );
         if (text === "GO!") {
           countDownTextTween.onComplete.add(
             function() {
               currentState = 'gamePlay';
               startSound.play();
             },
             game
           );
         }
       },
       game,
       texts[i]
     );
   }
 }

  function rndSpawnMonster () {
    var monsterAmount = game.rnd.integerInRange(1, 3);
    for (var i = 0; i < monsterAmount; i++)
      spawnMonster();
  }

  function spawnMonster () {
    var type = pickRandomElement(monsterTypes);
    var pos  = pickRandomElement(monsterEmptyPos);

    if (pos != 0) {
      var monster = game.add.image(monsterPositions[pos].x, monsterPositions[pos].y, type);
      monster.scale.setTo(0.5);
      monster.alpha = 0.1;
      monster.z = 1;
      monster.inputEnabled = true;
      monster.events.onInputDown.add(hitMonster, this);
      monster.monsterType = type;
      monster.monsterPos = pos;
      monsterEmptyPos.splice(monsterEmptyPos.indexOf(pos), 1);
      game.add.tween(monster).to( { alpha: 1 }, 500, "Linear", true);

      if (type == "marmot")
        game.time.events.add(2000, function(){destroyMonster(monster, 2000);}, this);

      game.world.bringToTop(toolsLayer);
      console.log(monsterEmptyPos);

    }
  }

  function hitMonster (monster) {
    // ----- Success Condition
    var success = [];
    success[0] = (monster.monsterType == "leaf") && (player.tool == "waterpot");
    success[1] = (monster.monsterType == "son") && (player.tool == "dirt");

    // ----- Handling
    var monsterHitImg, monsterHit, monsterIndex;
    if (success[0] || success[1]) {
      score++;
      if (monster.monsterType == "leaf") {
        waterSound.play();
        monsterHitImg = "leafGrew";
      }
      if (monster.monsterType == "son") {
        dirtSound.play();
        monsterHitImg = "sonDirty";
      }
    } else {
      score--;
      wrongSound.play();
      if (monster.monsterType == "marmot")  monsterHitImg = "marmotAngry";
      if (monster.monsterType == "son")     monsterHitImg = "sonWrong";
      if (monster.monsterType == "leaf")    monsterHitImg = "leafWrong";
    }
    monsterIndex = monster.monsterPos;
    monster.destroy();
    monsterHit = game.add.image(monsterPositions[monsterIndex].x, monsterPositions[monsterIndex].y, monsterHitImg);
    monsterHit.scale.setTo(0.5);
    monsterHit.monsterPos = monster.monsterPos;
    destroyMonster(monsterHit, 2000);
    game.world.bringToTop(toolsLayer);
  }

  function destroyMonster(monster, time) {
    game.add.tween(monster).to( { alpha: 0, y: monster.y-30}, time, "Linear", true);
    game.time.events.add(time, function(){
      monster.destroy();
      monsterEmptyPos.push(monster.monsterPos);
    }, this);
  }

  function pickRandomElement (array) {
    var element = array[Math.floor(Math.random()*array.length)];
    return element === undefined ? 0: element;
  }

  function updateText() {
    scoreText.setText("Score : "+score);
    timeText.setText("Time : "+(gameTimer.duration/1000).toFixed(2));
  }

  function gameIntroInit() {
    isIntro = true;
    bgm.play();

    explainIndex = 1;
    explainCur = game.add.image(0, 0, "explain"+explainIndex);
    explainCur.inputEnabled = true;
    explainCur.events.onInputDown.add(explainListener, this);
    //explainCur.inputEnabled = true;
  }

  function gamePlayInit() {
    isPlay = true;
    gameTimer.add(GAME_TIME, function(){
      bgm.stop();
      game.state.start(
        "StageOver",
        true,
        false,
        {
          logoImagePath: "./media/marmot/ending.png",
          score: score,
          againState: "Marmot",
          knowMoreUrl: "https://theinitium.com/article/20150806-dailynews-tw-1/",
          policyUrl: "https://www.facebook.com/media/set/?set=a.1690070997875035.1073741829.1683872658494869&type=3&__mref=message_bubble"
        }
      );
    }, this);
    gameTimer.start();
    game.time.events.loop(MONSTER_SPAWN_TIME, rndSpawnMonster, this);
  }


  function gameOverInit() {
    isOver = true;
    //alert("Game\"s over");
    // ----- Clean up and change state
    game.world.removeAll();
    game.time.removeAll();

    // ----- Show Result
    var resultLogo, scoreText;
    resultLogo = game.add.image(game.width/2-400, 200, "resultLogo");
    resultLogo.anchor.setTo(0.0, 0.0);
    resultLogo.scale.setTo(0.5);

    scoreText = game.add.text(890, 290, score+"分", {font: "40px Arial", fill: "#FF0000"});

    againBtnPress = game.add.image(game.width/2-400, 400, "againPress");
    againBtnPress.anchor.setTo(0.0, 0.0);
    againBtnPress.scale.setTo(0.5);
    againBtn = game.add.image(game.width/2-400, 400, "again");
    againBtn.anchor.setTo(0.0, 0.0);
    againBtn.scale.setTo(0.5);
    againBtn.inputEnabled = true;
    againBtn.buttonID = 1;
    againBtn.events.onInputUp.add(buttonUp, this);
    againBtn.events.onInputDown.add(buttonDown, this);

    moreBtnPress = game.add.image(game.width/2, 400, "morePress");
    moreBtnPress.anchor.setTo(0.5, 0.0);
    moreBtnPress.scale.setTo(0.5);
    moreBtn = game.add.image(game.width/2, 400, "more");
    moreBtn.anchor.setTo(0.5, 0.0);
    moreBtn.scale.setTo(0.5);
    moreBtn.inputEnabled = true;
    moreBtn.buttonID = 2;
    moreBtn.events.onInputUp.add(buttonUp, this);
    moreBtn.events.onInputDown.add(buttonDown, this);

    policyBtnPress = game.add.image(game.width/2+400, 400, "policyPress");
    policyBtnPress.anchor.setTo(1.0, 0.0);
    policyBtnPress.scale.setTo(0.5);
    policyBtn = game.add.image(game.width/2+400, 400, "policy");
    policyBtn.anchor.setTo(1.0, 0.0);
    policyBtn.scale.setTo(0.5);
    policyBtn.inputEnabled = true;
    policyBtn.buttonID = 3;
    policyBtn.events.onInputUp.add(buttonUp, this);
    policyBtn.events.onInputDown.add(buttonDown, this);

    menuBtn = game.add.image(game.width, game.height, "menu");
    menuBtn.anchor.setTo(1.0);
    menuBtn.scale.setTo(0.6);
    menuBtn.inputEnabled = true;
    menuBtn.buttonID = 4;
    menuBtn.events.onInputUp.add(buttonUp, this);

    fbBtn = game.add.image(50, game.height-50, "fb");
    fbBtn.anchor.setTo(0.0, 1.0);
    fbBtn.scale.setTo(0.5);
    fbBtn.inputEnabled = true;
    fbBtn.buttonID = 5;
    fbBtn.events.onInputUp.add(buttonUp, this);
  }

  function buttonDown (button) {
    switch (button.buttonID) {
      case 1:
        againBtn.visible = false;
        break;
      case 2:
        moreBtn.visible = false;
        break;
      case 3:
        policyBtn.visible = false;
        break;
      default:
        break;
    }
  }

  function buttonUp (button) {
    switch (button.buttonID) {
      case 1:
        game.state.start("Marmot");
        break;
      case 2:
        var win = window.open("https://theinitium.com/article/20150806-dailynews-tw-1/", '_blank');
        //win.focus();
        break;
      case 3:
        alert("lazy policy");
        break;
      case 4:
        game.state.start("MainMenu");
        break;
      case 5:
        FB.ui({
          method: "share",
          href: "https://politicalparty.tw"
        });
        break;
      default:
        break;
    }
  }

  function explainListener() {
    explainIndex++;
    explainCur.destroy();
    if (explainIndex == EXPLAIN_COUNT)
      countDown();
      //currentState = "gamePlay";
    else {
      explainCur = game.add.image(0, 0, "explain"+explainIndex);
      explainCur.inputEnabled = true;
      explainCur.events.onInputDown.add(explainListener, this);

    }
  }

  function gameIntroUpdate () {
    // ----- Mouse
    playerTools[player.tool].x = game.input.activePointer.x;
    playerTools[player.tool].y = game.input.activePointer.y;
  }

  function gamePlayUpdate() {
    // ----- Mouse
    playerTools[player.tool].x = game.input.activePointer.x;
    playerTools[player.tool].y = game.input.activePointer.y;

    // ----- Keyboard Input
    game.input.keyboard.onDownCallback = function (e) {
      if (e.keyCode == Phaser.KeyCode.SPACEBAR) {
        switch (player.tool) {
          case "waterpot":
            player.changeTool("dirt");
            break;
          case "dirt":
            player.changeTool("waterpot");
            break;
          default:
            break;
        }
      }
    };

    // ----- Text
    updateText();
  }

  Marmot.prototype = {
    preload: function () {
      game = this.game;
      // ----- Background
      game.load.image("bg", "media/marmot/Garden.png");
      game.load.image("fb", "media/fb_icon.png");
      // ----- Exlain
      game.load.image("explain1", "media/marmot/explain1.jpg");
      game.load.image("explain2", "media/marmot/explain2.jpg");
      game.load.image("explain3", "media/marmot/explain3.jpg");
      // ----- Tools
      game.load.image("waterpot", "media/marmot/Water.png");
      game.load.image("dirt", "media/marmot/Dirt.png");
      // ----- Monster & its effect
      game.load.image("son", "media/marmot/Man.png");
      game.load.image("sonDirty", "media/marmot/Dirt-Man.png");
      game.load.image("sonWrong", "media/marmot/Wrong-Man.png");
      game.load.image("leaf", "media/marmot/Leaf.png");
      game.load.image("leafGrew", "media/marmot/Big-Leaf.png");
      game.load.image("leafWrong", "media/marmot/Wrong-Leaf.png");
      game.load.image("marmot", "media/marmot/Mouse.png");
      game.load.image("marmotAngry", "media/marmot/Angry-Mouse.png");

      // ----- audio
      game.load.audio("bgm", "media/marmot/son_bgm.mp3");
      game.load.audio("dirtSound", "media/marmot/dirt.mp3");
      game.load.audio("toolSound", "media/marmot/tool.mp3");
      game.load.audio("waterSound", "media/marmot/water.mp3");
      game.load.audio("wrongSound", "media/marmot/wrong.mp3");
      game.load.audio("startSound", "media/marmot/start.mp3");
    },
    create: function () {
      // ----- Background Element
      bg = game.add.image(0, 0, "bg");

      // ----- Audio
      bgm = game.add.audio("bgm", 1, true);
      dirtSound = game.add.audio("dirtSound", 3, false);
      waterSound = game.add.audio("waterSound", 3, false);
      wrongSound = game.add.audio("wrongSound", 3, false);
      toolSound = game.add.audio("toolSound", 3, false);
      startSound = game.add.audio("startSound", 3, false);

      // ----- Timer
      gameTimer = game.time.create(false);

      // ----- Text
      scoreText =  game.add.text(game.width/2-100, 50, 'Score : 0', {font: "32px Arial", fill: "#ff0000"});
      scoreText.anchor.setTo(1.0, 0.0);
      timeText  =  game.add.text(game.width/2+100, 50, 'Time : 60', {font: "32px Arial", fill: "#ff0000"});
      timeText.anchor.setTo(0.0, 0.0);

      // ----- Tools
      toolsLayer = game.add.group();
      playerTools.waterpot = game.add.image(0, 0, "waterpot");
      playerTools.waterpot.scale.setTo(0.5);
      playerTools.waterpot.visible = false;
      playerTools.waterpot.anchor.set(0.5, 0.5);
      toolsLayer.add(playerTools.waterpot);
      playerTools.dirt = game.add.image(0, 0, "dirt");
      playerTools.dirt.scale.setTo(0.5);
      playerTools.dirt.visible = false;
      playerTools.dirt.anchor.set(0.5, 0.5);
      toolsLayer.add(playerTools.dirt);

      // ----- Init
      isIntro = false;
      isPlay = false;
      isOver = false;
      score = 0;
      player.init("waterpot");
      monsterEmptyPos = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      currentState = "gameIntro";
    },
    update: function () {
      switch (currentState) {
        case "gameIntro":
          if (!isIntro) gameIntroInit();
          gameIntroUpdate();
          break;
        case "gamePlay":
          if (!isPlay) gamePlayInit();
          gamePlayUpdate();
          break;
        case "gameOver":
          //if (!isOver) gameOverInit();
          break;
        default:
      }
    }
  };

})();
