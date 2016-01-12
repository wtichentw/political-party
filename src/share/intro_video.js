import Phaser from 'phaser';

class IntroVideo extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  init({ videoPath, nextState }) {
    this.videoPath = videoPath;
    this.nextState = nextState;
  }

  preload() {
    this.load.video('introVideo', this.videoPath);
  }

  create() {
    const introVideo = this.add.video('introVideo');
    introVideo.addToWorld();
    introVideo.play();
    introVideo.onComplete.add(() => {
      introVideo.stop();
      introVideo.game.state.start('MainMenu');
    });

    const skipText = this.add.text(
      this.camera.width,
      this.camera.height,
      'Skip',
      {
        font: '25px Arial',
        fill: '#868988'
      }
    );
    skipText.anchor.set(1, 1);
    skipText.inputEnabled = true;
    skipText.events.onInputDown.add(() => {
      introVideo.stop();
      introVideo.game.state.start('MainMenu');
    });
  }
}

export default IntroVideo;
