/*
Alexander Halim
Rocket Patrol: Starfield
Time:
Mods:
Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (5)
Display the time remaining (in seconds) on the screen (3)
Implement the 'FIRE' UI text from the original game (1)
Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) (1)

Citations?

*/

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: [Menu, Play],
};

let game = new Phaser.Game(config);

let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

// UI Size
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
