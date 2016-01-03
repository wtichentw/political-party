var Dolphin = function(game) {};

(function () {

var cars = [];
var carColors = [0x000000, 0xFFFFFF];
var carTurnSpeed = 200;

var carGroup;
var obstacleGroup;

var obstacleSpeed = 300;
var obstacleDelay = 1500;

Dolphin.prototype = {
	preload: function(){
          game.load.image("road", "media/dolphin/sea.png");
          game.load.image("car", "media/dolphin/dol.png");
          game.load.image("obstacle", "media/dolphin/fac.png");
					game.load.image("ins","media/dolphin/ins.png");
					game.load.image("ins1","media/dolphin/ins1.png");
	},
  	create: function(){

          game.add.image(0, 0, "road");
          game.physics.startSystem(Phaser.Physics.ARCADE);
          carGroup = game.add.group();
          obstacleGroup = game.add.group();
          for(var i = 0; i < 2; i++){
               cars[i] = game.add.sprite(0, game.height - 40, "car");
               cars[i].positions = [game.width * (i * 4 + 1) / 8, game.width * (i * 4 + 3) / 8];
               cars[i].anchor.set(0.5);
               cars[i].tint = carColors[i];
               cars[i].canMove = true;
               cars[i].side = i;
               cars[i].x = cars[i].positions[cars[i].side];
               game.physics.enable(cars[i], Phaser.Physics.ARCADE);
               cars[i].body.allowRotation = false;
               cars[i].body.moves = false;
               carGroup.add(cars[i]);
          }
          //game.input.onDown.add(moveCar);
          game.time.events.loop(obstacleDelay, function(){
               var obstacle = new Obstacle(game);
               game.add.existing(obstacle);
               obstacleGroup.add(obstacle);
          });
								img1 = game.add.image(450,200,"ins");
								game.add.tween(img1).to({alpha: 0}, 1000, "Linear", true,1500);
								img2 = game.add.image(450,200,"ins1");
								game.add.tween(img2).to({alpha: 0}, 1000, "Linear", true, 1000);

	},
     update: function(){
          game.physics.arcade.collide(carGroup, obstacleGroup, function(){
          game.state.start("Dolphin");

          });

					if (game.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {
						moveCar({
							position: {
								x: 0
							}
						});
					}
					if (game.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {
						moveCar({
							position: {
								x: gameWidth - 1
							}
						});
					}
     }
};

function moveCar(e){
	   console.log(e.position.x);
     var carToMove = Math.floor(e.position.x / (game.width / 2));
     if(cars[carToMove].canMove){
          cars[carToMove].canMove = false;
          cars[carToMove].side = 1 - cars[carToMove].side;
          var moveTween = game.add.tween(cars[carToMove]).to({
               x: cars[carToMove].positions[cars[carToMove].side],
          }, carTurnSpeed, Phaser.Easing.Linear.None, true);
          moveTween.onComplete.add(function(){
               cars[carToMove].canMove = true;
          });
     }
}

Obstacle = function (game) {
  var position = game.rnd.between(0, 5);
	Phaser.Sprite.call(this, game, game.width * (position * 2 + 1) / 8, -20, "obstacle");
	game.physics.enable(this, Phaser.Physics.ARCADE);
     this.anchor.set(0.5);
     this.tint = carColors[Math.floor(position / 2)];
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;
Obstacle.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height){
		this.destroy();
	}
};

}());
