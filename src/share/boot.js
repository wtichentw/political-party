import introVideoPath from '../assets/intro.webm';

import Phaser from 'phaser';

class Boot extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
  }

  create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.state.start(
      'IntroVideo',
      true,
      false,
      {
        videoPath: introVideoPath,
        nextState: {
          key: 'MainMenu',
        },
      }
    );
  }
}

export default Boot;
