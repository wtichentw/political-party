SlapDeskGame = function(game) {};

(function() {

	// positions
	var kePosX = 100, kePosY = 300;
	var deskPosX = 20, deskPosY = 420, hitAreaPosX = 190, hitAreaPosY = 550;

	// hand, slap variables
	var slapAreaXPos = 180, slapAreaRangeOffset = 20, slapSecondAreaRangeOffset = 30;
	var isDelayRaiseHand = false;

	// objects variables
	var objectsKey = ["objA", "objB", "objC"];
	var objStartPosX = 1300, objStartPosY = 450, objEndPosX = 20;
	var oriObjMovePeriod = 2500, objMovePeriod = 2500, objMovePeriodOffset = 500;
	var currentObjects = [];

	// audio event
	var hitComboTime1 = 3, hitComboTime2 = 6, missComboTime1 = 2, missComboTime2 = 4;
	var hitComboCount = 0;
	var missComboCount = 0;

	// time and score
	var timePosX = 950, timePosY = 50, scorePosX = 950, scorePosY = 120;
	var time = 40;
	var score = 0;
	var scoreHit = [10, 15, 20], scoreMiss = -5;
	var showScorePosX = 185, showScorePosY = 200, showScorePosEndY = 100;

	// game over
	var isGameOver = false;

	SlapDeskGame.prototype = {

    preload: function() {
    	// load image
    	game.load.image("background", "media/slap_desk/bg.png");
    	game.load.image("desk", "media/slap_desk/desk.png");
    	game.load.image("keRaise", "media/slap_desk/ke_raise.png");
    	game.load.image("keSlap", "media/slap_desk/ke_slap.png");
    	game.load.image("objA", "media/slap_desk/object_a.png");
    	game.load.image("objB", "media/slap_desk/object_b.png");
    	game.load.image("objC", "media/slap_desk/object_c.png");
    	game.load.image("objDisappear", "media/slap_desk/object_disappear.png");
    	game.load.image("hitArea", "media/slap_desk/arrow.png");

    	// load audio
    	game.load.audio("bgMusic", "media/slap_desk/bgmusic.wav");
    	game.load.audio("soundSlap", "media/slap_desk/sound_slap.mp3");
    	game.load.audio("soundBlow", "media/slap_desk/sound_blow.wav");
    	game.load.audio("soundBeep", "media/slap_desk/sound_beep.mp3");

    	game.load.audio("soundHeng", "media/slap_desk/sound_heng.mp3");
    	game.load.audio("soundKanDiao", "media/slap_desk/sound_kandiao.mp3");
    	game.load.audio("soundMinDiaoKan", "media/slap_desk/sound_mingdiao_kan.mp3");
    	game.load.audio("soundTooth", "media/slap_desk/sound_tooth.mp3");
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
    	hitArea.alpha = 0.5;
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

    	// background music
    	bgMusic = game.add.audio("bgMusic");
    	bgMusic.play();

    	// timer for countdown and objects appearing
    	timer = game.time.create(false);
    	timer.loop(1000, updateCounter, this);
    	timer.start();
    },

    update: function() {

    	// refresh time and score
    	txtTime.destroy();
    	txtScore.destroy();
    	txtTime = game.add.text(timePosX, timePosY, "Time:  "+time, {font: "65px Arial", fill: "#ffffff", align: "center"});
    	txtScore = game.add.text(scorePosX, scorePosY, "Score: "+score, {font: "65px Arial", fill: "#ffffff", align: "center"});

    	if (isGameOver) return;

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
    	
    	

    }

};

function slap() {
	isDelayRaiseHand = true;

    keLayer.removeAll();
    keLayer.add(game.add.sprite(kePosX, kePosY, "keSlap"));

	for (var i in currentObjects) { // hit
		var posX = currentObjects[i].position.x;
		if (posX > slapAreaXPos-slapAreaRangeOffset-slapSecondAreaRangeOffset &&
			posX < slapAreaXPos+slapAreaRangeOffset+slapSecondAreaRangeOffset) {

			// blow sound
			soundBlow = game.add.audio("soundBlow");
			soundBlow.play();

			// count hit combo, show text and play sound
			hitComboCount++;
			missComboCount = 0;
			if (hitComboCount >= hitComboTime1) {
				if (hitComboCount ==  hitComboTime1) {
					console.log("Hit Combo: "+hitComboTime1+"(special)");
					soundKanDiao = game.add.audio("soundKanDiao");
					soundKanDiao.play();
				} else if (hitComboCount == hitComboTime2) {
					console.log("Hit Combo: "+hitComboTime2+"(special)");
					soundMinDiaoKan = game.add.audio("soundMinDiaoKan");
					soundMinDiaoKan.play();
				} else {
					console.log("Hit Combo: "+hitComboCount);
				}
			}

			// hit perfect -----
			if (posX > slapAreaXPos-slapAreaRangeOffset && posX < slapAreaXPos+slapAreaRangeOffset) {
				console.log("Slap Hit Perfect");
			} else {
				console.log("Slap Hit Good");
			}

			// hit good -----
			// add score
			var hitScore;
			for (var j in objectsKey) { // find correspond score
				if (objectsKey[j] == currentObjects[i].key) {
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
	soundSlap = game.add.audio("soundSlap");
	soundSlap.play();
	hitComboCount = 0;
	missComboCount++

	if (missComboCount >= missComboTime1) {
		if (missComboCount == missComboTime1) {
			soundHeng = game.add.audio("soundHeng");
			soundHeng.play();
		} else if (missComboCount == missComboTime2) {
			soundTooth = game.add.audio("soundTooth");
			soundTooth.play();
		}
	}

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
	if (!isGameOver) {
		// add objects
		obj = generateObject();
		currentObjects.push(obj);
	}

	// time counter
	time--;
	if (time <= 5 && time > 0) {
		soundBeep = game.add.audio("soundBeep");
    	soundBeep.play();
	}

	if (time <= 0) {
		time = 0;

		// End, Game over here ---------
		isGameOver = true;
		bgMusic.stop();
		for (var i in currentObjects) {
			currentObjects[i].destroy();
		}
	}
}

function generateObject() {
	var randNum = game.rnd.integerInRange(0, objectsKey.length-1);
	var obj = game.add.sprite(objStartPosX, objStartPosY, objectsKey[randNum]); // random a object

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