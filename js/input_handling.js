class InputHandler {

  constructor(blockShootTime) {

    this.blockShootTime = blockShootTime;
    this.init();

    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    
    this.KEY_LEFT = 37;
    this.KEY_RIGHT = 39;
    // this.KEY_SHOOT = 40; // Arrow down key
    this.KEY_SHOOT = 32; // space bar
    this.KEY_ENTER = 13;
    this.keys = [this.KEY_LEFT, this.KEY_RIGHT, this.KEY_SHOOT, this.KEY_ENTER];
    
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);  
  }

  init() {
    this.keyStates = [];
    this.lastShootTime = null;
    this.enterWasPressed = false;
  }

  nextLevel() {
    this.init();
  }

  keyDown(e) {
    if (this.keys.includes(e.keyCode)) {
      e.preventDefault();
      this.keyStates[e.keyCode] = true;

      if (e.keyCode == this.KEY_ENTER) {
        this.enterWasPressed = true;
      }

    }
  }

  keyUp(e) {
    if (this.keys.includes(e.keyCode)) {
      e.preventDefault();
      this.keyStates[e.keyCode] = false;
    }
  }

  isLeftKeyDown() {
    return this.keyStates[this.KEY_LEFT];
  }

  isRightKeyDown() {
    return this.keyStates[this.KEY_RIGHT];
  }

  wasEnterPressed() {
    if (this.enterWasPressed) {
      this.enterWasPressed = false;
      return true;
    }
    return false;
  }

  isShootKeyDown() {
    
    var now = Date.now();

    if (!this.lastShootTime) {
      this.lastShootTime = now;
      if (this.keyStates[this.KEY_SHOOT]) return true;
    }
    
    if ((now - this.lastShootTime) > this.blockShootTime) {
      if (this.keyStates[this.KEY_SHOOT]) {
        this.lastShootTime = now;
        return true;
      }
    }
    else {
      return false;
    }

  }

  getState() {
    return {
      isShootKeyDown: this.isShootKeyDown(),
      isLeftKeyDown: this.isLeftKeyDown(),
      isRightKeyDown: this.isRightKeyDown()
    }
  }

}