class BaseObject {

  constructor(x, y, clipRect, targetWidthGame, targetHeightGame, canvasSizePx) {

    this.clipRect = clipRect; // clip rectangle in sprite sheet
    this.canvasSizePx = canvasSizePx;
    this.bounds = new Rect(x, y, targetWidthGame, targetHeightGame);
    this.targetRectPx = new Rect(0, 0, 0, 0);
    this.updateBounds(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);

  }

  setClipRect(clipRect) {
    this.clipRect = clipRect;
  }
  gameSize
  /* Calc rectangle position in pixel in the game canvas */
  updateTargetRect() {
    this.targetRectPx.x = Utils.cvtGameScaleToPixel(this.bounds.x, this.canvasSizePx, GAME_AREA_SIZE);
    this.targetRectPx.y = Utils.cvtGameScaleToPixel(this.bounds.y, this.canvasSizePx, GAME_AREA_SIZE);
    this.targetRectPx.w = Utils.cvtGameScaleToPixel(this.bounds.w, this.canvasSizePx, GAME_AREA_SIZE);
    this.targetRectPx.h = Utils.cvtGameScaleToPixel(this.bounds.h, this.canvasSizePx, GAME_AREA_SIZE);
  }

  /* Bounds in Game Area that is GAME_AREA_SIZE units high and wide */
  updateBounds(x, y, w, h) {
    // Calc position and size in canvas in px
    this.bounds.x = x;
    this.bounds.y = y;
    this.bounds.w = w;
    this.bounds.h = h;
    this.updateTargetRect();
  }

  updateCanvasSize(canvasSizePx) {
    this.canvasSizePx = canvasSizePx;
    this.updateBounds(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
  }

  draw() {
    ctx.drawImage(SpriteSheet.spriteSheetImage,
      this.clipRect.x, this.clipRect.y, this.clipRect.w, this.clipRect.h,
      this.targetRectPx.x, this.targetRectPx.y, this.targetRectPx.w, this.targetRectPx.h);
  }

}