var canvas,
    circles, drawBg, maxHue, maxSat, maxB, maxA, bkColor,
    drawStroke, minRadius, maxRadius, maxOutset, minOutset, set;

function setup() {
    noCursor();
    canvas = createCanvas(windowWidth, windowHeight).parent('container');
    maxHue = 360;
    maxSat = 100;
    maxB = 100;
    maxA = 1;
    colorMode(HSB, maxHue, maxSat, maxB, maxA);
    blendMode(REPLACE);
    //
    circles = populateCircles(300);
    drawBg = false;
    bkColor = 0;
    drawStroke = false;
    minRadius = 3;
    maxRadius = 3;
    maxOutset = height - 250;
    minOutset = -200;
    set = mandlebrot(width, height, 50);
}

function draw() {
    if(drawBg) background(bkColor, 0, 0, 0);
    if(drawStroke) {
        stroke(0);
        strokeWeight(2.0);
    } else {
        noStroke();
    }

    var i;
    for(i = 0; i < circles.length; i++) {
        var circle = circles[i];
        vertex(circle.x, circle.y);
        circle.draw();
        circle.step(set[Math.floor(random(set.length))]);
    }

    fill(45, 0, 0, 0);
    ellipse(mouseX, mouseY, 10, 10);
}

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = { hue: 145, sat: 0, b: 0, a: 1 };
}

Circle.prototype.draw = function() {
    push();
    fill(this.color.hue, this.color.sat, this.color.b, this.color.a);
    ellipse(this.x, this.y, this.radius, this.radius);
    pop();
};

Circle.prototype.step = function(point) {
    this.radius = constrain(point.x * point.y, minRadius, maxRadius);
    this.color.hue = map(point.x, 0, width, 25, maxHue);
    this.color.sat = map(point.y, 0, height, 55, maxSat);
    this.color.b = map(point.x, 0, width, 45, maxB);
    this.color.a = map(point.y, 0, height, 75, maxA);

    this.y = height / 2 + sin(map(point.y, 0, height, 0, 360)) * constrain(point.x * point.y, minOutset, maxOutset);
    this.x = width / 2 + cos(map(point.x, 0, width, 0, 360)) * constrain(point.x * point.y, minOutset, maxOutset);
};

function populateCircles(num) {
    var circles = [];
    var i;
    for(i = 0; i < num; i++) {
        var circle = new Circle(random(100, width - 100), random(100, height - 100), 50, 50);
        circles.push(circle);
    }
    return circles;
}

function keyPressed() {
    if(keyCode === CONTROL) {
        drawStroke = !drawStroke;
    } else if(keyCode === ALT) {
        drawBg = !drawBg;
    }
}

function keyTyped() {
    if(key === 'w') {
        minRadius += 1;
    } else if(key === 's') {
        minRadius -= 1;
    } else if(key === 'a'){
        maxRadius -= 1;
    } else if(key === 'd') {
        maxRadius += 1;
    } else if(key === 'r') {
        if(sound) {
            sound.jump();
        }
    }
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.resize(w, h);
  width = w;
  height = h;
}

function mandlebrot(width, height, max) {
  var set = [];
  var row;
  for(row = 0; row < height; row++)
    for(var col = 0; col < width; col++) {
      var c_re = (col - width / 2.0) * 4.0 / width;
      var c_im = (row - height / 2.0) * 4.0 / width;

      var x = 0, y = 0;
      var iteration = 0;
      while(sq(x) + sq(y) <= 4 && iteration < max) {
        var x_new = sq(x) - sq(y) + c_re;
        y = 2 * x * y + c_im;
        x = x_new;
        iteration++;
      }
      if(iteration < max) {
        // do nothin' bitch
      }
      else {
        set.push({x: col, y: row});
      }
    }
    return set;
}
