let cic, fft, mic;
let currentFR = 10;
let mode = null; // null | 'record' | 'test'

// Infrared palette — same red hue, increasing saturation toward treble
const bands = [
  { name: "Bass",     key: "bass",    s: 18,  l: 22 },
  { name: "Low Mid",  key: "lowMid",  s: 38,  l: 28 },
  { name: "Mid",      key: "mid",     s: 58,  l: 35 },
  { name: "High Mid", key: "highMid", s: 80,  l: 42 },
  { name: "Treble",   key: "treble",  s: 100, l: 52 },
];

// Makes custom-styled range sliders work on iOS Safari
function makeSliderTouchFriendly(slider) {
  function handleTouch(e) {
    e.stopPropagation();
    let touch = e.touches[0];
    let rect = slider.getBoundingClientRect();
    let ratio = (touch.clientX - rect.left) / rect.width;
    let min = parseFloat(slider.min);
    let max = parseFloat(slider.max);
    let step = parseFloat(slider.step) || 1;
    let value = min + ratio * (max - min);
    value = Math.round(value / step) * step;
    value = Math.max(min, Math.min(max, value));
    slider.value = value;
    slider.dispatchEvent(new Event('input'));
  }
  slider.addEventListener('touchstart', handleTouch, { passive: false });
  slider.addEventListener('touchmove', handleTouch, { passive: false });
}

function preload() {
  cic = loadSound('cicada.mp3');
}

function setup() {
  let container = document.getElementById('canvas-container');
  let cnv = createCanvas(container.offsetWidth, container.offsetHeight);
  cnv.parent('canvas-container');

  colorMode(HSL, 360, 100, 100, 100);
  frameRate(currentFR);
  textFont('sans-serif');

  fft = new p5.FFT(0.1, 1024);
  mic = new p5.AudioIn();

  // Make all sliders touch-friendly on mobile
  ['fr-slider', 'zoom-slider'].forEach(id => {
    makeSliderTouchFriendly(document.getElementById(id));
  });

  // Frame rate slider
  let frSlider = document.getElementById('fr-slider');
  let frDisplay = document.getElementById('fr-display');
  frSlider.addEventListener('input', function () {
    currentFR = int(this.value);
    frDisplay.textContent = currentFR;
    frameRate(currentFR);
  });

  // Time resolution slider (display bins: 1–2048)
  let zoomSlider = document.getElementById('zoom-slider');
  let zoomDisplay = document.getElementById('zoom-display');
  zoomSlider.addEventListener('input', function () {
    zoomDisplay.textContent = int(this.value);
  });
}

function draw() {
  background(0, 0, 0);

  fft.analyze();
  let wave = fft.waveform();
  let energies = bands.map(b => fft.getEnergy(b.key));

  // Use exactly 1024 samples so gaps appear when displayBins > 1024
  const SAMPLES = 1024;
  let displayBins = int(document.getElementById('zoom-slider').value);
  let slots = new Array(displayBins).fill(null);
  for (let s = 0; s < SAMPLES; s++) {
    let slot = floor(s * displayBins / SAMPLES);
    if (slot < displayBins) slots[slot] = wave[s];
  }

  let totalLanes = bands.length + 1;
  let bandH = height / totalLanes;

  // ── Individual bands ─────────────────────
  for (let b = 0; b < bands.length; b++) {
    let band = bands[b];
    let centerY = bandH * b + bandH / 2;
    let amp = map(energies[b], 0, 255, 2, bandH * 0.44);

    noStroke();
    fill(0, band.s, band.l, 88);
    for (let i = 0; i < displayBins; i++) {
      if (slots[i] === null) continue; // gap — skip
      let x = map(i, 0, displayBins, 0, width);
      let y = centerY + slots[i] * amp * 20;
      ellipse(x, y, 2, 2);
    }

    // Energy bar (left edge)
    let barH = map(energies[b], 0, 255, 0, bandH * 0.75);
    noStroke();
    fill(0, band.s, band.l, 75);
    rect(0, centerY - barH / 2, 5, barH);

    // Band label + energy value
    fill(0, band.s, band.l, 60);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text(band.name + '  ' + floor(energies[b]), 12, bandH * b + 8);

    // Lane divider
    stroke(0, 0, 12, 100);
    strokeWeight(1);
    line(0, bandH * b, width, bandH * b);
  }

  // ── Combined lane — all bands overlaid ──
  let combinedCenterY = bandH * bands.length + bandH / 2;

  for (let b = 0; b < bands.length; b++) {
    let band = bands[b];
    let amp = map(energies[b], 0, 255, 2, bandH * 0.44);
    noStroke();
    fill(0, band.s, band.l, 70);
    for (let i = 0; i < displayBins; i++) {
      if (slots[i] === null) continue;
      let x = map(i, 0, displayBins, 0, width);
      let y = combinedCenterY + slots[i] * amp * 20;
      ellipse(x, y, 2, 2);
    }
  }

  // Combined lane divider
  stroke(0, 0, 12, 100);
  strokeWeight(1);
  line(0, bandH * bands.length, width, bandH * bands.length);

  // Combined label
  let avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
  fill(0, 60, 40, 60);
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  text('All  ' + floor(avgEnergy), 12, bandH * bands.length + 8);

  // Combined energy bar
  let combinedBarH = map(avgEnergy, 0, 255, 0, bandH * 0.75);
  noStroke();
  fill(0, 60, 40, 75);
  rect(0, combinedCenterY - combinedBarH / 2, 5, combinedBarH);
}

function toggleSound() {
  if (getAudioContext().state !== 'running') userStartAudio();
  if (mode === 'test') {
    if (cic.isPlaying()) cic.pause(); else cic.loop();
  }
}

function mousePressed() {
  let container = document.getElementById('canvas-container');
  let rect = container.getBoundingClientRect();
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    toggleSound();
  }
}

function touchStarted() {
  if (touches.length === 0) return;
  let tx = touches[0].x;
  let ty = touches[0].y;

  // touches[].x/y are canvas-relative, so compare directly to canvas bounds
  if (tx >= 0 && tx <= width && ty >= 0 && ty <= height) {
    toggleSound();
    return false; // prevent scroll/zoom only when touching canvas
  }
  // all other touches (sliders, buttons) pass through normally
}

function setActiveButton(id) {
  document.getElementById('btn-record').classList.remove('active');
  document.getElementById('btn-test').classList.remove('active');
  document.getElementById(id).classList.add('active');
}

function startRecord() {
  if (mode === 'record') {
    mic.stop();
    mode = null;
    document.getElementById('btn-record').classList.remove('active');
    return;
  }
  if (getAudioContext().state !== 'running') userStartAudio();
  if (cic.isPlaying()) cic.stop();
  mic.start();
  fft.setInput(mic);
  mode = 'record';
  setActiveButton('btn-record');
}

function startTest() {
  if (mode === 'test' && cic.isPlaying()) {
    cic.stop();
    mode = null;
    document.getElementById('btn-test').classList.remove('active');
    return;
  }
  if (getAudioContext().state !== 'running') userStartAudio();
  if (mic) mic.stop();
  fft.setInput(cic);
  cic.loop();
  mode = 'test';
  setActiveButton('btn-test');
}

function windowResized() {
  let container = document.getElementById('canvas-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}
