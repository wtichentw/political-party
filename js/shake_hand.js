var ShakeHandGame = function (game) {};

(function () {
	// ---------- Game
	var second = 10, timesCur = 30, timesMax = 100;
	var screenWidth, screenHeight;
	var secondText, timesText, promptText;
	var shakeHandSprite;
	var barColors = [], barGraphics, barColorsGap = 80, barGraphicsHeight = 2;
	var keyPairsSwitch = 0, keyPairsIdx = 1, keyPairsRndGap = 5, keysRect;
	var keyPairs = [
		[
			{
				text: "Left",
				code: Phaser.KeyCode.LEFT
			},
			{
				text: "Right",
				code: Phaser.KeyCode.RIGHT
			}
		],
		[
			{
				text: "Up",
				code: Phaser.KeyCode.UP
			},
			{
				text: "Down",
				code: Phaser.KeyCode.DOWN
			}
		],
		[
			{
				text: "A",
				code: Phaser.KeyCode.A
			},
			{
				text: "S",
				code: Phaser.KeyCode.S
			}
		],
		[
			{
				text: "T",
				code: Phaser.KeyCode.T
			},
			{
				text: "Y",
				code: Phaser.KeyCode.Y
			}
		]
	];
	ShakeHandGame.prototype = {
		preload: function () {
			game = this.game;

			game.load.image("background", "media/shake_hand/bg.png");
			game.load.spritesheet("shakeHandSprite", "media/shake_hand/shake_hand_628x417.png", 628, 417, 4);
		},
		create: function () {
			screenHeight = game.height;
			screenWidth  = game.width;
			// ----- Config
			second = 30;
			timesCur = timesMax;
			keyPairsIdx = game.rnd.integerInRange(0, keyPairs.length - 1);

			game.stage.backgroundColor = "#FFFFFF";
			game.add.image(0, 0, "background");

			changeKPTimer = game.time.create(false);
			changeKPTimer.add(Phaser.Timer.SECOND * keyPairsRndGap, changeKeyPair, this);
			restSecTimer = game.time.create(false);
			restSecTimer.add(Phaser.Timer.SECOND * second, loseGame, this);

			changeKPTimer.start();
			restSecTimer.start();

			//keysRect = new Phaser.Rectangle(screenWidth - 130, 120, 70, 70);

			promptText	= game.add.text(screenWidth - 130, 120, keyPairs[keyPairsIdx][keyPairsSwitch].text, {font: "40px Arial", fill: "#FFFFFF"});
			//timesText 	= game.add.text(50, 30, timesCur, {font: "28px Arial", fill: "#FFFFFF"});
			secondText 	= game.add.text(50, 90, second, {font: "28px Arial", fill: "#FFFFFF"});

			shakeHandSprite = game.add.sprite(screenWidth/2 - 628/2, 150, "shakeHandSprite");
			shakeHandSprite.animations.add("shake");
			shakeHandSprite.animations.play("shake", 3, true);

			barGraphics = game.add.graphics(950, 420);
			for (var i = 0; i < barColorsGap; i++) {
				barColors[i] = Phaser.Color.interpolateColor(0x00FF00, 0xFFFF00, barColorsGap, i);
				barColors[i+barColorsGap] = Phaser.Color.interpolateColor(0xFFFF00, 0xFF0000, barColorsGap, i);
			}

		},
		update: function () {

			barGraphics.clear();
			for (var i = 0; i < (barColorsGap*timesCur/timesMax); i++) {
	      	barGraphics.beginFill(barColors[i], 1);
		      barGraphics.drawRect(0, i*barGraphicsHeight*-1, 50, barGraphicsHeight);
		      barGraphics.endFill();
			}

			game.input.keyboard.onDownCallback = function (e) {

				if (e.keyCode == keyPairs[keyPairsIdx][keyPairsSwitch].code) {
					keyPairsSwitch = 1 - keyPairsSwitch;
					timesCur--;

					if (timesCur == 0) winGame();

				} else {
					timesCur++;
				}

			}

			updateText();
		}
	};

	function changeKeyPair () {
		console.log('Change KP');
		keyPairsIdx = game.rnd.integerInRange(0, keyPairs.length - 1);
		keyPairsRndGap = game.rnd.integerInRange(3, 5);
		changeKPTimer.add(Phaser.Timer.SECOND * keyPairsRndGap, changeKeyPair, this);
		updateText();
	}

	function updateText () {
		promptText.setText(keyPairs[keyPairsIdx][keyPairsSwitch].text);
		//timesText.setText(timesCur);
		secondText.setText((restSecTimer.duration/1000).toFixed(2));
	}

	function winGame () {
		alert('Win wIn wiN');
		game.state.start("MainMenu");
		return;
	}

	function loseGame () {
		alert('Oh no ! you lose');
		game.state.start("MainMenu");
		return;
	}

	function updateMic () {
		for (var i = 0; i < mics.length; i++) {
			if (game.rnd.integerInRange(0, 1) && (mics[i].y+3) <= micMaxY) {
				mics[i].y += 3;
			}
			else if (mics[i].y-3 >= micMinY) {
				mics[i].y -= 3;
			}
			else {
				mics[i].y += 3;
			}
		}
	}
})();
