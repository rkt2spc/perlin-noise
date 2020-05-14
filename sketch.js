const themes = [
  () => { background(0); fill(255); stroke(0); },
  () => { background(0); noFill(); stroke(255); },
  () => { background(255); noFill(); stroke(0); },
  () => { background(255); fill(0); stroke(255); },
]
let currentTheme = 0;
let lastClick = null;
let xOffset = 0;
let yOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  background(0);
  fill(255);
  stroke(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  const currentClick = Date.now();
  if (lastClick && (currentClick - lastClick) < 500) {
    currentTheme = (currentTheme + 1) % themes.length;
    lastClick = null;
  }

  lastClick = currentClick;
}

function applyTheme() {
  themes[currentTheme]();
}

function z(x, y) {
  const variationRate = 0.05;
  const variation = noise((x + xOffset) * variationRate, (y + yOffset) * variationRate);
  return map(variation, 0, 1, -50, 250)
}

function draw() {
  applyTheme();

  const meshDesiredWidth = Math.round(width / 2);
  const meshDesiredHeight = Math.round(height / 2);

  const rows = Math.round(50);
  const columns = Math.round((width / height) * rows);

  const scale = Math.min(meshDesiredWidth / columns, meshDesiredHeight / rows);

  const meshWidth = columns * scale;
  const meshHeight = rows * scale;

  translate(-meshWidth / 2, -meshHeight / 2);
  rotateX(radians(40));
  
  xOffset += (mouseX < (width / 2) ? 1 : -1) * 0.25;
  yOffset += (mouseY < (height / 2) ? 1 : -1) * 0.25;

  for (let r = 0; r < rows; r++) {
    beginShape(TRIANGLE_STRIP);
    for (let c = 0; c < columns - 1; c++) {
      vertex(c * scale, r * scale, z(c, r));
      vertex(c * scale, (r + 1) * scale, z(c, r + 1));
    }
    endShape();
  }
}
