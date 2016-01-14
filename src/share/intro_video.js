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
      this.state.start(
        this.nextState.key,
        true,
        false,
        this.nextState.args
      );
    });

    const skipText = this.add.text(
      this.game.width,
      this.game.height,
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
      this.state.start(
        this.nextState.key,
        true,
        false,
        this.nextState.args
      );
    });
  }
}

export default IntroVideo;
