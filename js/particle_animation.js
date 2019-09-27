class Particle {
  
  constructor(x, y, speedX, speedY, accelerationY, lifeTime) {
    this.position = new Point2D(x, y);
    this.speedX = speedX;
    this.speedY = speedY;
    this.accelerationY = accelerationY;
    this.lifeTime = lifeTime;
    this.alive = true;
  }

  update(ellapsedTime) {
    this.position.x += this.speedX * ellapsedTime; // move particle in x direction
    this.position.y += this.speedY * ellapsedTime; // move particle in y direction
    this.speedY += this.accelerationY * ellapsedTime; // update y velocity using gravity
    this.lifeTime -= ellapsedTime; // decrease lifetime
    if (this.lifeTime <= 0) {
      this.alive = false;
    }
  }

}

/* Wrapper class holding multiple particles the are all created in the same origin */
class ParticleExplosion {

  constructor(x, y, number, color, width, height, speedMin, speedMax, accelerationY, lifeTimeMin, lifeTimeMax) {

    this.origin = new Point2D(x, y);
    this.number = number;
    this.color = color;

    this.width = width;
    this.height = height;

    this.particles = [];

    this.lifeTime = lifeTimeMax;
    this.lifeTimeMax = lifeTimeMax;

    for (var i = 0; i < number; i++) {
      var angle = Utils.getRandomInt(0, 360);
      var rad = Utils.degreeToRad(angle);
      var totalSpeed = Utils.getRandomInt(speedMin, speedMax);
      var speedX =  Math.cos(rad) * totalSpeed;
      var speedY =  Math.sin(rad) * totalSpeed;
      var lifeTime = Utils.getRandomFloat(lifeTimeMin, lifeTimeMax);
      var particle = new Particle(x, y, speedX, speedY, accelerationY, lifeTime);
      this.particles.push(particle);
    }

  }

  update(ellapsedTime) {

    var remainingParticles = [];

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update(ellapsedTime);
      if (this.particles[i].alive == true) {
        remainingParticles.push(this.particles[i]);
      }
    }
    this.particles = remainingParticles;
    this.lifeTime -= ellapsedTime;

  }

  isAlive() {
    return (this.lifeTime > 0);
  }
  
  draw() {
    ctx.save();
    for (var i = 0; i < this.particles.length; i++) {
      var drawX = Utils.cvtGameScaleToPixel(this.particles[i].position.x, GAME_AREA_PX.w, GAME_AREA_SIZE);
      var drawY = Utils.cvtGameScaleToPixel(this.particles[i].position.y, GAME_AREA_PX.h, GAME_AREA_SIZE);

      ctx.globalAlpha = Math.pow(this.lifeTime / this.lifeTimeMax, 3);
      ctx.fillStyle = this.color;
      ctx.fillRect(drawX, drawY, this.width, this.height);
			ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

}


/* Holds multiple ParticleExplosions and
*  creates explosions for player and enemies
*/
class ParticleManager {

  constructor() {
    this.init();
  }

  init() {
    this.explosions = [];
  }

  nextLevel() {
    this.init();
  }

  addExplosion(explosion) {
    this.explosions.push(explosion);
  }

  update(ellapsedTime) {
    for (var i = 0; i < this.explosions.length; i++) {
      this.explosions[i].update(ellapsedTime);
    }
  }

  draw() {
    for (var i = 0; i < this.explosions.length; i++) {
      this.explosions[i].draw();
    }    
  }

  createEnemyExplosion(position) {

    var numberParticles = 30;
    var size = 5;
    var minSpeed = 20, maxSpeed = 300;
    var accelerationY = 250;
    var minLifeTime = 0.5, maxLifeTime = 3;
    var color = Utils.rgbToColorString(Utils.getRandomRGBColor(128, 128, 128));

    var particleExplosion = new ParticleExplosion(
      position.x, position.y, numberParticles, color, size, size,
      minSpeed, maxSpeed, accelerationY, minLifeTime, maxLifeTime
    );

    this.addExplosion(particleExplosion);

  }

  createPlayerExplosion(position) {
    var numberParticles = 100;
    var size = 5;
    var minSpeed = 200, maxSpeed = 500;
    var accelerationY = 400;
    var minLifeTime = 1, maxLifeTime = 5;
    var color = Utils.rgbToColorString([255, 0, 0]);
  
    var particleExplosion = new ParticleExplosion(
      position.x, position.y, numberParticles, color, size, size,
      minSpeed, maxSpeed, accelerationY, minLifeTime, maxLifeTime
    );

    this.addExplosion(particleExplosion);

  }

}