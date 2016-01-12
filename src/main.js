import 'normalizeCss';
import './main.css';

import Phaser from 'phaser';
import Boot from './share/boot.js';

const game = new Phaser.Game(1280, 720, Phaser.AUTO);

game.state.add('Boot', Boot);
// game.state.add('IntroVideo', IntroVideo);
// game.state.add('MainMenu', MainMenu);
// game.state.add('StageIntro', StageIntro);
// game.state.add('StageOver', StageOver);
// game.state.add('SitTightGame', SitTightGame);

game.state.start('Boot');