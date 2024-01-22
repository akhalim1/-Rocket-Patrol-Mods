class NewSpaceship extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, pointValue) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this); // add to existing scene
    this.points = pointValue; // store point values
    this.moveSpeed = game.settings.newSpaceshipSpeed; // spaceship speed in pixels/frame
  }

  update() {
    // moves spaceship left
    this.x -= this.moveSpeed;

    // wraps around from left to right edge
    if (this.x <= 0 - this.width) {
      this.x = game.config.width;
    }
  }

  // reset pos
  reset() {
    this.x = game.config.width;
  }
}
