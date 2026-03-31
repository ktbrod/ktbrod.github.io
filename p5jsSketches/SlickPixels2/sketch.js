var video;
var vScale = 4;
var slider;

let mic;
let osc;
let frequency= 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width/vScale,height/vScale);
  slider =createSlider(0,255,80);
  //video.hide();
  
  colorMode(HSL);
  
  mic = new p5.AudioIn()
  mic.start();
  
  //sound
  osc = new p5.Oscillator('square');
  osc.amp(0.1);
  osc.freq(frequency);
  delay = new p5.Delay();

  // delay.process() accepts 4 parameters:
  // source, delayTime (in seconds), feedback, filter frequency
  delay.process(osc, 0.8, 0.7, 2300);
}

function draw() {
  video.loadPixels();
  rando = random(0,1);
  let c = random(0,50);
  console.log(c);
  for(x=0;x<video.width;x++){
    for(y=0;y<video.height;y++){
      var index = (x + y * video.width)*4; //gets particular index, skips to the 4th pixel
      var r = video.pixels[index];
      var g = video.pixels[index+1];
      var b = video.pixels[index+2];
      
      var bright = ((r*0.2)+(g*0.6)+(b*0.2));
      var threshold = slider.value();
      
      if (bright > threshold){
        stroke(c,c,50);
        fill(c,c,50);}
        else {
          stroke(0);
          fill(0);        
        }

     // noStroke();
      rectMode(CENTER);
      micLevel = mic.getLevel();
      //console.log(micLevel);
      micMap = map(micLevel, 0, 0.1, 0, 20)
      ellipse(x*vScale*micMap, y*vScale*rando, micMap);
      frequency = bright;
      
      //originall had pixels = video.pixels, but created mediating variable r,g,b to calculate brightness
      
    }
  }

}

function mousePressed(){
  osc.start();
  console.log(frequency);
}

function mouseReleased() {
  osc.stop();
}