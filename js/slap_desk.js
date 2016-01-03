SlapDeskGame = function(game) {};

(function() {

	// positions
	var kePosX = 100, kePosY = 300;
	var deskPosX = 20, deskPosY = 420, hitAreaPosX = 180, hitAreaPosY = 500;

	// hand, slap variables
	var slapAreaXPos = 180, slapAreaRangeOffset = 40;
	var isDelayRaiseHand = false;

	// objects variables
	var objects = ["objA", "objB", "objC"];
	var objStartPosX = 1300, objStartPosY = 450, objEndPosX = 20;
	var oriObjMovePeriod = 2500, objMovePeriod = 2500, objMovePeriodOffset = 500;
	var currentObjects = [];

	// time and score
	var timePosX = 950, timePosY = 50, scorePosX = 950, scorePosY = 120;
	var time = 40;
	var score = 0;
	var scoreHit = [10, 10, 10], scoreMiss = -5;
	var showScorePosX = 185, showScorePosY = 200, showScorePosEndY = 100;

	SlapDeskGame.prototype = {

    preload: function() {
    	game.load.image("background", "media/slap_desk/bg.png");
    	game.load.image("desk", "media/slap_desk/desk.png");
    	game.load.image("keRaise", "media/slap_desk/ke_raise.png");
    	game.load.image("keSlap", "media/slap_desk/ke_slap.png");
    	game.load.image("objA", "media/slap_desk/object_a.png");
    	game.load.image("objB", "media/slap_desk/object_b.png");
    	game.load.image("objC", "media/slap_desk/object_c.png");
    	game.load.image("objDisappear", "media/slap_desk/object_disappear.png");
    	game.load.image("hitArea", "media/slap_desk/object_disappear.png"); // todo: change image
    },

    create: function() {
    	// bg layer
    	bg = game.add.sprite(0, 0, "background");
    	bgLayer = game.add.group();
    	bgLayer.add(bg);
    	bgLayer.z = 0;

    	// keWenZhe layer
    	keWenZhe = game.add.sprite(kePosX, kePosY, "keRaise");
    	keLayer = game.add.group();
    	keLayer.add(keWenZhe);
    	keLayer.z = 1;

    	// objects layer
    	objectsLayer = game.add.group();
    	objectsLayer.z = 2;

    	// desk layer
    	desk = game.add.sprite(deskPosX, deskPosY, "desk");
    	hitArea = game.add.sprite(hitAreaPosX, hitAreaPosY, "hitArea");
    	deskLayer = game.add.group();
    	deskLayer.add(desk);
    	deskLayer.add(hitArea);
    	deskLayer.z = 3;

    	// time and score layer
    	txtTime = game.add.text(timePosX, timePosY, "Time:  "+time, {font: "65px Arial", fill: "#ffffff", align: "center"});
    	txtScore = game.add.text(scorePosX, scorePosY, "Score: "+score, {font: "65px Arial", fill: "#ffffff", align: "center"});
    	timeScoreLayer = game.add.group();
    	timeScoreLayer.add(txtTime);
    	timeScoreLayer.add(txtScore);
    	timeScoreLayer.z = 4;

    	// timer for countdown and objects appearing
    	timer = game.time.create(false);
    	timer.loop(1000, updateCounter, this);
    	timer.start();
    },

    update: function() {

    	// check keyboard spacebar up
    	game.input.keyboard.onUpCallback = function(e) {
    		if (e.keyCode == Phaser.KeyCode.SPACEBAR) {
    			isDelayRaiseHand = false;
    		}
    	}

    	// space to slap
    	if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
    		if (!isDelayRaiseHand) slap();
    	}
    	
    	// refresh time and score
    	txtTime.destroy();
    	txtScore.destroy();
    	txtTime = game.add.text(timePosX, timePosY, "Time:  "+time, {font: "65px Arial", fill: "#ffffff", align: "center"});
    	txtScore = game.add.text(scorePosX, scorePosY, "Score: "+score, {font: "65px Arial", fill: "#ffffff", align: "center"});

    }

};

function slap() {
	isDelayRaiseHand = true;

    keLayer.removeAll();
    keLayer.add(game.add.sprite(kePosX, kePosY, "keSlap"));

	for (var i in currentObjects) {
		var posX = currentObjects[i].position.x;
		if (posX > slapAreaXPos-slapAreaRangeOffset && posX < slapAreaXPos+slapAreaRangeOffset) {
			console.log("Slap Hit");

			// add score
			var hitScore;
			for (j in objects) { // find correspond score
				if (objects[j] == currentObjects[i].key) {
					hitScore = scoreHit[j];
					break;
				}
			}
			adjustScore(hitScore);

			// destroy object and generate splash
			var splash = game.add.sprite(currentObjects[i].position.x, currentObjects[i].position.y, "objDisappear");
			game.add.tween(splash).to({alpha: 0}, 500, "Linear", true);
			currentObjects[i].destroy();

			game.time.events.add(100, raiseHand, this); // delay to raise hand
			return;
		}
	}

	// Slap Miss
	console.log("Slap Miss");
	// minus score
	adjustScore(scoreMiss);

	game.time.events.add(100, raiseHand, this); // delay to raise hand
}

function raiseHand() {
 	keLayer.removeAll();
    keLayer.add(game.add.sprite(kePosX, kePosY, "keRaise"));
}

function adjustScore(theScore) {
	if (score+theScore >= 0)
		score += theScore;
	else
		score = 0;

	// show the score
	var txtShowScore = game.add.text(showScorePosX, showScorePosY, theScore>0 ? "+"+theScore : theScore, {font: "65px Arial", fill: "#ff0000", align: "center"});
	game.add.tween(txtShowScore).to({alpha: 0, y: showScorePosEndY}, 1000, "Linear", true);
	timeScoreLayer.add(txtShowScore);
}

function updateCounter() {
	// add objects
	obj = generateObject();
	currentObjects.push(obj);
	
	// time counter
	time--;
	if (time <= 0) {
		time = 0;

		// End
	}
}

function generateObject() {
	var randNum = game.rnd.integerInRange(0, objects.length-1);
	var obj = game.add.sprite(objStartPosX, objStartPosY, objects[randNum]); // random a object

	// object move
	// random objects move period(sec)
	objMovePeriod = oriObjMovePeriod+game.rnd.integerInRange(-objMovePeriodOffset, objMovePeriodOffset);
	if (time == 25) { // speed up, score up
		console.log("Time == 25, Speed up");
		oriObjMovePeriod -= objMovePeriodOffset;
		for (var i in scoreHit) scoreHit[i] += 5; // improve score
	}
	if (time == 10) { // speed up, scroe up
		console.log("Time == 10, Speed up");
		oriObjMovePeriod -= objMovePeriodOffset;
		for (var i in scoreHit) scoreHit[i] += 5; // improve score
	}

	objTween = game.add.tween(obj).to({x: objEndPosX}, objMovePeriod);
	objectsLayer.add(obj);
	objTween.onComplete.add(onComplete, this, obj);
	objTween.start();
	return obj;
}

function onComplete(obj) {
	destroyTween = game.add.tween(obj).to({alpha: 0}, 500, "Linear", true); // fade out
}


})();