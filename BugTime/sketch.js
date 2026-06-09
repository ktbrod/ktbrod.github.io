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

// Rolling history: each entry is an object { wave, energies }
let history = [];
let columnsPerSnapshot = 1;

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
    fft = new p5.FFT(0.1, bins);
    if (mode === 'record') fft.setInput(mic);
    if (mode === 'test')   fft.setInput(cic);
    history = [];
  });

  // Detail / History zoom slider
  let zoomSlider = document.getElementById('zoom-slider');
  let zoomDisplay = document.getElementById('zoom-display');
  zoomSlider.addEventListener('input', function () {
    columnsPerSnapshot = int(this.value);
    zoomDisplay.textContent = columnsPerSnapshot;
    history = [];
  });

}

function draw() {
  background(0, 0, 0);

  // ── Capture current frame ────────────────
  fft.analyze();
  let wave = fft.waveform();
  let energies = bands.map(b => fft.getEnergy(b.key));

  // Store a downsampled snapshot (every 4th sample keeps it manageable)
  let snapshot = [];
  for (let i = 0; i < wave.length; i += 4) {
    snapshot.push(wave[i]);
  }
  history.push({ wave: snapshot, energies });
  let maxHistory = floor(width / columnsPerSnapshot);
  if (history.length > maxHistory) history.shift();

  // ── Draw ─────────────────────────────────
  let bandH = height / bands.length;

  for (let b = 0; b < bands.length; b++) {
    let band = bands[b];
    let centerY = bandH * b + bandH / 2;

    noStroke();
    fill(0, band.s, band.l, 88);

    for (let i = 0; i < history.length; i++) {
      let snap = history[i];
      let amp = map(snap.energies[b], 0, 255, 2, bandH * 0.44);
      let x0 = i * columnsPerSnapshot;

      // Spread samples across columnsPerSnapshot columns
      for (let s = 0; s < snap.wave.length; s++) {
        let x = x0 + map(s, 0, snap.wave.length, 0, columnsPerSnapshot);
        let y = centerY + snap.wave[s] * amp * 20;
        ellipse(x, y, 2, 2);
      }
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
    history = [];
    document.getElementById('btn-record').classList.remove('active');
    return;
  }
  if (getAudioContext().state !== 'running') userStartAudio();
  if (cic.isPlaying()) cic.stop();
  mic.start();
  fft.setInput(mic);
  mode = 'record';
  history = [];
  setActiveButton('btn-record');
}

function startTest() {
  if (mode === 'test' && cic.isPlaying()) {
    cic.stop();
    mode = null;
    history = [];
    document.getElementById('btn-test').classList.remove('active');
    return;
  }
  if (getAudioContext().state !== 'running') userStartAudio();
  if (mic) mic.stop();
  fft.setInput(cic);
  cic.loop();
  mode = 'test';
  history = [];
  setActiveButton('btn-test');
}

function windowResized() {
  let container = document.getElementById('canvas-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
  history = [];
}
