let fft, mic;
let currentFR = 10;
let mode = null; // null | 'record' | 'cicada' | 'katydid' | 'grasshopper' | 'cricket'

// Fixed notches for the Temporal Resolution slider
const resolutionLevels = [8, 16, 32, 64, 128, 256, 512, 1024];

let sounds = {}; // key -> p5.SoundFile
const soundFiles = {
  cicada:      'cicada.mp3',
  katydid:     'katydids.mp3',
  grasshopper: 'grasshoppers.mp3',
  cricket:     'Crickets.mp3',
};

// Infrared palette — same red hue, increasing saturation toward treble
const bands = [
  { name: "Bass",     key: "bass",    s: 12,  l: 35 },
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
  for (let key in soundFiles) {
    sounds[key] = loadSound(soundFiles[key]);
  }
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

  // Temporal resolution slider — fixed notches via resolutionLevels
  let zoomSlider = document.getElementById('zoom-slider');
  let zoomDisplay = document.getElementById('zoom-display');
  zoomSlider.addEventListener('input', function () {
    zoomDisplay.textContent = resolutionLevels[int(this.value)];
  });
}

function draw() {
  background(0, 0, 0);

  fft.analyze();
  let wave = fft.waveform();
  let energies = bands.map(b => fft.getEnergy(b.key));

  // Use exactly 1024 samples so gaps appear when displayBins > 1024
  const SAMPLES = 1024;
  let displayBins = resolutionLevels[int(document.getElementById('zoom-slider').value)];
  let slots = new Array(displayBins).fill(null);
  for (let s = 0; s < SAMPLES; s++) {
    let slot = floor(s * displayBins / SAMPLES);
    if (slot < displayBins) slots[slot] = wave[s];
  }

  // Dots stay full-size up to 2048, then shrink as displayBins grows
  // further, so gaps between real samples become visible instead of
  // being masked by overlapping dots.
  let dotSize = displayBins <= 2048 ? 2 : constrain((2 * 2048) / displayBins, 0.6, 2);

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
      ellipse(x, y, dotSize, dotSize);
    }

    // Energy bar (left edge)
    let barH = map(energies[b], 0, 255, 0, bandH * 0.75);
    noStroke();
    fill(0, band.s, band.l, 75);
    rect(0, centerY - barH / 2, 5, barH);

    // Band label + energy value
    fill(0, band.s, band.l, 60);
    noStroke();
    textSize(20);
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
      ellipse(x, y, dotSize, dotSize);
    }
  }

  // Combined lane divider
  stroke(0, 0, 12, 100);
  strokeWeight(1);
  line(0, bandH * bands.length, width, bandH * bands.length);

  // Combined label — colored to match the Treble band
  let avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
  let trebleBand = bands[bands.length - 1];
  fill(0, trebleBand.s, trebleBand.l, 60);
  noStroke();
  textSize(20);
  textAlign(LEFT, TOP);
  text('All  ' + floor(avgEnergy), 12, bandH * bands.length + 8);

  // Combined energy bar
  let combinedBarH = map(avgEnergy, 0, 255, 0, bandH * 0.75);
  noStroke();
  fill(0, trebleBand.s, trebleBand.l, 75);
  rect(0, combinedCenterY - combinedBarH / 2, 5, combinedBarH);
}

const allButtonIds = ['btn-record', 'btn-cicada', 'btn-katydid', 'btn-grasshopper', 'btn-cricket'];

function setActiveButton(id) {
  allButtonIds.forEach(b => document.getElementById(b).classList.remove('active'));
  if (id) document.getElementById(id).classList.add('active');
}

function stopCurrent() {
  if (mode === 'record') {
    mic.stop();
  } else if (mode && sounds[mode]) {
    sounds[mode].stop();
  }
  mode = null;
  setActiveButton(null);
}

function startRecord() {
  if (mode === 'record') {
    stopCurrent();
    return;
  }
  stopCurrent();
  mode = 'record';
  setActiveButton('btn-record');
  ensureAudioStarted(() => {
    mic.start();
    // Mobile mics often apply automatic gain control / noise
    // suppression, which makes their output much quieter than a
    // desktop mic. Boost the signal to compensate.
    mic.amp(4);
    fft.setInput(mic);
  });
}

function startTest(key) {
  if (mode === key) {
    stopCurrent();
    return;
  }
  stopCurrent();
  mode = key;
  setActiveButton('btn-' + key);
  ensureAudioStarted(() => {
    let snd = sounds[key];
    fft.setInput(snd);
    snd.loop();
  });
}

// On mobile, the audio context may take a moment to resume after a
// user gesture, and starting a sound before it's "running" can
// silently fail. Wait for it to actually resume before playing.
function ensureAudioStarted(callback) {
  if (getAudioContext().state === 'running') {
    callback();
    return;
  }
  userStartAudio().then(() => {
    callback();
  });
}

function windowResized() {
  let container = document.getElementById('canvas-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}
