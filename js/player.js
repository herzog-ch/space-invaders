class Player extends BaseObject {

  constructor() {

    super(GAME_AREA_SIZE / 2, GAME_AREA_SIZE - 50, SpriteSheet.clipRectPlayer, 27, 17, GAME_AREA_PX.w);
    
    this.aspectRatio = SpriteSheet.clipRectPlayer.w / SpriteSheet.clipRectPlayer.h;

    this.init();
  }

  init() {

    this.height = 40;
    this.width = Utils.roundToInt(this.aspectRatio * this.height);
    this.halfWidth = Utils.roundToInt(this.width / 2);
    this.halfHeight = Utils.roundToInt(this.height / 2);

    this.position = new Point2D(GAME_AREA_SIZE / 2 - this.halfWidth, GAME_AREA_SIZE - this.halfHeight - 20);

    // calc correct values for rendering
    this.left = this.position.x - this.halfWidth;
    this.top = this.position.y - this.halfHeight;
  
    super.updateBounds(this.left, this.top, this.width, this.height);

    this.velX = 400; // 100 units per second

    this.shootFlag = false;

    this.score = 0;
    this.lifes = 3;
    this.maxLifes = this.lifes;

  }

  nextLevel() {

    this.position = new Point2D(GAME_AREA_SIZE / 2 - this.halfWidth, GAME_AREA_SIZE - this.halfHeight - 20);

    // calc correct values for rendering
    this.left = this.position.x - this.halfWidth;
    this.top = this.position.y - this.halfHeight;
  
    super.updateBounds(this.left, this.top, this.width, this.height); 

  }

  getPosition() {
    return this.position;
  }

  getScore() {
    return this.score;
  }

  getLifes() {
    return this.lifes;
  }

  getMaxLifes() {
    return this.maxLifes;
  }

  isAlive() {
    return this.lifes > 0;
  }

  shoot() {
    var shoot = this.shootFlag;
    this.shootFlag = false;
    return shoot;
  }

  update(ellapsedTime, collisionInfo, inputHandlerState, scoreAccumulation) {

    this.score += scoreAccumulation * collisionInfo.enemyIndices.length;
    this.lifes -= collisionInfo.numPlayerHits;
    
    var left = inputHandlerState.isLeftKeyDown;
    var right = inputHandlerState.isRightKeyDown;
    this.shootFlag = inputHandlerState.isShootKeyDown;

    if (left || right) {
      var deltaX = this.velX * ellapsedTime;
      deltaX = Utils.roundToInt(deltaX);
      if (deltaX < 1) deltaX = 1;

      if (left) this.position.x -= deltaX;
      else if (right)  this.position.x += deltaX;

      this.position.x = Utils.clip(this.position.x, 0 + this.halfWidth, 1000 - this.halfWidth);
      this.bounds.x = this.position.x - this.halfWidth;
    }
    
    super.updateTargetRect();

  }


}