import bgImagePath from '../assets/main_menu/bg.png';
import pigImagePath from '../assets/main_menu/pig.png';
import engImagePath from '../assets/main_menu/eng.png';
import sonImagePath from '../assets/main_menu/son.png';

import Phaser from 'phaser';

class MainMenu extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    this.load.image(bgImagePath, bgImagePath);
    this.load.image(pigImagePath, pigImagePath);
    this.load.image(engImagePath, engImagePath);
    this.load.image(sonImagePath, sonImagePath);
  }

  create() {
    this.add.image(0, 0, bgImagePath);

    const jumpHeight = 20;

    const pigImageX = 890;
    const pigImageY = 330;
    const pigImage = this.add.image(pigImageX, pigImageY, pigImagePath);
    pigImage.scale.set(0.33);
    pigImage.inputEnabled = true;
    pigImage.input.useHandCursor = true;
    pigImage.events.onInputOver.add((image) => {
      // Since the onInputDown signal will also trigger the onInputOver signal,
      // the y of the image hovered must be guarded.
      image.y = (image.y === pigImageY - jumpHeight) ? image.y : pigImageY - jumpHeight;
    });
    pigImage.events.onInputOut.add((image) => {
      image.y += 20;
    });

    const engImageX = 220;
    const engImageY = 320;
    const engImage = this.add.image(engImageX, engImageY, engImagePath);
    engImage.scale.set(0.31);
    engImage.inputEnabled = true;
    engImage.input.useHandCursor = true;
    engImage.events.onInputOver.add((image) => {
      // Since the onInputDown signal will also trigger the onInputOver signal,
      // the y of the image hovered must be guarded.
      image.y = (image.y === engImageY - jumpHeight) ? image.y : engImageY - jumpHeight;
    });
    engImage.events.onInputOut.add((image) => {
      image.y += 20;
    });

    const sonImageX = 625;
    const sonImageY = 495;
    const sonImage = this.add.image(sonImageX, sonImageY, sonImagePath);
    sonImage.scale.set(0.33);
    sonImage.inputEnabled = true;
    sonImage.input.useHandCursor = true;
    sonImage.events.onInputOver.add((image) => {
      // Since the onInputDown signal will also trigger the onInputOver signal,
      // the y of the image hovered must be guarded.
      image.y = (image.y === sonImageY - jumpHeight) ? image.y : sonImageY - jumpHeight;
    });
    sonImage.events.onInputOut.add((image) => {
      image.y += 20;
    });
  }
}

export default MainMenu;
