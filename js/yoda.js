var Yoda = function (game) {};

(function () {

  const PLAY_TIME = 60;

  const UpKey = Phaser.Keyboard.UP;
  const DownKey = Phaser.Keyboard.DOWN;
  const LeftKey = Phaser.Keyboard.LEFT;
  const RightKey = Phaser.Keyboard.RIGHT;
  const Velocity = 200;

  var tsai;
  var moveEvent;
  var brush;
  var mapDirty;
  var remainTime = 60, score;
  var remainTimeText, scoreText;

  var fontStyle = {font: 'bold 44px Arial', fill: '#fff', boundsAlignH: 'left', boundsAlignV: 'middle'};

  const TR_OFFSET_X = -0.307, TR_OFFSET_Y = -0.187, TR_SCALE_X = 0.805, TR_SCALE_Y = 0.695;
  const DIS_OFFSET_X = 0, DIS_OFFSET_Y = 0.1, DIS_SCALE_X = 0.8, DIS_SCALE_Y = 0.7;
  const TEXT_SCORE = 'Score:', TEXT_TIME = 'Time:'

  function createCharacter(name, bSpr, fSpr, bmd) {
    var character = {};
    character.spr = game.add.sprite(game.width*0.2, game.height*0.2, name);
    character.spr.animations.add('left', [1], 1, false);
    character.spr.animations.add('right', [0], 1, false);
    game.physics.enable(character.spr, Phaser.Physics.ARCADE);
    character.spr.body.collideWorldBounds = true;
    character.velocity = Velocity;
    character.moveLeft = function() {
      character.isMoving = true;
      character.turnLeft();
      character.spr.body.velocity.setTo(-character.velocity, character.spr.body.velocity.y);
    };
    character.moveRight = function() {
      character.isMoving = true;
      character.turnRight();
      character.spr.body.velocity.setTo(character.velocity, character.spr.body.velocity.y);
    };
    character.moveUp = function() {
      character.isMoving = true;
      character.spr.body.velocity.setTo(character.spr.body.velocity.x, -character.velocity);
    };
    character.moveBottom = function() {
      character.isMoving = true;
      character.spr.body.velocity.setTo(character.spr.body.velocity.x, character.velocity);
    };
    character.stop = function() {
      character.isMoving = false;
      character.spr.body.velocity.setTo(0, 0);
    };
    character.mudFloor = function() {
      var x = tsai.spr.x-tsai.spr.width*2.2;
      var y = tsai.spr.y-tsai.spr.height/2;
      brush.x = x;
      brush.y = y;
      var dirtyY = tsai.spr.y+tsai.spr.height;
      mapDirty.setMapDirty(tsai.spr.x-fSpr.x, dirtyY-fSpr.y);
      bmd.alphaMask(bSpr, brush);
      score = mapDirty.getProgress();
      updateScore();
    };
    character.turnLeft = function() {
      character.spr.animations.play('left');
    };
    character.turnRight = function() {
      character.spr.animations.play('right');
    };
    character.update = function() {
      if(character.isMoving)
        character.mudFloor();
    };

    return character;
  }

  function createMapDirty(spr) {
    var mapDirty = {}
    var total = 0;
    for(var i = 0; i < spr.width/brush.width; i++) {
      for(var j = 0; j < spr.height/brush.height; j++) {
        mapDirty[i+';'+j] = 0;
        total++;
      }
    }
    var mapDirtyMgr = {
      mapDirty: mapDirty
    };
    mapDirtyMgr.setMapDirty = function(x, y) {
      var dirtyX = parseInt(x/brush.width);
      var dirtyY = parseInt(y/brush.height);
      var dirtyKey = dirtyX+';'+dirtyY;
      console.log(dirtyKey)
      if(dirtyKey in this.mapDirty)
        this.mapDirty[dirtyKey] = 1;
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

  function createMagzine(name, offsetX, offsetY, scalingX, scalingY) {
    var spr = game.add.sprite(0, 0, name);
    var bgScale = Math.min(game.width/spr.width, game.height/spr.height);
    spr.x = (game.width-spr.width)/2+offsetX*game.width;
    spr.y = (game.height-spr.height)/2+offsetY*game.height;
    spr.scale.setTo(bgScale*scalingX, bgScale*scalingY);
    return spr;
  }

  function updateRemainTime() {
    remainTimeText.text = TEXT_TIME+remainTime;
  }

  function updateScore() {
    scoreText.text = TEXT_SCORE+score;
  }

  function countDown() {
    remainTime--;
    updateRemainTime();
    if(remainTime <= 0) {
      gameOver();
    }
  }

  function gameOver() {
    //TODO game over
    console.log('game over')
  }

  Yoda.prototype = {
    preload: function() {
      game = this.game;
      game.load.image('planet_bg', 'media/yoda/planet.jpg');
      game.load.image('brush', 'media/yoda/brush.png');
      game.load.image('tsai_bg', 'media/yoda/tsai_bg.png');
      game.load.image('yoda_bg', 'media/yoda/yoda_bg.png');
      game.load.image('tsai_menu', 'media/yoda/tsai_menu.png');
      game.load.image('yoda_menu', 'media/yoda/yoda_menu.png');
      game.load.spritesheet('tsai', 'media/yoda/tsai.png', 150, 157, 2);
      game.load.spritesheet('yoda', 'media/yoda/yoda.png', 150, 157, 2);
      game.load.audio('bgm', ['media/yoda/yoda_bgm.wav']);
    },
    create: function() {
      game.add.sprite(0, 0, 'planet_bg');
      var music = game.add.audio('bgm');
      music.loopFull();

      brush = game.make.sprite(0, 0, 'brush');
      brush.scale.setTo(2, 1);
      brush.anchor.set(0.5, 0.5);

      var yodaSpr = createMagzine('yoda_bg', TR_OFFSET_X, TR_OFFSET_Y, TR_SCALE_X, TR_SCALE_Y);
      yodaSpr.destroy();
      var sprite = createMagzine('tsai_bg', DIS_OFFSET_X, DIS_OFFSET_Y, DIS_SCALE_X, DIS_SCALE_Y);

      bmd = game.make.bitmapData(sprite.width, sprite.height);
      game.add.sprite(sprite.x, sprite.y, bmd);

      game.physics.startSystem(Phaser.Physics.ARCADE);
      tsai = createCharacter('tsai', yodaSpr, sprite, bmd);

      mapDirty = createMapDirty(sprite, brush);
      console.log(mapDirty);

      remainTimeText = game.add.text(game.width-200, 100, TEXT_TIME, fontStyle);
      scoreText = game.add.text(game.width-200, 150, TEXT_SCORE, fontStyle);

      game.time.events.repeat(Phaser.Timer.SECOND, PLAY_TIME, countDown, this);

      var keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
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
      keyRight.onUp.add(()=>{tsai.stop();}, this);
    },
    update: function() {
      tsai.update();
    },
    render: function() {
    }
  };

}());