var Marmot = function (game) {};

(function () {
  var GAME_TIME = 60000;
  var MONSTER_SPAWN_TIME = 1500;
  var MARMOT_DISAPPEAR_TIME = 2000;
  var bg, score, scoreText, timeText, gameTimer;
  var toolsLayer;
  var monsterTypes = ['marmot', 'leaf', 'son'];
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
      playerTools[this.tool].visible = false;
      playerTools[tool].visible = true;
      this.tool = tool;
    }
  };

  function spawnMonster () {
    var type = pickRandomElement(monsterTypes);
    var pos  = pickRandomElement(monsterEmptyPos);
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

    if (type == 'marmot')
      game.time.events.add(MARMOT_DISAPPEAR_TIME, function(){monster.destroy();}, this);

    game.world.bringToTop(toolsLayer);
  }

  function hitMonster (monster) {
    // ----- Success Condition
    var success = [];
    success[0] = (monster.monsterType == "leaf") && (player.tool == "waterpot");
    success[1] = (monster.monsterType == "son") && (player.tool == "dirt");

    // ----- Handling
    if (success[0] || success[1]) {
      score++;

      var monsterHitImg, monsterHit, monasterIndex;
      monster.destroy();
      monster.monsterType == 'leaf' ? monsterHitImg = 'leafGrew' : monsterHitImg = 'sonDirty';
      monsterIndex = monster.monsterPos;
      monsterHit = game.add.image(monsterPositions[monsterIndex].x, monsterPositions[monsterIndex].y, monsterHitImg);
      monsterHit.scale.setTo(0.5);
      game.add.tween(monsterHit).to( { alpha: 0, y: monster.y-30}, 2000, "Linear", true);
      game.time.events.add(2000, function(){monsterHit.destroy(); console.log('ddd');}, this);
      console.log('success');
    } else {
      score--;

      var monsterIndex = monster.monsterPos;
      monster.destroy();
      if (monster.monsterType == 'marmot') {
        monsterHit = game.add.image(monsterPositions[monsterIndex].x, monsterPositions[monsterIndex].y, 'marmotAngry');
        monsterHit.scale.setTo(0.5);
        game.time.events.add(2000, function(){monsterHit.destroy(); console.log('ddd');}, this);
        game.add.tween(monsterHit).to( { alpha: 0, y: monster.y-30}, 2000, "Linear", true);
      }
      console.log('failure');
    }
    monsterEmptyPos.push(monster.monsterPos);
    game.world.bringToTop(toolsLayer);
    
  }

  function pickRandomElement (array) {
    if (array.length == 0) loseGame();
    return array[Math.floor(Math.random()*array.length)];
  }

  function updateText() {
    scoreText.setText(score);
    timeText.setText((gameTimer.duration/1000).toFixed(2));
  }

  function loseGame() {
    alert('GGGGGGGGGG');
    game.state.start('MainMenu')
  }

  Marmot.prototype = {
    preload: function () {
      game = this.game;
      game.load.image('bg', 'media/marmot/Garden.png');

      game.load.image('waterpot', 'media/marmot/Water.png');
      game.load.image('dirt', 'media/marmot/Dirt.png');

      game.load.image('son', 'media/marmot/Man.png');
      game.load.image('sonDirty', 'media/marmot/Dirt-Man.png');
      game.load.image('leaf', 'media/marmot/Leaf.png');
      game.load.image('leafGrew', 'media/marmot/Big-Leaf.png');
      game.load.image('marmot', 'media/marmot/Mouse.png');
      game.load.image('marmotAngry', 'media/marmot/Angry-Mouse.png');

    },
    create: function () {
      // ----- Background
      bg = game.add.image(0, 0, 'bg');

      // ----- Timer
      gameTimer = game.time.create(false);
      gameTimer.add(GAME_TIME, loseGame, this);
      gameTimer.start();

      // ----- Text
      scoreText =  game.add.text(50, 50, 0, {font: '28px Arial', fill: '#000000'});
      timeText  =  game.add.text(50, 150, 60, {font: '28px Arial', fill: '#000000'});

      // ----- Tools
      toolsLayer = game.add.group();
      playerTools.waterpot = game.add.image(0, 0, 'waterpot');
      playerTools.waterpot.scale.setTo(0.5);
      playerTools.waterpot.visible = false;
      playerTools.waterpot.anchor.set(0.5, 0.5);
      toolsLayer.add(playerTools.waterpot);
      playerTools.dirt = game.add.image(0, 0, 'dirt');
      playerTools.dirt.scale.setTo(0.5);
      playerTools.dirt.visible = false;
      playerTools.dirt.anchor.set(0.5, 0.5);
      toolsLayer.add(playerTools.dirt);

      // ----- Init
      score = 0;
      player.init("waterpot");
      monsterEmptyPos = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      game.time.events.loop(MONSTER_SPAWN_TIME, spawnMonster, this);

    },
    update: function () {
      // ----- Mouse
      playerTools[player.tool].x = game.input.activePointer.x;
      playerTools[player.tool].y = game.input.activePointer.y;

      // ------ Keyboard Input
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
        } else if (e.keyCode == Phaser.KeyCode.D) {

          //monsters.destroy();
        }
      };

      // ----- Text
      updateText();
    }
  };

})();
