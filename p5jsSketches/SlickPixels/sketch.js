var video;
var vScale = 8;
var slider;

let mic;

let mySound;

function preload(){
  mySound = loadSound('synthesistracks2.mp3');
}

function setup() {
  createCanvas(640,480);
  pixelDensity(3);
  video = createCapture(VIDEO);
  video.size(width/vScale,height/vScale);
  slider =createSlider(0,255,80);
  //video.hide();
  
  mic = new p5.AudioIn()
  mic.start();
  
  //mySound.play();
}

function draw() {
  video.loadPixels();
  

  for(x=0;x<video.width;x++){
    for(y=0;y<video.height;y++){
      var index = (x + y * video.width)*4; //gets particular index, skips to the 4th pixel
      var r = video.pixels[index];
      var g = video.pixels[index+1];
      var b = video.pixels[index+2];
      
      var bright = ((r*0.2)+(g*0.6)+(b*0.2));
      var threshold = slider.value();
      
      if (bright > threshold){
        stroke(100,100,200);
        fill(255,0,0,0.5);}
        else {
          stroke(100,200,100);
          fill(0,0,0,0.5);        
        }

     // noStroke();
      rectMode(CENTER);
      micLevel = mic.getLevel();
      //console.log(micLevel);
      micMap = map(micLevel, 0, 0.1, 0, 20)
      ellipse(x*vScale, y*vScale, micMap);

      
      //originall had pixels = video.pixels, but created mediating variable r,g,b to calculate brightness
      
    }
  }

}