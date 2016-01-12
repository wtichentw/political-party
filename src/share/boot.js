import Phaser from 'phaser';

export default class Boot {

  constructor(game) {
    this.game = game;
  }

  preload() {
  }

  create() {

    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    // game.state.start(
    //   'IntroVideo',
    //   true,
    //   false,
    //   {
    //     videoPath: 'media/intro.webm',
    //     nextState: {
    //       key: 'MainMenu'
    //     }
    //   }
    // );

  }

}
