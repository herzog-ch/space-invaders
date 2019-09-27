class Bullet extends BaseObject {
  
  constructor(x, y, direction, speed) {
    super(x, y, SpriteSheet.clipRectBullet, 8, 36, GAME_AREA_PX.w);
    
    this.aspectRatio = SpriteSheet.clipRectBullet.w / SpriteSheet.clipRectBullet.h;
    this.height = 20;
    this.width = Utils.roundToInt(this.aspectRatio * this.height);
    this.halfWidth = Utils.roundToInt(this.width / 2);
    this.halfHeight = Utils.roundToInt(this.height / 2);

    // x, y given is middle point of bullet
    this.position = new Point2D(x, y);

    // calc correct values for rendering
    super.updateBounds(this.position.x - this.halfWidth, this.position.y - this.halfHeight, this.width, this.height);

    this.direction = direction;
    this.speed = speed;
    this.live = true;
  }

  /* Update bounds using speed and ellapsed time
  * Remove bullet if it's out of field of view
  */
  update(ellapsedTime) {

    var deltaY = this.speed * this.direction * ellapsedTime;
    this.position.y = Utils.roundToInt(this.position.y + deltaY);
    this.bounds.y = this.position.y - this.halfHeight;

    if (this.position.y < 0 || this.position.y > 1000) {
      this.live = false;
    }

    /* Calc new position in pixel in game canvas */
    super.updateTargetRect();
    
  }

}


class BulletManager {

  constructor() {
    this.init();
  }

  init() {
    this.bullets = [];
  }

  nextLevel() {
    this.init();
  }

  spawnBullet(x, y, direction, speed) {
    var bullet = new Bullet(x, y, direction, speed);
    this.bullets.push(bullet);
  }

  updateBullets(ellapsedTime) {

    // Move Bullets
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update(ellapsedTime);
    }

    // Remove dead bullets
    var newBullets = this.bullets.filter(bullet => (bullet.live == true)); 
    this.bullets = newBullets;

  }

  drawBullets() {
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }
  }


  detectCollisions(player, enemies) {

    var numPlayerHits = 0;
    var enemyIndices = [];

    // check if player was hit
    var bulletsDown = this.bullets.filter(bullet => (bullet.direction == 1));

    for (var i = 0; i < bulletsDown.length; i++) {

      if (Rect.rectCollision(bulletsDown[i].bounds, player.bounds)) {
        bulletsDown[i].live = false;
        numPlayerHits++;
      }
    }

    // check if enemies were hit
    var bulletsUp = this.bullets.filter(bullet => (bullet.direction == -1));

    for (var i = 0; i < bulletsUp.length; i++) {
      for (var e = 0; e < enemies.length; e++) {
        if (Rect.rectCollision(bulletsUp[i].bounds, enemies[e].bounds)) {
          bulletsUp[i].live = false;
          enemyIndices.push(e);
        }
      }
    }

    var newBulletsDown = bulletsDown.filter(bullet => (bullet.live == true));
    var newBulletsUp = bulletsUp.filter(bullet => (bullet.live == true));
    this.bullets = newBulletsDown.concat(newBulletsUp);  


    // return collisionInfo
    return {
      numPlayerHits: numPlayerHits,
      enemyIndices: enemyIndices
    }

  }

}