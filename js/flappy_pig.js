var FlappyPig = function (game) {};

(function () {

  var bg, character;
  var pipes = [], pipesToDestroy = [];
  var pillarCount = 0;
  var scoreText;
  var uiGroup;
  var spawnPipeEvent;

  const PillarPos = {
    Bottom: 0,
    Top: 1
  };

  const PIPE_HEIGHT = {
    FROM: 0,
    TO: 4
  };

  const VELOCITY_SCALE = 1.5;

  const MOVE_VELOCITY = -80*VELOCITY_SCALE;
  const PIPE_SPAWN_TIME = 1.4*VELOCITY_SCALE;

  function spawnCharacter() {
    var spr = game.add.sprite(200, 200, 'character');
    game.physics.enable(spr, Phaser.Physics.ARCADE);
    const scale = 2;
    spr.scale.setTo(scale, scale);
    spr.body.collideWorldBounds = true;
    spr.body.gravity.set(0, 480);
    spr.body.setSize(spr.body.width*.34*scale, spr.body.height*.35*scale, spr.body.width*.2*scale, 0);
    var character = {
      spr: spr,
      isAlive: true,
      jump: () => {
        spr.body.velocity.setTo(0, -120);
        spr.body.angularVelocity = -30;
      },
      falling: () => {
        if(spr.body.velocity.y > 0) {
          if(spr.body.rotation < 0) {
            spr.body.angularVelocity += 12;
          }
        }
        else {
          spr.body.angularVelocity = 0; 
        }
        if(spr.body.rotation < -30)
          spr.body.rotation = -30;
        else if(spr.body.rotation  > 0)
          spr.body.rotation = 0;
      },
      update: () => {
        if(spr.body.rotation < -30)
          spr.body.rotation = -30;
      },
      kill: () => {
        character.isAlive = false;
        spr.body.angularVelocity = 0;
        spr.body.velocity.setTo(0, 0);
        spr.body.immovable = true;
        spr.scale.setTo(2,-2);
        spr.body.setSize(spr.body.width*.7, spr.body.height*.35, 0, -spr.body.height);
      }
    };
    return character;
  }

  /*
   * @params topBottom: true: top
   */
  function spawnPipe(x, topBottom, segment) {
    var pipe = game.add.sprite(200, 0, 'pipe');
    const scale = 2;
    pipe.scale.setTo(scale, scale);
    game.physics.enable(pipe, Phaser.Physics.ARCADE);
    pipe.body.immovable = true;
    var height = pipe.height/scale;
    pipe.x = x;
    if(topBottom === PillarPos.Top) {
      pipe.angle = 180;
      pipe.pivot.x = pipe.width/scale;
      pipe.pivot.y = pipe.height/scale + (segment)*height/2;
      pipe.body.setSize(pipe.body.width/scale, pipe.body.height/scale+segment*height/2, -pipe.body.width, -pipe.body.height-segment*height);
    }
    else if(topBottom === PillarPos.Bottom) {
      pipe.y = game.height - (segment+2)*pipe.height/scale;
      pipe.body.setSize(pipe.body.width/scale, pipe.body.height/scale+segment*height/2, 0, 0);
    }
    for(var i = 0; i < segment;i++) {
      var pipeBody = game.make.sprite(0, height+i*height/2, 'pipe-body');
      //game.physics.enable(pipeBody, Phaser.Physics.ARCADE);
      pipeBody.animations.add('body', [1], 0, 1);
      pipeBody.play('body', 0, 1);
      pipe.addChild(pipeBody);
    }
    return pipe;
  }

  function generatePipeHeight(offset, to) {
    offset = offset || PIPE_HEIGHT.FROM;
    to = to || PIPE_HEIGHT.TO;
    return parseInt(Math.round(Math.random()*to)+offset);
  }

  function spawnPipePair(x) {
    var height = generatePipeHeight();
    var topPillar = spawnPipe(x, PillarPos.Top, height);
    pipes.push(topPillar);
    var bottomPillar = spawnPipe(x, PillarPos.Bottom, generatePipeHeight(undefined, PIPE_HEIGHT.TO*2-height));
    pipes.push(bottomPillar);
    topPillar.body.velocity.setTo(MOVE_VELOCITY, 0);
    bottomPillar.body.velocity.setTo(MOVE_VELOCITY, 0);
  }

  function spawnPipePairAuto() {
    spawnPipePair(game.width);
  }

  function stopPipes(pipes) {
    var tmpPipes = pipes;
    for(var i in tmpPipes) {
      var pipe = tmpPipes[i];
      pipe.body.velocity.setTo(0, 0);
    }
  }

  function lostGame(obj1, obj2) {
    game.time.events.remove(spawnPipeEvent);
    character.kill();
    stopPipes(pipes);
    stopPipes(pipesToDestroy);
  }

  FlappyPig.prototype = {
    preload: function() {
      game = this.game;
      game.load.image('bg', 'media/flappy_pig/bg.png');
      game.load.spritesheet('character', 'media/flappy_pig/character.png', 76, 42, 1);
      game.load.spritesheet('pipe', 'media/flappy_pig/pillar.png', 29, 51, 1);
      game.load.spritesheet('pipe-body', 'media/flappy_pig/pillar.png', 29, 26, 2);
    },
    create: function() {
      bg = game.add.tileSprite(0, 0, 2677, 1500, 'bg');
      bg.scale.setTo(0.5, 0.5);
      game.physics.startSystem(Phaser.Physics.ARCADE);
      //TODO create gui
      character = spawnCharacter();
      const preSpawnedCount = 3;
      for(var i = 0; i < preSpawnedCount; i++) {
        spawnPipePair(game.width-(preSpawnedCount-i)*270+200);
      }
      spawnPipeEvent = game.time.events.loop(Phaser.Timer.SECOND * PIPE_SPAWN_TIME, spawnPipePairAuto, this);
      uiGroup = game.add.group();
      scoreText = game.add.text(game.width/2, 150, '', {font: 'bold 44px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'});
      scoreText.setShadow(3, 3, 'rgba(0,0,0,0.3)', 2);
      uiGroup.add(scoreText);
    },
    update: function() {
      if(character.isAlive) {
        var tmpPipes = pipes;
        for(var i in tmpPipes) {
          var pipe = tmpPipes[i];
          game.physics.arcade.collide(character.spr, pipe, lostGame, null, this);
          if(pipe.body.x < 200-pipe.width) {
            pipes.splice(pipes.indexOf(pipe), 1);
            pillarCount++;
            scoreText.text = (pillarCount/2).toString();
            pipesToDestroy.push(pipe);
            game.world.bringToTop(uiGroup);
          }
        }
        var tmpPipes = pipesToDestroy;
        for(var i in tmpPipes) {
          var pipe = tmpPipes[i];
          if(pipe.body.x < -pipe.width) {
            pipe.destroy();
            pipesToDestroy.splice(pipesToDestroy.indexOf(pipe), 1);
          }
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
          character.jump();
        }
        else {
          character.falling();
        }
        bg.tilePosition.x -= 0.5;
      }
    },
    render: function() {
      //game.debug.body(character.spr, 'rgba(255,0,0,1)', false);
    }
  };

}());