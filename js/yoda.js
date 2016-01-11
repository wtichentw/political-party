var Yoda = function (game) {};

(function () {

  const PLAY_TIME = 60;

  const UpKey = Phaser.Keyboard.UP;
  const DownKey = Phaser.Keyboard.DOWN;
  const LeftKey = Phaser.Keyboard.LEFT;
  const RightKey = Phaser.Keyboard.RIGHT;
  const Velocity = 200;
  const VELOCITY_PARAM = 1.8;
  const MASK_WIDTH = 32, MASK_HEIGHT = 32;
  const BG_OFFSET_X = 0, BG_OFFSET_Y = 0.15;
  const SPAWN_MONSTER_TIME = 1600;

  const DIRECTION = { NONE: 0, LEFT: 1, RIGHT: 2, UP: 3, BOTTOM: 4 };


  var isCountDown;
  var selectedCharacter;
  var characterMenu;
  var expPics = ['explain3', 'explain2', 'explain1'];
  var monsters = {};
  var monsterIndex = 0;
  var monsterType = ['ufo', 'et', 'meteor'];
  var monsterDir = [
  { x: 1, y: 0, from:    0, to: 1280, anchor:[1.0, 0.0], dir: 'x'},
  { x:-1, y: 0, from: 1280, to:    0, anchor:[0.0, 0.0], dir: 'x'},
  { x: 0, y: 1, from:    0, to:  720, anchor:[0.0, 1.0], dir: 'y'},
  { x: 0, y:-1, from:  720, to:    0, anchor:[0.0, 0.0], dir: 'y'}
  ];
  var isStart = false;
  var tsai;
  var mapDirty;
  var remainTime = PLAY_TIME, score;
  var remainTimeText, scoreText;
  var selectedCharacter;
  var countDownEvent, createMonsterEvent;

  var fontStyle = {font: 'bold 44px Arial', fill: '#fff', boundsAlignH: 'left', boundsAlignV: 'middle'};

  const TR_OFFSET_X = -0.307, TR_OFFSET_Y = -0.187, TR_SCALE_X = 0.805, TR_SCALE_Y = 0.695;
  const DIS_OFFSET_X = 0, DIS_OFFSET_Y = 0.1, DIS_SCALE_X = 0.8, DIS_SCALE_Y = 0.7;
  const TEXT_SCORE = 'Score:', TEXT_TIME = 'Time:'

  function createAudioPlayer(audioList) {
    var audioPlayer = {};
    for(var i in audioList) {
      var audioName = audioList[i];
      audioPlayer[audioName] = game.add.audio(audioName);
    }
    return {
      get: (name) => { return audioPlayer[name]; }
    };
  }

  function createCharacter(name, bSpr) {
    var character = {};
    var stepAudio = audioPlayer.get('step');
    character.spr = game.add.sprite(game.width*0.2, game.height*0.2, name);
    character.spr.anchor.setTo(.5, .5);
    character.spr.animations.add('left', [1], 1, false);
    character.spr.animations.add('right', [0], 1, false);
    game.physics.enable(character.spr, Phaser.Physics.ARCADE);
    character.spr.body.collideWorldBounds = true;
    character.spr.body.immovable = true;
    character.moveDirH = DIRECTION.NONE;
    character.moveDirV = DIRECTION.NONE;
    character.velocity = Velocity;
    character.isMoving = function() {
      return character.moveDirH != DIRECTION.NONE || character.moveDirV != DIRECTION.NONE;
    };
    character.playStep = function() {
      if(!stepAudio.isPlaying)
        stepAudio.loopFull();
    }
    character.moveLeft = function() {
      if(character.moveDirH == DIRECTION.LEFT)
        return;
      character.moveDirH = DIRECTION.LEFT;
      character.turnLeft();
      character.spr.body.velocity.setTo(-character.velocity, character.spr.body.velocity.y);
    };
    character.moveRight = function() {
      if(character.moveDirH == DIRECTION.RIGHT)
        return;
      character.moveDirH = DIRECTION.RIGHT;
      character.turnRight();
      character.spr.body.velocity.setTo(character.velocity, character.spr.body.velocity.y);
    };
    character.moveUp = function() {
      if(character.moveDirV == DIRECTION.UP)
        return;
      character.moveDirV = DIRECTION.UP;
      character.spr.body.velocity.setTo(character.spr.body.velocity.x, -character.velocity);
    };
    character.moveBottom = function() {
      if(character.moveDirV == DIRECTION.BOTTOM)
        return;
      character.moveDirV = DIRECTION.BOTTOM;
      character.spr.body.velocity.setTo(character.spr.body.velocity.x, character.velocity);
    };
    character.stop = function() {
      character.moveDirH = DIRECTION.NONE;
      character.moveDirV = DIRECTION.NONE;
      character.spr.body.velocity.setTo(0, 0);
      stepAudio.stop();
    };
    character.stopH = function() {
      character.moveDirH = DIRECTION.NONE;
      character.spr.body.velocity.setTo(0, character.spr.body.velocity.y);
      if(!character.isMoving())
        stepAudio.stop();
    };
    character.stopV = function() {
      character.moveDirV = DIRECTION.NONE;
      character.spr.body.velocity.setTo(character.spr.body.velocity.x, 0);
      if(!character.isMoving())
        stepAudio.stop();
    };
    character.mudFloor = function() {
      var spr = character.spr;
      var dirtyKey = mapDirty.calculateDirtyKey(character);
      var offsetX = character.faceDir == DIRECTION.LEFT?-MASK_WIDTH:0;
      if(mapDirty.changeBackground(dirtyKey.x, dirtyKey.y)) {
        var x = spr.body.x-bgPos.x+spr.width/2+offsetX;
        var y = spr.body.y-bgPos.y+spr.height;
        x = parseInt(Math.round(x/MASK_WIDTH))*MASK_WIDTH;
        y = parseInt(Math.round(y/MASK_HEIGHT))*MASK_HEIGHT;
        maskBg(x, y);
        maskBg(x+MASK_WIDTH, y);
        maskBg(x-MASK_WIDTH, y);
        score = mapDirty.getProgress();
        console.log(mapDirty.getProgress());
        updateScore();
        character.playStep();
      }
    };
    character.turnLeft = function() {
      character.spr.animations.play('left');
      character.faceDir = DIRECTION.LEFT;
    };
    character.turnRight = function() {
      character.spr.animations.play('right');
      character.faceDir = DIRECTION.RIGHT;
    };
    character.update = function() {
      if(character.isMoving())
        character.mudFloor();
    };

    return character;
  }

  function createMapDirty(spr) {
    var mapDirty = {};
    var total = 0;
    var lWidth = spr.width/MASK_WIDTH;
    var lHeight = spr.height/MASK_HEIGHT;
    for(var i = 0; i < lWidth; i++) {
      for(var j = 0; j < lHeight; j++) {
        var key = i+';'+j;
        mapDirty[key] = 0;
        total++;
      }
    }
    var mapDirtyMgr = {
      mapDirty: mapDirty
    };
    mapDirtyMgr.calculateDirtyKey = function(character) {
      var charSpr = character.spr;
      var offsetX = 0;
      var offsetY = charSpr.height/2;
      var x = charSpr.x - bgPos.x + offsetX;
      var y = charSpr.y - bgPos.y + offsetY;
      var dirtyX = parseInt(Math.round(x/MASK_WIDTH));
      var dirtyY = parseInt(Math.round(y/MASK_HEIGHT));
      return { x: dirtyX, y: dirtyY };
    }
    mapDirtyMgr.changeBackground = function(x, y) {
      var dirtyKey = x+';'+y;
      if(dirtyKey in this.mapDirty) {
        var origin = this.mapDirty[dirtyKey];
        this.mapDirty[dirtyKey] = 1;
        return !origin;
      }
      return false;
    };
    mapDirtyMgr.getProgress = function() {
      var count = 0;
      for(var i in this.mapDirty) {
        if(this.mapDirty[i] == 1)
          count++;
      }
      return parseInt(count/total*100);
    };
    return mapDirtyMgr;
  }

  function calculateBackgroundPosition(spr, offsetX, offsetY) {
    var x = (game.width-spr.width)/2+offsetX*game.width;
    var y = (game.height-spr.height)/2+offsetY*game.height;
    return {x: x, y: y};
  }

  // ----- START
  function createMonster () {
    var type = pickRandomElement(monsterType);
    var dir  = pickRandomElement(monsterDir);
    var pos;
    var scale;

    if (dir.dir === 'x') {
      pos = {x: dir.from, y: game.rnd.integerInRange(0, game.height)};
      velocity = generateVelocity(pos);
      scale = convertScaleByVelocity(velocity);
    } else {
      pos = {x: game.rnd.integerInRange(0, game.width), y: dir.from};
      velocity = generateVelocity(pos);
      scale = convertScaleByVelocity(velocity);
    }
    var spr = game.add.sprite(pos.x, pos.y, type);
    spr.scale.setTo(scale.x, scale.y);
    var monster = {
      id: monsterIndex,
      spr: spr
    };
    game.physics.enable(monster.spr, Phaser.Physics.ARCADE);

    game.add.tween(spr.body).to( velocity, 3000, Phaser.Easing.Linear.None, true);

    game.time.events.add(3000, (context)=>{meetMonster(context.monster);}, null, {this: this, monster: monster});
    spr.anchor.setTo(dir.anchor[0], dir.anchor[1]);
    monsters[monster.id] = monster;
    var audio = audioPlayer.get(type);
    if(audio) {
      audio.play();
    }
    monsterIndex++;
  }

  function meetMonster(monster) {
    destroyMonster(monster);
    if(remainTime > 0)
      remainTime--;
    updateRemainTime();
  }

  function destroyMonster(monster) {
    delete monsters[monster.id];
    monster.spr.destroy();
  }

  function pickRandomElement (array) {
    var element = array[Math.floor(Math.random()*array.length)]
    return element === undefined ? 0: element;
  }

  function generateVelocity(pos) {
    function generateTargetParam() {
      return (game.rnd.integerInRange(0, 4)+3)/10;
    }
    var velocity;
    var seedX = generateTargetParam();
    var seedY = generateTargetParam();
    velocity = {
      x: (game.width*seedX - pos.x)*VELOCITY_PARAM,
      y: (game.height*seedY - pos.y)*VELOCITY_PARAM,
    }
    return velocity;
  }

  function convertScaleByVelocity(velocity) {
    return { x: velocity.x<0?-1:1, y: 1 };
  }

  function onMonsterAttack(monster) {
    console.log('attack by monster: '+monster.id+'!');
    destroyMonster(monster);
    audioPlayer.get('Ahhh2').play();
  }

  function checkMonsterCollision () {
    var tmpMonster = monsters;
    for (var i in tmpMonster) {
      var monster = tmpMonster[i];
      game.physics.arcade.overlap(monster.spr, tsai.spr, ()=> {onMonsterAttack(monster);}, null, monster);
    }
  }
  // ----- ENDfunction

  function updateRemainTime() {
    remainTimeText.text = TEXT_TIME+remainTime;
  }

  function updateScore() {
    scoreText.text = TEXT_SCORE+score;
  }

  function countDown() {
    if(remainTime > 0)
      remainTime--;
    updateRemainTime();
    if(remainTime <= 0) {
      gameOver();
    }
  }

  function gameOver() {
    isStart = false;
    audioPlayer.get('bgm').stop();
    tsai.stop();
    game.time.events.remove(countDownEvent);
    game.time.events.remove(createMonsterEvent);
    audioPlayer.get('gameover').play();
    game.state.start(
      "StageOver",
      true,
      false,
      {
        logoImagePath: "./media/yoda/ending.jpg",
        score: score,
        againState: "Yoda"
      }
    );
  }

  function maskBg(x, y) {
    if(x >= -MASK_WIDTH/2 && y >= -MASK_HEIGHT/2 && x <= bgPos.x+fBg.width+MASK_WIDTH/2 && y <= bgPos.y+fBg.height+MASK_HEIGHT/2) {
      var mask = game.make.bitmapData(MASK_WIDTH+x, MASK_HEIGHT+y);
      var maskRect = new Phaser.Rectangle(x, y, MASK_WIDTH, MASK_HEIGHT);
      mask.copyRect(fBg, maskRect, x, y);
      bmd.alphaMask(bBg, mask.canvas);
      var rect = new Phaser.Rectangle(x, y, MASK_WIDTH, MASK_HEIGHT);
      bg1BMD.copyRect(bmd.canvas, rect, x, y);
    }
  }

  Yoda.prototype = {
    preload: function() {
      game = this.game;
      game.load.image('planet_bg', 'media/yoda/planet.jpg');
      game.load.image('tsai_menu', 'media/yoda/tsai_menu.png');
      game.load.image('yoda_menu', 'media/yoda/yoda_menu.png');
      game.load.image('tsai_bg', 'media/yoda/tsai_bg.png');
      game.load.image('yoda_bg', 'media/yoda/yoda_bg.png');
      game.load.image('tsai_menu', 'media/yoda/tsai_menu.png');
      game.load.image('yoda_menu', 'media/yoda/yoda_menu.png');
      game.load.spritesheet('tsai', 'media/yoda/tsai.png', 150, 157, 2);
      game.load.spritesheet('yoda', 'media/yoda/yoda.png', 150, 157, 2);

      game.load.audio('bgm', ['media/yoda/yoda_bgm.wav']);
      game.load.audio('gamestart', ['media/yoda/gamestart.mp3']);
      game.load.audio('gameover', ['media/yoda/gameover.wav']);
      game.load.audio('Ahhh2', ['media/yoda/Ahhh2.wav']);
      game.load.audio('step', ['media/yoda/step.wav']);
      game.load.audio('meteor', ['media/yoda/meteor.wav']);
      game.load.audio('ufo', ['media/yoda/ufo.wav']);

      // ----- Monster
      game.load.image('ufo', 'media/yoda/ufo.png');
      game.load.image('et', 'media/yoda/et.png');
      game.load.image('meteor', 'media/yoda/meteor.png');

      game.load.image('explain1', 'media/yoda/explain1.jpg');
      game.load.image('explain2', 'media/yoda/explain2.jpg');
      game.load.image('explain3', 'media/yoda/explain3.jpg');
    },
    create: function() {
      characterMenu = {
        tsai: {
          characterName: 'tsai',
          name: 'tsai_menu',
          x: game.width*0.05,
          y: game.height*0.03,
          bg: [{
            name: 'yoda_bg',
            x: TR_OFFSET_X,
            y: TR_OFFSET_Y,
            scaleX: TR_SCALE_X,
            scaleY: TR_SCALE_Y
          },
          {
            name: 'tsai_bg',
            x: DIS_OFFSET_X,
            y: DIS_OFFSET_Y,
            scaleX: DIS_SCALE_X,
            scaleY: DIS_SCALE_Y
          }]
        },
        yoda: {
          characterName: 'yoda',
          name: 'yoda_menu',
          x: game.width*0.55,
          y: game.height*0.03,
          bg: [{
            name: 'tsai_bg',
            x: TR_OFFSET_X-0.01,
            y: TR_OFFSET_Y,
            scaleX: TR_SCALE_X,
            scaleY: TR_SCALE_Y
          },
          {
            name: 'yoda_bg',
            x: DIS_OFFSET_X,
            y: DIS_OFFSET_Y,
            scaleX: DIS_SCALE_X,
            scaleY: DIS_SCALE_Y
          }]
        }
      }
      game.add.sprite(0, 0, 'planet_bg');
      audioPlayer = createAudioPlayer(['bgm', 'gamestart', 'gameover', 'Ahhh2', 'step', 'meteor', 'ufo']);

      function preInitIntro() {
        var expTmp;

        for (var i = 0; i < expPics.length; i++) {
          expTmp = game.add.image(0, 0, expPics[i]);
          expTmp.inputEnabled = true;
          expTmp.picID = i;
          expTmp.events.onInputDown.add(function () {
            this.visible = false;
            this.destroy();
            if (this.picID === 0) {
              init();
            }
          }, expTmp);
        }
      }

      function preGameCountDown() {
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

      function init() {
        var menuSprs = [];
        function createMenuItem(menuItem) {
          var menuSpr = game.add.sprite(menuItem.x, menuItem.y, menuItem.name);
          menuSpr.alpha = 0.8;
          menuSpr.inputEnabled = true;
          menuSpr.events.onInputOver.add((menuSpr)=>{menuSpr.alpha = 1;}, this, null, menuSpr);
          menuSpr.events.onInputOut.add((menuSpr)=>{menuSpr.alpha = 0.9;}, this, null, menuSpr);
          menuSpr.events.onInputDown.add((arg1, arg2, menuItem)=>{
            selectedCharacter = characterMenu[menuItem.characterName];
            for(var i in menuSprs) {
              menuSprs[i].destroy();
            }
            preGameStart();
          }, this, null, menuItem);
          menuSprs.push(menuSpr);
        }
        for(var i in characterMenu) {
          var menuItem = characterMenu[i];
          createMenuItem(menuItem);
        }
      }

      function preGameStart() {
        preGameCountDown();
        remainTime = PLAY_TIME;
        var startAudio = audioPlayer.get('gamestart');
        startAudio.onStop.add(()=>{
          audioPlayer.get('bgm').loopFull();
          isStart = true;
          gameStart();
        }, this);
        initGame();
        startAudio.play();
      }

      function initGame() {

        bBg = game.cache.getImage(selectedCharacter.bg[0].name);
        fBg = game.cache.getImage(selectedCharacter.bg[1].name);
        bg1BMD = game.make.bitmapData(fBg.width, fBg.height);
        bg1BMD.draw(fBg, 0, 0);
        bg1BMD.update();

        bgPos = calculateBackgroundPosition(bBg, BG_OFFSET_X, BG_OFFSET_Y);
        game.add.sprite(bgPos.x, bgPos.y, bg1BMD);

        var w = bBg.width, h = bBg.height;

        bmd = game.make.bitmapData(w, h);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        tsai = createCharacter(selectedCharacter.characterName, bBg);

        mapDirty = createMapDirty(bBg);
      }

      function gameStart() {

        remainTimeText = game.add.text(game.width-200, 100, TEXT_TIME, fontStyle);
        scoreText = game.add.text(game.width-200, 150, TEXT_SCORE, fontStyle);

        countDownEvent = game.time.events.repeat(Phaser.Timer.SECOND, PLAY_TIME, countDown, this);

        /*var keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keyUp.onDown.add(()=>{tsai.moveUp();}, this);
        keyUp.onUp.add(()=>{tsai.stop();}, this);

        var keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keyDown.onDown.add(()=>{tsai.moveBottom();}, this);
        keyDown.onUp.add(()=>{tsai.stop();}, this);

        var keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keyLeft.onDown.add(()=>{tsai.moveLeft();}, this);
        keyLeft.onUp.add(()=>{tsai.stop();}, this);

        var keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keyRight.onDown.add(()=>{tsai.moveRight();}, this);
        keyRight.onUp.add(()=>{tsai.stop();}, this);*/

        // ----- create
        createMonsterEvent = game.time.events.loop(SPAWN_MONSTER_TIME, createMonster, this);
      }
      preInitIntro();
      //init();
    },
    update: function() {
      if(isStart) {
        var isMovingH = false, isMovingV = false;
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
          tsai.moveUp();
          isMovingV = true;
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
          tsai.moveBottom();
          isMovingV = true;
        }
        else if(!isMovingV)
          tsai.stopV();
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
          tsai.moveLeft();
          isMovingH = true;
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
          tsai.moveRight();
          isMovingH = true;
        }
        else if(!isMovingH)
          tsai.stopH();
        /*else
        tsai.stop();*/
        tsai.update();
        checkMonsterCollision();
      }
    },
    render: function() {
    }
  };

}());
