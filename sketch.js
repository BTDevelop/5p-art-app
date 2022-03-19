const seed = "1008000"

let palette;
let g;
let current = seed;
let texture;
function onload(){
    for(var i = 0; i < 1000; i++){
      setTimeout(() => { 
        draw();
        save();
      }, 50 * 1000);
    }
}

function save(){
  var canvas = document.getElementById('defaultCanvas0')
  var link = document.createElement('a');
  link.download = generateUUID() + '.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

function setup() {
  createCanvas(1600, 1600);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);

  texture = createGraphics(width, height);
  texture.colorMode(HSB, 360, 100, 100, 100);
  texture.angleMode(DEGREES);

  texture.stroke(0, 0, 0, 1);
  for (let i = 0; i < (width * height * 1) / 100; i++) {
    let x = random(width);
    let y = random(height);
    let angle = 90 + random(15) * (random(100) > 50 ? -1 : 1);
    let d = width / 10;
    texture.line(
      x + cos(angle) * d,
      y + sin(angle) * d,
      x + cos(angle + 180) * d,
      y + sin(angle + 180) * d
    );
  }
}

function draw() {
  clear();
  var uuid = generateUUID();
  palette = shuffle(createPalette(uuid), true);
  // randomSeed(current);
  noiseSeed(current);

  let offset = width / 10;
  let x = offset;
  let y = offset;
  let w = width - offset * 2;
  let h = height - offset * 2;

  let c = palette[0];
  palette.shift();

  push();
  fill(c);
  strokeWeight(30); //30
  stroke(c);
  let nScale = random(60, 200); //60
  drawShape(x + w / 2, y + h / 2, (w * 3) / 8, nScale);
  drawingContext.clip();
  drawGraphic(0, 0, width, height, palette, this);
  pop();

  g = get();

  background(random(palette));

  let area = detectEdge(g);
  rectMode(CORNERS);
  let center = detectCenter(area);
  let v = p5.Vector.sub(
    createVector(width / 2, height / 2),
    createVector(center.x, center.y)
  );

  push();
  imageMode(CENTER);
  translate(v.x + g.width / 2, v.y + g.height / 2);
  drawingContext.shadowColor = color(0, 0, 0, 50);
  drawingContext.shadowBlur = max(width, height) / 20;
  drawingContext.shadowOffsetY = max(width, height) / 40;

  image(g, 0, 0);
  pop();
  image(texture, 0, 0);

  //   frameRate(1 / 3);
  noLoop()
}

function detectCenter(area) {
  let x = lerp(area.minX, area.maxX, 0.5);
  let y = lerp(area.minY, area.maxY, 0.5);
  let w = abs(area.maxX - area.minX);
  let h = abs(area.maxY - area.minY);
  return {
    x: x,
    y: y,
    w: w,
    h: h,
  };
}

function detectEdge(g) {
  let minX, minY, maxX, maxY;
  minX = g.width;
  minY = g.height;
  maxX = 0;
  maxY = 0;
  g.loadPixels();
  for (let j = 0; j < g.height; j++) {
    for (let i = 0; i < g.width; i++) {
      let n = i * 4 + j * g.width * 4 + 3;
      let alpha = g.pixels[n];
      if (alpha > 0) {
        minX = min(minX, i);
        minY = min(minY, j);
        maxX = max(maxX, i);
        maxY = max(maxY, j);
      }
    }
  }
  return {
    minX: minX,
    minY: minY,
    maxX: maxX,
    maxY: maxY,
  };
}

function drawGraphic(x, y, w, h, colors, target) {
  let g = createGraphics(w / 2, h);
  g.angleMode(DEGREES);
  let gx = 0;
  let gy = 0;
  let gxStep, gyStep;

  if (random() > 0.5) {
    while (gy < g.height) {
      gyStep = random(g.height / 100, g.height / 5);
      if (gy + gyStep > g.height || g.height - (gy + gyStep) < g.height / 20) {
        gyStep = g.height - gy;
      }
      gx = 0;
      while (gx < g.width) {
        gxStep = gyStep;
        if (gx + gxStep > g.width || g.width - (gx + gxStep) < g.width / 10) {
          gxStep = g.width - gx;
        }
        // g.ellipse(gx+gxStep/2,gy+gyStep/2,gxStep,gyStep);
        drawPattern(g, gx, gy, gxStep, gyStep, colors);
        gx += gxStep;
      }
      gy += gyStep;
    }
  } else {
    while (gx < g.width) {
      gxStep = random(g.width / 100, g.width / 5);
      if (gx + gxStep > g.width || g.width - (gx + gxStep) < g.width / 20) {
        gxStep = g.width - gx;
      }
      gy = 0;
      while (gy < g.height) {
        gyStep = gxStep;
        if (gy + gyStep > g.height || g.height - (gy + gyStep) < g.height / 10) {
          gyStep = g.height - gy;
        }
        // g.ellipse(gx+gxStep/2,gy+gyStep/2,gxStep,gyStep);
        drawPattern(g, gx, gy, gxStep, gyStep, colors);
        gy += gyStep;
      }
      gx += gxStep;
    }
  }

  target.push();
  target.translate(x + w / 2, y + h / 2);
  target.imageMode(CENTER);
  target.scale(1, 1);
  target.image(g, -g.width / 2, 0);
  target.scale(-1, 1);
  target.image(g, -g.width / 2, 0);
  target.pop();
}

function drawPattern(g, x, y, w, h, colors) {
  let rotate_num = (int(random(4)) * 360) / 4;
  g.push();
  g.translate(x + w / 2, y + h / 2);
  g.rotate(rotate_num);
  if (rotate_num % 180 == 90) {
    let tmp = w;
    w = h;
    h = tmp;
  }
  g.translate(-w / 2, -h / 2);
  g.drawingContext.shadowColor = color(0, 0, 0, 33);
  g.drawingContext.shadowBlur = max(w, h) / 5;
  let sep = int(random(1, 6));

  let c = -1,
    pc = -1;
  g.stroke(0, (20 / 100) * 255);

  switch (int(random(8))) {
    case 0:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.scale(i);
        g.strokeWeight(1 / i);
        g.fill(c);
        g.arc(0, 0, w * 2, h * 2, 0, 90);
        g.pop();
      }
      break;
    case 1:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.fill(c);

        g.push();
        g.translate(w / 2, 0);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.arc(0, 0, w, h, 0, 180);
        g.pop();

        g.push();
        g.translate(w / 2, h);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.arc(0, 0, w, h, 0 + 180, 180 + 180);
        g.pop();
        g.pop();
      }
      break;
    case 2:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.fill(c);

        g.push();
        g.scale(i);
        g.strokeWeight(1 / i);
        g.arc(0, 0, w * sqrt(2), h * sqrt(2), 0, 90);
        g.pop();

        g.push();
        g.translate(w, h);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.arc(0, 0, w * sqrt(2), h * sqrt(2), 0 + 180, 90 + 180);
        g.pop();

        g.pop();
      }
      break;
    case 3:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.translate(w / 2, h / 2);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.fill(c);
        g.ellipse(0, 0, w, h);
        g.pop();
      }
      break;
    case 4:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.scale(i);
        g.strokeWeight(1 / i);
        g.fill(c);
        g.triangle(0, 0, w, 0, 0, h);
        g.pop();
      }
      break;
    case 5:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.fill(c);

        g.push();
        g.translate(w / 2, 0);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.triangle(-w / 2, 0, w / 2, 0, 0, h / 2);
        g.pop();

        g.push();
        g.translate(w / 2, h);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.triangle(-w / 2, 0, w / 2, 0, 0, -h / 2);
        g.pop();
        g.pop();
      }
      break;
    case 6:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.fill(c);

        g.push();
        g.scale(i);
        g.strokeWeight(1 / i);
        g.triangle(0, 0, w * sqrt(2), 0, 0, h * sqrt(2));
        g.pop();

        g.push();
        g.translate(w, h);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.arc(0, 0, -w * sqrt(2), 0, 0, -h * sqrt(2));
        g.pop();

        g.pop();
      }
      break;
    case 7:
      for (let i = 1; i > 0; i -= 1 / sep) {
        while (pc == c) {
          c = random(colors);
        }
        pc = c;
        g.push();
        g.translate(w / 2, h / 2);
        g.rotate(45);
        g.scale(i);
        g.strokeWeight(1 / i);
        g.fill(c);
        g.rectMode(CENTER);
        g.square(0, 0, sqrt(sq(w) + sq(h)));
        g.pop();
      }
      break;
  }
  g.pop();
}

function createPalette(_url) {
  let slash_index = _url.lastIndexOf("/");
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split("-");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = color("#" + arr[i]);
  }
  return arr;
}

function drawShape(cx, cy, r, nPhase) {
  push();
  translate(cx, cy, r);
  rotate(-90);
  let arr = [];
  beginShape();
  for (let angle = 0; angle < 180; angle += 1) {
    let nr = map(noise(cx, cy, angle / nPhase, r), 0, 1, (r * 1), r);
    nr = constrain(nr, 0, width / 2);
    arr.push(nr);
    let x = cos(angle) * nr;
    let y = sin(angle) * nr;
    vertex(x, y);
  }
  arr.reverse();
  for (let angle = 180; angle < 180 + 180; angle += 1) {
    let nr = arr[0];
    arr.shift();
    let x = cos(angle) * nr;
    let y = sin(angle) * nr;
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

function generateUUID() { 
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}