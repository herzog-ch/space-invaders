/* Util functions that are needed across different modules */
var Utils = {

  inRange: function(value, min, max) {
    return (value >= min) && (value <= max);
  },

  getRandomFloat: function(lower, upper) {
    return Math.random() * (upper - lower) + lower;
  },

  getRandomInt: function(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  },

  clip: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  cvtGameScaleToPixel: function(gameValue, canvasSizePx, gameSize) {
    return Math.floor((gameValue / gameSize * canvasSizePx) + 0.5);
  },

  roundToInt: function(value) {
    return Math.floor(0.5 + value);
  },

  degreeToRad: function(value) {
    return (value * Math.PI/ 180);
  },

  getRandomRGBColor: function(rMin, gMin, bMin) {
    var r = this.getRandomInt(rMin, 255);
    var g = this.getRandomInt(gMin, 255);
    var b = this.getRandomInt(bMin, 255);
    return [r, g, b];
  },

  rgbToColorString: function(rgbArray) {
    var rgbString = 'rgb(' + rgbArray[0] + ', ' + rgbArray[1] + ', ' + rgbArray[2] + ')';
    return rgbString;
  }

};