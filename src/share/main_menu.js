import bgImagePath from '../assets/main_menu/bg.png';
import pigImagePath from '../assets/main_menu/pig.png';
import engImagePath from '../assets/main_menu/eng.png';
import sonImagePath from '../assets/main_menu/son.png';
import creditImagePath from '../assets/main_menu/team.png';
import creditBuildingImagePath from '../assets/main_menu/credit.png';
import lazyBuildingImagePath from '../assets/main_menu/lazy.png';

import Phaser from 'phaser';

class MainMenu extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    // Use file path as key for simplicity.
    this.load.image(bgImagePath, bgImagePath);
    this.load.image(pigImagePath, pigImagePath);
    this.load.image(engImagePath, engImagePath);
    this.load.image(sonImagePath, sonImagePath);
    this.load.image(creditImagePath, creditImagePath);
    this.load.image(creditBuildingImagePath, creditBuildingImagePath);
    this.load.image(lazyBuildingImagePath, lazyBuildingImagePath);
  }

  create() {
    const bgImage = this.add.image(0, 0, bgImagePath);

    const creditBuildingImageX = 355;
    const creditBuildingImageY = 415;
    const creditBuildingImage = this.add.image(
      creditBuildingImageX,
      creditBuildingImageY,
      creditBuildingImagePath
    );

    const creditImageX = this.world.centerX;
    const creditImageY = this.world.centerY;
    const creditImage = this.add.image(creditImageX, creditImageY, creditImagePath);
    creditImage.anchor.set(0.5);
    creditImage.scale.set(0.7);
    creditImage.alpha = 0;
    creditImage.inputEnabled = true;

    const lazyBuildingImageX = 790;
    const lazyBuildingImageY = 280;
    const lazyBuildingImage = this.add.image(
      lazyBuildingImageX,
      lazyBuildingImageY,
      lazyBuildingImagePath
    );

    const pigImageX = 890;
    const pigImageY = 330;
    const pigImage = this.add.image(pigImageX, pigImageY, pigImagePath);
    pigImage.scale.set(0.33);

    const engImageX = 220;
    const engImageY = 320;
    const engImage = this.add.image(engImageX, engImageY, engImagePath);
    engImage.scale.set(0.31);

    const sonImageX = 625;
    const sonImageY = 495;
    const sonImage = this.add.image(sonImageX, sonImageY, sonImagePath);
    sonImage.scale.set(0.33);

    const mainLayer = this.add.group();
    mainLayer.add(bgImage);
    mainLayer.add(lazyBuildingImage);
    mainLayer.add(creditBuildingImage);
    mainLayer.add(pigImage);
    mainLayer.add(engImage);
    mainLayer.add(sonImage);

    const creditLayer = this.add.group();
    creditLayer.add(creditImage);

    this.world.bringToTop(mainLayer);

    const jumpHeight = 20;

    const clickableImages = [pigImage, engImage, sonImage, creditBuildingImage, lazyBuildingImage];
    clickableImages.forEach((clickableImage) => {
      clickableImage.inputEnabled = true;
      clickableImage.input.useHandCursor = true;
      clickableImage.events.onInputOver.add((() => {
        const imageOriginalY = clickableImage.y;
        return (image) => {
          // Since the onInputDown signal will also trigger the onInputOver signal,
          // the y of the clickable image must be guarded.
          image.y = imageOriginalY - jumpHeight;
        };
      })());
      clickableImage.events.onInputOut.add((image) => {
        image.y += 20;
      });
    });

    const lazyURL = 'https://www.facebook.com/media/set/?set=a.1690070997875035.1073741829.1683872658494869&type=3&__mref=message_bubble';
    lazyBuildingImage.events.onInputDown.add(() => {
      window.open(lazyURL, '_blank');
    });

    creditBuildingImage.events.onInputDown.add(() => {
      this.world.bringToTop(creditLayer);
      this.add.tween(creditImage).to(
        {
          alpha: 1,
        },
        Phaser.Timer.HALF,
        'Linear',
        true
      );
    });

    creditImage.events.onInputDown.add(() => {
      const creditImageTween = this.add.tween(creditImage).to(
        {
          alpha: 0,
        },
        Phaser.Timer.HALF,
        'Linear',
        true
      );
      creditImageTween.onComplete.add(() => {
        this.world.bringToTop(mainLayer);
      });
    });
  }
}

export default MainMenu;
