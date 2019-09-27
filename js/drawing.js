/* Basic drawing functions for the game canvas
*  Drawing texts, clearing canvas
*/


function drawRect(x, y, w, h, rgbArray) {
  ctx.save();
  ctx.fillStyle = Utils.rgbToColorString(rgbArray);
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}


function clearCanvas() {
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX);
  ctx.restore();
}

function drawText(x, y, text, fontSize, rgbArray) {
  ctx.save();
  var fontStr = String(fontSize) + 'px ' + 'PressStart2P';
  ctx.font = fontStr;
  ctx.fillStyle = Utils.rgbToColorString(rgbArray);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawTextCenter(x, y, text, fontSize, rgbArray) {
  ctx.save();
  var fontStr = String(fontSize) + 'px ' + 'PressStart2P';
  ctx.font = fontStr;
  var textWidth = ctx.measureText(text).width;
  ctx.restore();
  drawText(x - (textWidth/2), y, text, fontSize, rgbArray);
}

function drawTextRightAligned(x, y, text, fontSize, rgbArray) {
  ctx.save();
  var fontStr = String(fontSize) + 'px ' + 'PressStart2P';
  ctx.font = fontStr;
  var textWidth = ctx.measureText(text).width;
  ctx.restore();
  drawText(x - textWidth, y, text, fontSize, rgbArray);
}


function flashingText(x, y, text, fontSize, rgbArray, flashMilliseconds) {
  var now = Date.now();
  if ((Utils.roundToInt(now / flashMilliseconds) % 2) == 0) {
    drawText(x, y, text, fontSize, rgbArray);
  }
}

function flashingTextCenter(x, y, text, fontSize, rgbArray, flashMilliseconds) {
  var now = Date.now();
  if ((Utils.roundToInt(now / flashMilliseconds) % 2) == 0) {
    drawTextCenter(x, y, text, fontSize, rgbArray);
  }
}