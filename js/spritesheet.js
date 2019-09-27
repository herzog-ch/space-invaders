var SpriteSheet = {

  // SPRITE SHEET POSITIONS //
  clipRectAlien1: new Rect(2, (2035 - 1789 - 30 + 3), 26, 26),
  clipRectAlien1Toggled: new Rect(35, (2035 - 1789 - 30 + 3), 26, 26),
  clipRectAlien2: new Rect(72, (2035 - 1789 - 30 + 3), 26, 26),
  clipRectAlien2Toggled: new Rect(105, (2035 - 1789 - 30 + 3), 26, 26),
  clipRectAlien3: new Rect(146, (2035 - 1789 - 26), 26, 26),
  clipRectAlien3Toggled: new Rect(178, (2035 - 1789 - 26), 26, 26),

  clipRectBullet: new Rect(408, (2035 - 1664 - 18), 4, 18),
  clipRectPlayer: new Rect(276, (2035 - 1790 - 17), 27, 17),

  // SPRITE SHEET IMAGE AND LOADING // 
  spriteSheetImage: new Image(),
  loadSpriteSheet: function(callback, context = this) {
    context.spriteSheetImage.onload = function() {
      callback();
    };
    context.spriteSheetImage.src = SPRITESHEET_SRC;
  }

};