const PLUS_TIME = 10;
const MINUS_TIME = 5;

class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  create() {
    this.starfield = this.add
      .tileSprite(0, 0, 640, 480, "starfield")
      .setOrigin(0, 0);
    // green UI background
    this.add
      .rectangle(
        0,
        borderUISize + borderPadding,
        game.config.width,
        borderUISize * 2,
        0x00ff00
      )
      .setOrigin(0, 0);
    // white borders
    this.add
      .rectangle(0, 0, game.config.width, borderUISize, 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(
        0,
        game.config.height - borderUISize,
        game.config.width,
        borderUISize,
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(0, 0, borderUISize, game.config.height, 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(
        game.config.width - borderUISize,
        0,
        borderUISize,
        game.config.height,
        0xffffff
      )
      .setOrigin(0, 0);

    this.p1Rocket = new Rocket(
      this,
      game.config.width / 2,
      game.config.height - borderUISize - borderPadding,
      "rocket"
    ).setOrigin(0.5, 0);

    // add spaceships (x3)
    this.ship01 = new Spaceship(
      this,
      game.config.width + borderUISize * 6,
      borderUISize * 4,
      "spaceship",
      0,
      30
    ).setOrigin(0, 0);
    this.ship02 = new Spaceship(
      this,
      game.config.width + borderUISize * 3,
      borderUISize * 5 + borderPadding * 2,
      "spaceship",
      0,
      20
    ).setOrigin(0, 0);
    this.ship03 = new Spaceship(
      this,
      game.config.width,
      borderUISize * 6 + borderPadding * 4,
      "spaceship",
      0,
      10
    ).setOrigin(0, 0);

    // new spaceship here
    this.newSpaceship = new NewSpaceship(
      this,
      game.config.width + borderUISize * 5,
      borderUISize * 4,
      "newspaceship",
      0,
      60
    )
      .setOrigin(0, 0)
      .setScale(0.5);

    keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // init score
    this.p1Score = 0;

    // display score
    let scoreConfig = {
      fontFamily: "Courier",
      fontSize: "28px",
      backgroundColor: "#F3B141",
      color: "#843605",
      align: "right",
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100,
    };

    this.scoreLeft = this.add.text(
      borderUISize + borderPadding,
      borderUISize + borderPadding * 2,
      this.p1Score,
      scoreConfig
    );

    // gameover flag
    this.gameOver = false;

    // 60-second play clock
    scoreConfig.fixedWidth = 0;
    this.clock = this.time.delayedCall(
      game.settings.gameTimer,
      () => {
        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2,
            "GAME OVER",
            scoreConfig
          )
          .setOrigin(0.5);
        this.add
          .text(
            game.config.width / 2,
            game.config.height / 2 + 64,
            "Press (R) to Restart or <- for Menu",
            scoreConfig
          )
          .setOrigin(0.5);
        this.gameOver = true;
      },
      null,
      this
    );

    // display timer
    let timerConfig = {
      fontFamily: "Courier",
      fontSize: "28px",
      backgroundColor: "#F3B141",
      color: "#843605",
      align: "right",
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100,
    };

    this.timeLeft = this.add.text(
      borderUISize + borderPadding * 40,
      borderUISize + borderPadding * 2,
      game.settings.gameTimer,
      timerConfig
    );
  }

  update() {
    // check key input for restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
      this.scene.restart();
    }

    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.scene.start("menuScene");
    }

    if (!this.gameOver) {
      // updating the timer
      let elapsedTime = Math.floor(
        (game.settings.gameTimer - this.clock.getElapsed()) / 1000
      );

      this.timeLeft.text = elapsedTime;
      // this.timeLeft.text = elapsedTime;

      this.p1Rocket.update(); // update rocket sprite
      this.ship01.update(); // update spaceships (x3)
      this.ship02.update();
      this.ship03.update();

      this.newSpaceship.update(); // update spec
    }

    this.starfield.tilePositionX -= 1;
    this.p1Rocket.update();

    this.ship01.update(); // update spaceships (x3)
    this.ship02.update();
    this.ship03.update();

    this.newSpaceship.update(); // update spec

    if (this.checkCollision(this.p1Rocket, this.ship03)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship03);
    }
    if (this.checkCollision(this.p1Rocket, this.ship02)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship02);
    }

    if (this.checkCollision(this.p1Rocket, this.ship01)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship01);
    }

    if (this.checkCollision(this.p1Rocket, this.newSpaceship)) {
      this.p1Rocket.reset();
      this.shipExplode(this.newSpaceship);
    }
  }

  checkCollision(rocket, ship) {
    if (
      rocket.x < ship.x + ship.width &&
      rocket.x + rocket.width > ship.x &&
      rocket.y < ship.y + ship.height &&
      rocket.height + rocket.y > ship.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  shipExplode(ship) {
    // temp hide ship
    ship.alpha = 0;
    // create explosion at ship pos
    let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
    boom.anims.play("explode");
    boom.on("animationcomplete", () => {
      // callback after ani completes
      ship.reset(); // reset ship pos
      ship.alpha = 1; // make ship visible again
      boom.destroy(); // remove explosion sprite
    });

    // score add and text update
    this.p1Score += ship.points;
    console.log(ship.points);
    this.scoreLeft.text = this.p1Score;

    this.sound.play("sfx-explosion");

    // particle emitter explosion called here
    const emitter = this.add.particles(ship.x, ship.y, "explosion3", {
      //frame: ["red", "yellow", "green"],
      lifespan: 4000,
      speed: { min: 150, max: 250 },
      scale: { start: 0.8, end: 0 },
      gravityY: 150,
      blendMode: "ADD",
      emitting: false,
    });

    emitter.explode(16);
    // hit handler is here
    this.adjustTime(PLUS_TIME);
  }

  adjustTime(seconds) {
    this.clock.elapsed -= seconds * 1000;
  }

  missHandler() {
    this.adjustTime(-MINUS_TIME);
  }
}
