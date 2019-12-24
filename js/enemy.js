class Enemy extends BaseObject {
  
  constructor(clipRect, clipRectToggled) {
    super(0, 0, clipRect, 40, 40, GAME_AREA_PX.w);

    this.clipRectNormal = clipRect;
    this.clipRectToggled = clipRectToggled;
    
    this.toggled = false; // show toggled image
    this.stepSizeX = 20;
    this.stepSizeY = 20;
    this.makeYStep = false;
    this.live = true;
  }

  /* Change image of enemy every movement */
  toggleImage() {
    this.toggled = !this.toggled;
    if (this.toggled) super.setClipRect(this.clipRectToggled);
    else super.setClipRect(this.clipRectNormal);
  }

  switchXDirection() {
    this.stepSizeX = -1 * this.stepSizeX;
  }

  setStepSizeX(stepSize) {
    this.stepSizeX = stepSize;
  }

  setStepSizeY(stepSize) {
    this.stepSizeY = stepSize;
  }

  moveY() {
    this.makeYStep = true;
  }

  update() {
    this.toggleImage();

    if (this.makeYStep) { // move downwards at the border of the game area
      this.bounds.y += this.stepSizeY;
      this.makeYStep = false;
    }
    else {
      this.bounds.x += this.stepSizeX;
    }
    
    /* Calc new position in pixel in game canvas */
    super.updateTargetRect();    
  }

}



class EnemyManager {

  constructor() {
    this.difficulty = new EnemyDifficulty(); // Object holding the current game difficulty
    this.initFormation();
  }

  nextLevel() {
    this.difficulty.increaseLevelDifficulty();
    this.initFormation();
  }

  /* Create a new formation of enemies with 55 enemies (5 rows, 11 columns) */
  initFormation() {

    // clear enemies
    this.enemies = [];

    // init formation state
    this.enemySize = 40;
    this.rows = 5;
    this.columns = 11;
    this.numEnemies = this.rows * this.columns;
    this.gapHorizontal = 7;
    this.gapVertical = 15;

    /* Random starting position of formation */
    this.startX = Utils.getRandomInt(50, 250);
    this.startY = Utils.getRandomInt(80, 150);

    this.endX = this.startX + this.columns * (this.enemySize + this.gapHorizontal) - this.gapHorizontal;
    this.endY = this.startY + this.rows * (this.enemySize + this.gapVertical) - this.gapVertical;

    this.stepSizeX = 20;
    this.stepXEllapsedTime = 0;
    this.directionX = 1;

    // Create initial enemies
    for (var row = 0; row < this.rows; row++) {
      for (var column = 0; column < this.columns; column++) {
        
        // Choose enemy type
        var clipRectEnemy = null;
        var clipRectEnemyToggled = null;
        
        // Every row has a different image for the aliens
        switch (row) {
          case 0:
            clipRectEnemy = SpriteSheet.clipRectAlien1;
            clipRectEnemyToggled = SpriteSheet.clipRectAlien1Toggled;
            break;
          case 1:
          case 2: 
            clipRectEnemy = SpriteSheet.clipRectAlien2;
            clipRectEnemyToggled = SpriteSheet.clipRectAlien2Toggled;
            break;
          case 3:
          case 4:
            clipRectEnemy = SpriteSheet.clipRectAlien3;
            clipRectEnemyToggled = SpriteSheet.clipRectAlien3Toggled;
            break;
        }
  
        // Calc position in game
        var x = column * (this.enemySize + this.gapHorizontal);
        var y = row * (this.enemySize + this.gapVertical);
        x += this.startX;
        y += this.startY;
  
        var enemy = new Enemy(clipRectEnemy, clipRectEnemyToggled);
        enemy.setStepSizeY(this.difficulty.getStepSizeY());  
        enemy.updateBounds(x, y, this.enemySize, this.enemySize);
        this.enemies.push(enemy);
  
      }
    }
  }

  getEnemies() {
    return this.enemies;
  }

  getNumberOfEnemies() {
    return this.numEnemies;
  }

  getPosition(enemyIndex) {
    var x = Utils.roundToInt(this.enemies[enemyIndex].bounds.x + this.enemySize / 2);
    var y = Utils.roundToInt(this.enemies[enemyIndex].bounds.y + this.enemySize / 2);
    return new Point2D(x, y); 
  }

  getLowerYBoundary() {
    return this.endY;
  }

  getScoreAccumulation() {
    return this.difficulty.getScoreAccumulation();
  }

  /* Every enemy has a probability to shoot */
  spawnBullets(ellapsedTime) {

    for (var i = 0; i < this.numEnemies; i++) {
      
      var rand = Utils.getRandomFloat(0, 1);
      var threshold = this.difficulty.getShootProbability() * ellapsedTime;

      if (rand < threshold) {

        // if enemy should shoot, create a new bullet with random speed
        var speed = Utils.getRandomInt(this.difficulty.getShootSpeedMin(), this.difficulty.getShootSpeedMax());
        var direction = 1; // downwards

        bulletManager.spawnBullet(
          this.enemies[i].bounds.x + this.enemySize,
          Utils.roundToInt(this.enemies[i].bounds.y + this.enemySize / 2),
          direction,
          speed);
      }
    }

  }

  hasEnemies() {
    return this.numEnemies > 0;
  }

  /*
  * Remove dead enemies
  * Spawn bullets
  * Move all enemies
  */
  updateFormation(ellapsedTime, collisionInfo) {

    // Remove dead enemies
    for (var i = 0; i < collisionInfo.enemyIndices.length; i++) {
      this.enemies[collisionInfo.enemyIndices[i]].live = false;
      (new Audio('assets/invaderkilled.wav')).play()

      // adjust the game difficulty
      this.difficulty.adjustDifficultyToNumberOfEnemies();
    }

    var newEnemies = this.enemies.filter(enemy => (enemy.live == true));
    this.enemies = newEnemies;
    this.numEnemies = this.enemies.length;
    if (this.numEnemies.length <= 0) return;

    this.spawnBullets(ellapsedTime);

    this.stepXEllapsedTime += ellapsedTime;
    var updateX = false;
    var updateXDirection = false;

    if (this.stepXEllapsedTime > this.difficulty.getStepIntervalX()) {
      this.stepXEllapsedTime = 0;
      updateX = true;
    }

    if (updateX) {

      // Check if change of direction is necessary
      if (this.directionX == 1) {
        if (this.endX + this.stepSizeX >= GAME_AREA_SIZE) updateXDirection = true;
      }
      else {
        if (this.startX + this.stepSizeX <= 0) updateXDirection = true;
      }
      if (updateXDirection) {
        this.directionX = -1 * this.directionX;
        this.stepSizeX *= -1;
      }


      // Loop over all enemies in order to move them
      for (var i = 0; i < this.numEnemies; i++) {

        if (updateXDirection) {
          this.enemies[i].switchXDirection();
          this.enemies[i].moveY();

          var yValues = this.enemies.map(e => e.bounds.y);
          this.endY = Math.max(...yValues) + this.enemySize;

        }
    
        this.enemies[i].update();
      }

      if (!updateXDirection) {
        var xValues = this.enemies.map(e => e.bounds.x);
        this.startX = Math.min(...xValues);
        this.endX = Math.max(...xValues) + this.enemySize;
      }

    } 

  }

  drawEnemies() {
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }
  }

}


/*
* Class for defining the game difficulty
* Setting initial game parameters
* Setting increasement of game difficulty every level and
* adjusting to amount of remaining enemies
*/
class EnemyDifficulty {

  constructor() {
    this.init();
  }

  init() {
    this.level = 0; // increases by one every round
    this.accumulateScore = 25;

    this.initStepIntervalX = 0.4; // make enemies faster or slower
    this.initStepSizeY = 20; // make enemies come down faster
    this.initProbShoot = 0.02; // prob for one enemy shooting during one second

    this.currentShootSpeedMin = 200;
    this.currentShootSpeedMax = 200;
    this.currentStepIntervalX = this.initStepIntervalX;
    this.currentStepSizeY = this.initStepSizeY;
    this.currentProbShoot = this.initProbShoot;
  }

  // gets called every level
  increaseLevelDifficulty() {
    this.level += 1;
    this.accumulateScore += 5;
    this.initStepIntervalX *= 0.8;
    this.initStepSizeY += 2;
    this.initProbShoot *= 1.2;
    this.currentStepIntervalX = this.initStepIntervalX;
    this.currentStepSizeY = this.initStepSizeY;
    this.currentProbShoot = this.initProbShoot;
  }

  // gets called every time an enemy is killed
  adjustDifficultyToNumberOfEnemies() {
    this.currentStepIntervalX *= 0.975;
    this.currentProbShoot *= 1.03;
  }

  getScoreAccumulation() {
    return this.accumulateScore;
  }

  getLevel() {
    return this.level;
  }

  getShootProbability() {
    return this.currentProbShoot;
  }

  getStepSizeY() {
    return this.currentStepSizeY;
  }

  getStepIntervalX() {
    return this.currentStepIntervalX;
  }

  getShootSpeedMin() {
    return this.currentShootSpeedMin;
  }

  getShootSpeedMax() {
    return this.currentShootSpeedMax;
  }

}