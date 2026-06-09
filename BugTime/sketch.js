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

  fft = new p5.FFT(0.8, 1024);
  mic = new p5.AudioIn();

  // Frame rate slider
  let frSlider = document.getElementById('fr-slider');
  let frDisplay = document.getElementById('fr-display');
  frSlider.addEventListener('input', function () {
    currentFR = int(this.value);
    frDisplay.textContent = currentFR;
    frameRate(currentFR);
  });

  // FFT Bins slider (powers of 2: 32, 64, 128, 256, 512, 1024)
  const binSteps = [32, 64, 128, 256, 512, 1024];
  let binsSlider = document.getElementById('bins-slider');
  let binsDisplay = document.getElementById('bins-display');
  binsSlider.addEventListener('input', function () {
    let bins = binSteps[int(this.value)];
    binsDisplay.textContent = bins;
    fft = new p5.FFT(parseFloat(document.getElementById('smooth-slider').value), bins);
    if (mode === 'record') fft.setInput(mic);
    if (mode === 'test')   fft.setInput(cic);
  });

  // Smoothing slider
  let smoothSlider = document.getElementById('smooth-slider');
  let smoothDisplay = document.getElementById('smooth-display');
  smoothSlider.addEventListener('input', function () {
    let val = parseFloat(this.value);
    smoothDisplay.textContent = val.toFixed(2);
    fft.smooth(val);
  });
}

function draw() {
  noStroke();
  fill(0, 0, 0, 18);
  rect(0, 0, width, height);

  // ── Visualize ───────────────────────────
  fft.analyze();
  let wave = fft.waveform();
  let bandH = height / bands.length;

  for (let b = 0; b < bands.length; b++) {
    let band = bands[b];
    let energy = fft.getEnergy(band.key);
    let centerY = bandH * b + bandH / 2;
    let amp = map(energy, 0, 255, 2, bandH * 0.44);

    // Waveform dots
    noStroke();
    fill(0, band.s, band.l, 88);
    for (let i = 0; i < wave.length; i++) {
      let x = map(i, 0, wave.length, 0, width);
      let y = centerY + wave[i] * amp * 2.5;
      ellipse(x, y, 3, 3);
    }

    // Energy bar (left edge)
    let barH = map(energy, 0, 255, 0, bandH * 0.75);
    noStroke();
    fill(0, band.s, band.l, 75);
    rect(0, centerY - barH / 2, 5, barH);

    // Band label + energy value
    fill(0, band.s, band.l, 60);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text(band.name + '  ' + floor(energy), 12, bandH * b + 8);

    // Lane divider
    stroke(0, 0, 12, 100);
    strokeWeight(1);
    line(0, bandH * b, width, bandH * b);
  }
}

function setActiveButton(id) {
  document.getElementById('btn-record').classList.remove('active');
  document.getElementById('btn-test').classList.remove('active');
  document.getElementById(id).classList.add('active');
}

function startRecord() {
  if (getAudioContext().state !== 'running') userStartAudio();
  if (cic.isPlaying()) cic.stop();
  mic.start();
  fft.setInput(mic);
  mode = 'record';
  setActiveButton('btn-record');
}

function startTest() {
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
