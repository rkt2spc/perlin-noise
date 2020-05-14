const themes = [
  () => { background(0); document.documentElement.style.background = "rgb(0,0,0)"; fill(255); stroke(0); },
  () => { background(0); document.documentElement.style.background = "rgb(0,0,0)"; noFill(); stroke(255); },
  () => { background(255); document.documentElement.style.background = "rgb(255,255,255)"; noFill(); stroke(0); },
  () => { background(255); document.documentElement.style.background = "rgb(255,255,255)"; fill(0); stroke(255); },
]
let currentTheme = 0;
let currentOrientation = undefined;
let xOffset = 0;
let yOffset = 0;

function setup() {
  createCanvas(window.screen.width, window.screen.height, WEBGL);
}

document.addEventListener('DOMContentLoaded', () => {
  const hammertime = new Hammer(document.body);
  hammertime.get('doubletap').set({ interval: 2000 });
  hammertime.on('doubletap swipe', () => {
    currentTheme = (currentTheme + 1) % themes.length;
  })
});


function reconcileTheme() {
  themes[currentTheme]();
}                                                      

function reconcileDimensions() {
  if (window.orientation === undefined) return;
  if (window.orientation === currentOrientation) return;

  currentOrientation = window.orientation;
  if (currentOrientation / 90 % 2 !== 0) {
    resizeCanvas(window.screen.height, window.screen.width);
  } else {
    resizeCanvas(window.screen.width, window.screen.height);
  }
}

function z(x, y) {
  const variationRate = 0.05;
  const variation = noise((x + xOffset) * variationRate, (y + yOffset) * variationRate);
  return map(variation, 0, 1, -50, 250)
}

function draw() {
  reconcileTheme();
  reconcileDimensions();

  const meshDesiredWidth =  Math.round(width / 2);
  const meshDesiredHeight = Math.round(height / 2);

  const rows = Math.min(50, Math.round(meshDesiredHeight / 10));
  const columns = Math.min(80, Math.round((meshDesiredWidth / meshDesiredHeight) * rows));

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
