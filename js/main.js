/* Make sure that the requestAnimationFrame function is browser compatible */
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


/* GLOBAL OBJECTS */
var canvas = document.getElementById('invaders-canvas');
var ctx = canvas.getContext('2d');

var CANVAS_WIDTH_PX = 640; // width of canvas in px
var CANVAS_HEIGHT_PX = 700; // height of canvas in px
var GAME_AREA_SIZE = 1000; // internal unit. Size of squared game area
var GAME_AREA_PX = new Rect(0, 0, 640, 640); // game area in px
var FOOTER_AREA_PX = new Rect(0, 640, 640, 60); // footer area for stats (score and lifes)

var BLOCK_SHOOT_TIME = 0.3; // allow player shooting only every 0.3 seconds


var GameModes = {
  MODE_START: 0,          // Show menu screen
  MODE_PLAY: 1,           // Gameplay
  MODE_NEXT_LEVEL: 2,     // Transition to new round
  MODE_FINISH: 3,         // Show score at end of game
}

var gameMode = null;
var inputHandler = null;
var particleManager = null;
var enemyFormation = null;
var bulletManager = null;
var player = null;


function init() {
  gameMode = GameModes.MODE_START;
  resetGame();
  loop();
}

/* Initialize all objects again */
function resetGame() {

  inputHandler = new InputHandler(BLOCK_SHOOT_TIME * 1000);
  particleManager = new ParticleManager();
  bulletManager = new BulletManager();
  enemyManager = new EnemyManager();
  player = new Player();

}


/* For a new level not everything should be reset (e.g. score, lifes).
Therefore the "nextLevel" interface is implemented */
function nextLevel() {
  inputHandler.nextLevel();
  particleManager.nextLevel();
  bulletManager.nextLevel();
  enemyManager.nextLevel();
  player.nextLevel();
}


function showMenuScreen() {
  drawTextCenter(CANVAS_WIDTH_PX / 2, 150, 'SPACE INVADERS', 20, [255, 255, 255]);
  flashingTextCenter(CANVAS_WIDTH_PX / 2, 350, 'PRESS ENTER TO PLAY', 20, [0, 255, 255], 1200);
}

function showFinishScreen() {
  var scoreString = String(player.getScore());
  drawTextCenter(CANVAS_WIDTH_PX / 2, 100, 'YOUR SCORE', 20, [0, 255, 255]);
  drawTextCenter(CANVAS_WIDTH_PX / 2, 150, scoreString, 20, [255, 255, 255]);
  flashingTextCenter(CANVAS_WIDTH_PX / 2, 400, 'PRESS ENTER TO CONTINUE', 20, [0, 255, 255], 1000);
}

function showNextLevelScreen() {
  drawStatsFooter(player.getLifes(), player.getMaxLifes(), player.getScore());
  flashingTextCenter(CANVAS_WIDTH_PX / 2, 250, 'PREPARE FOR THE NEXT LEVEL!', 20, [0, 255, 255], 500);
}

/* Call draw functions of single game participants and stats footer */
function showGameScreen() {
  enemyManager.drawEnemies();
  bulletManager.drawBullets();
  player.draw();
  drawStatsFooter(player.getLifes(), player.getMaxLifes(), player.getScore());
  particleManager.draw();
}


function drawStatsFooter(lifes, maxLifes, score) {
  // Line for diving game area from stats
  drawRect(FOOTER_AREA_PX.x, FOOTER_AREA_PX.y, FOOTER_AREA_PX.w, 2, [255, 0, 0]);

  // Show remaining lifes
  var textLifes = String(lifes) + '/' + String(maxLifes);
  drawText(FOOTER_AREA_PX.x + 20, FOOTER_AREA_PX.y + 40, textLifes, 16, [255, 255, 255]);

  // Show score
  var textScore = 'SCORE: ' + String(score);
  drawTextRightAligned(FOOTER_AREA_PX.w - 20, FOOTER_AREA_PX.y + 40, textScore, 16, [255, 255, 255]);
}


function calcGameLogic(ellapsedTime) {

  /* Detect all collisions between player <-> bullets
  *  and bullets <-> enemies 
  * and safe the result in collision info
  */
  var collisionInfo = bulletManager.detectCollisions(player, enemyManager.getEnemies());

  /* Create a new explosion with random color for each enemy that was killed */
  for (var i = 0; i < collisionInfo.enemyIndices.length; i++) {
    particleManager.createEnemyExplosion(enemyManager.getPosition(collisionInfo.enemyIndices[i]));
  }

  /* Create a new big red explosion if the player was hit */
  for (var i = 0; i < collisionInfo.numPlayerHits; i++) {
    particleManager.createPlayerExplosion(player.getPosition());
  }
  
  /* Update all explosions and move the particles */
  particleManager.update(ellapsedTime);

  /* Update player position, score and lifes */
  player.update(ellapsedTime, collisionInfo, inputHandler.getState(), enemyManager.getScoreAccumulation());

  /* Create a new bullet that shoots from bottom to top */
  if (player.shoot()) {
    bulletManager.spawnBullet(player.getPosition().x, player.getPosition().y, -1, 500);
  }

  /* Move all enemies and spawn new random bullets */
  enemyManager.updateFormation(ellapsedTime, collisionInfo);

  /* Move bullets and remove dead bullets */
  bulletManager.updateBullets(ellapsedTime);

}


var lastTime = null;
var totalTime = 0;
var measuredTime = 0;

/* Helper function for measuring time */
function startMeasurement() {
  measuredTime = 0;
}

function measureTime() {
  return measuredTime;
}

/* Main game loop. Calls loop() again at end of function */
function loop() {

  lastTime = (!lastTime) ? Date.now() : lastTime;
  var now = Date.now();
  var ellapsedTime = (now - lastTime) / 1000;
  totalTime += ellapsedTime;
  measuredTime += ellapsedTime;

  switch (gameMode) {

    case GameModes.MODE_START:

      clearCanvas(); // clear canvas
      showMenuScreen();

      if (inputHandler.wasEnterPressed()) { // Start game
        resetGame();
        gameMode = GameModes.MODE_PLAY;
      }

      break;

    case GameModes.MODE_PLAY:

      calcGameLogic(ellapsedTime);
      clearCanvas(); // clear canvas
      showGameScreen();

      /**
       * If the player is dead or if enemies have contact with the player
       * change to MODE_FINISH
       */
      var enemyFormationRect = new Rect(0, 0, GAME_AREA_SIZE, enemyManager.getLowerYBoundary());
      if (!player.isAlive() || Rect.rectCollision(enemyFormationRect, player.bounds)) {
        
        gameMode = GameModes.MODE_FINISH;
      }

      if (!enemyManager.hasEnemies()) {
        gameMode = GameModes.MODE_NEXT_LEVEL;
        startMeasurement();
      }

      break;

    case GameModes.MODE_NEXT_LEVEL:

      if (measureTime() < 3) { // show next level screen for 3 seconds
        clearCanvas();
        showNextLevelScreen();
      }
      else {
        nextLevel();
        gameMode = GameModes.MODE_PLAY;
      }

      break;

    case GameModes.MODE_FINISH:

      clearCanvas(); // clear canvas
      showFinishScreen();

      if (inputHandler.wasEnterPressed()) {
        gameMode = GameModes.MODE_START;
      }

      break;
  }


  lastTime = now;
  requestAnimationFrame(loop);
}


window.onload = function(e) {
  SpriteSheet.loadSpriteSheet(init);
}