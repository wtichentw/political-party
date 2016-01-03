var ShakeHandGame = function (game) {};

(function () {
	// ---------- Game
	var dialogLayer;
	var second = 10, timesCur = 30, timesMax = 100;
	var screenWidth, screenHeight;
	var secondText, timesText, promptText, dialogText;
	var dialogue1, dialogue2;
	var shakeHandSprite;
	var barColors = [], barGraphics, barColorsStep = 80, barGraphicsHeight = 2;
	var zhouDialogues = [
		'馬總統！\n你有提到中華民國嗎！',
		'馬總統，你說謊！',
		'張主任！一個中國是不是一中各表！'
	];
	var zhou, zhouInterval = 10, zhouDir = 1, zhouStep = 2, zhouPosIdx = 0, zhouPos = [], isZhouAsking = false;
	var keyPairsSwitch = 0, keyPairsIdx = 1, keyPairsRndGap = 5, keysRect;
	var keyPairs = [
		[
			{
				text: '◀',
				code: Phaser.KeyCode.LEFT
			},
			{
				text: '▶',
				code: Phaser.KeyCode.RIGHT
			}
		],
		[
			{
				text: '▲',
				code: Phaser.KeyCode.UP
			},
			{
				text: '▼',
				code: Phaser.KeyCode.DOWN
			}
		],
		[
			{
				text: 'A',
				code: Phaser.KeyCode.A
			},
			{
				text: 'S',
				code: Phaser.KeyCode.S
			}
		],
		[
			{
				text: 'T',
				code: Phaser.KeyCode.T
			},
			{
				text: 'Y',
				code: Phaser.KeyCode.Y
			}
		]
	];
	ShakeHandGame.prototype = {
		preload: function () {
			game = this.game;

			game.load.image('background', 'media/shake_hand/bg.png');
			game.load.image('zhou', 'media/shake_hand/zhou.png');
			game.load.image('dialogue1', 'media/shake_hand/dialogue1.png');
			game.load.spritesheet('shakeHandSprite', 'media/shake_hand/shake_hand_628x417.png', 628, 417, 4);
		},
		create: function () {
			screenHeight = game.height;
			screenWidth  = game.width;

			setZhouPos();
			second = 30;
			timesCur = timesMax;
			keyPairsIdx = game.rnd.integerInRange(0, keyPairs.length - 1);

			game.stage.backgroundColor = '#FFFFFF';
			game.add.image(0, 0, 'background');
			dialogue1 = game.add.image(0, 100, 'dialogue1');
			zhou = game.add.image(zhouPos[zhouPosIdx].start.x, zhouPos[zhouPosIdx].start.y , 'zhou');

			dialogue1.scale.setTo(1.2);
			//dialogue2.scale.setTo(1);


			//changeKPTimer = game.time.create(false);
			restSecTimer = game.time.create(false);
			restSecTimer.add(Phaser.Timer.SECOND * second, loseGame, this);
			game.time.events.loop(Phaser.Timer.SECOND * keyPairsRndGap, changeKeyPair, this);
			game.time.events.loop(Phaser.Timer.SECOND * zhouInterval, showZhou, this);
			//changeKPTimer.start();
			restSecTimer.start();

			//keysRect = new Phaser.Rectangle(screenWidth - 130, 120, 70, 70);

			promptText	= game.add.text(screenWidth - 130, 120, keyPairs[keyPairsIdx][keyPairsSwitch].text, {font: '40px Arial', fill: '#FFFFFF'});
			//timesText 	= game.add.text(50, 30, timesCur, {font: '28px Arial', fill: '#FFFFFF'});
			secondText 	= game.add.text(50, 90, second, {font: '28px Arial', fill: '#FFFFFF'});
			dialogText = game.add.text(165, 260, zhouDialogues[1], {font : '24px PingFang-UltraLight', fill: '#000000'});

			dialogLayer = game.add.group();
			dialogLayer.add(dialogue1);
			dialogLayer.add(dialogText);
			dialogLayer.alpha = 0;

			shakeHandSprite = game.add.sprite(screenWidth/2 - 628/2, 150, 'shakeHandSprite');
			shakeHandSprite.animations.add('shake');
			shakeHandSprite.animations.play('shake', 3, true);

			barGraphics = game.add.graphics(950, 420);
			for (var i = 0; i < barColorsStep; i++) {
				barColors[i] = Phaser.Color.interpolateColor(0x00FF00, 0xFFFF00, barColorsStep, i);
				barColors[i+barColorsStep] = Phaser.Color.interpolateColor(0xFFFF00, 0xFF0000, barColorsStep, i);
			}

		},
		update: function () {
			if (isZhouAsking) {
				if (dialogLayer.alpha < 1) dialogLayer.alpha += 0.05;

				zhouPosObj = zhouPos[zhouPosIdx];
				zhou.x += zhouPosObj.dir.x * zhouDir * zhouStep;
				zhou.y += zhouPosObj.dir.y * zhouDir * zhouStep;
				if (zhou.x == zhouPosObj.end.x && zhou.y == zhouPosObj.end.y) {
					console.log('Hide zhou');
					zhouDir *= -1;

				} else if (zhou.x == zhouPosObj.start.x && zhou.y == zhouPosObj.start.y) {
					zhouDir *= -1;
					isZhouAsking = false;
				}
			} else {
				if (dialogLayer.alpha > 0) dialogLayer.alpha -= 0.05;
			}

			barGraphics.clear();
			for (var i = 0; i < (barColorsStep*timesCur/timesMax); i++) {
      	barGraphics.beginFill(barColors[i], 1);
	      barGraphics.drawRect(0, i*barGraphicsHeight*-1, 30, barGraphicsHeight);
	      barGraphics.endFill();
			}

			game.input.keyboard.onDownCallback = function (e) {
				if (!isZhouAsking) {
					if (e.keyCode == keyPairs[keyPairsIdx][keyPairsSwitch].code) {
						keyPairsSwitch = 1 - keyPairsSwitch;
						timesCur--;

						if (timesCur == 0) winGame();

					} else {
						timesCur++;
					}
				}
				else {
					timesCur += 2;
				}
			}

			updateText();
		}
	};

	function changeKeyPair () {
		console.log('Change keypair');
		keyPairsIdx = game.rnd.integerInRange(0, keyPairs.length - 1);
		//keyPairsRndGap = game.rnd.integerInRange(3, 5);
		//game.time.events.add(Phaser.Timer.SECOND * keyPairsRndGap, changeKeyPair, this);
		updateText();
	}

	function showZhou () {
		console.log('Show zhou');
		isZhouAsking = true;
		//zhouPosIdx = game.rnd.integerInRange(0, 1);
		zhou.x = zhouPos[zhouPosIdx].start.x;
		zhou.y = zhouPos[zhouPosIdx].start.y;
	}

	function updateText () {
		promptText.setText(keyPairs[keyPairsIdx][keyPairsSwitch].text);
		//timesText.setText(timesCur);
		secondText.setText((restSecTimer.duration/1000).toFixed(2));
	}

	function setZhouPos() {
		zhouPos = [
			{
				start: {
					x: 150,
					y: screenHeight+50
				},
				end: {
					x: 150,
					y: screenHeight-300
				},
				dir: {
					x: 0,
					y: -1
				}
			},
			{
				start: {
					x: screenWidth+50,
					y: screenHeight-300
				},
				end: {
					x: screenWidth-300,
					y: screenHeight-300
				},
				dir: {
					x: -1,
					y: 0
				}
			}
		]
	}

	function winGame () {
		alert('Win wIn wiN');
		game.state.start('MainMenu');
		return;
	}

	function loseGame () {
		alert('Oh no ! you lose');
		game.state.start('MainMenu');
		return;
	}
})();
