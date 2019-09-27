class Point2D {

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  get() {
    return { 'x': this.x, 'y': this.y };
  }

};


/* Rectangular class holding x,y, width, height
*  Function for detecting collision between 2 rectangles
*/
class Rect {

  constructor(x, y, w, h) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
  }

  set(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  get() {
    return {
      'x': this.x,
      'y': this.y,
      'w': this.w,
      'h': this.h
    };
  }


  static rectCollision(rect1, rect2) {
    var xCollision = (Utils.inRange(rect1.x, rect2.x, rect2.x + rect2.w)) || (Utils.inRange(rect2.x, rect1.x, rect1.x + rect1.w));
    var yCollision = (Utils.inRange(rect1.y, rect2.y, rect2.y + rect2.h)) || (Utils.inRange(rect2.y, rect1.y, rect1.y + rect1.h));
    return xCollision && yCollision;
  }



};