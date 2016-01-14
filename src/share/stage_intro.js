import introImagePath from '../assets/stage_intro.png';

import Phaser from 'phaser';

class StageIntro extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  init({ title, subtitle, nextState }) {
    this.title = title;
    this.subtitle = subtitle;
    this.nextState = nextState;
  }

  preload() {
    this.load.image(introImagePath, introImagePath);
  }

  create() {
    this.stage.setBackgroundColor(0xFFFFFF);

    const introImage = this.add.image(0, 0, introImagePath);
    introImage.scale.set(this.game.width / introImage.width);

    const titleText = this.add.text(
      this.game.width / 2,
      introImage.height + 30,
      this.title,
      {
        font: '40px PingFang-UltraLight',
        fill: '#000000',
      }
    );
    titleText.anchor.set(0.5, 0);

    const subtitleText = this.add.text(
      this.game.width / 2,
      titleText.y + titleText.height + 10,
      this.subtitle,
      {
        font: '20px PingFang-UltraLight',
        fill: '#000000',
      }
    );
    subtitleText.anchor.set(0.5, 0);

    const continueText = this.add.text(
      this.game.width / 2,
       subtitleText.y + subtitleText.height + 10,
      '點擊畫面以繼續',
      {
        font: '15px PingFang-UltraLight',
        fill: '#000000',
      }
    );
    continueText.anchor.set(0.5, 0);

    this.add.tween(continueText).to(
      {
        alpha: 0
      },
      Phaser.Timer.HALF,
      'Linear',
      true,
      0,
      -1,
      true
    );

    // Click anywhere on the screen to continue to the stage.
    this.input.onDown.add(() => {
      this.state.start(
        this.nextState.key,
        true,
        false,
        this.nextState.args
      );
    });
  }
}

export default StageIntro;
