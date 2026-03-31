let durhamWeather;
let temps = [];
let time = [];

let d = 0;

let sine;
let video;


function preload() {
  durhamWeather = loadJSON("https://api.open-meteo.com/v1/forecast?latitude=35.994&longitude=-78.8986&hourly=temperature_2m&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit");
}

function setup() {
  pixelDensity(1);
  createCanvas(700, 500);
  temps = durhamWeather.hourly.temperature_2m;
  console.log(temps);
  time = durhamWeather.hourly.time;
  console.log(time);
  sine = new p5.SinOsc();
  sine.start();
  
  video = createCapture(VIDEO); // Start the video capture
  video.size(640, 480); // Set the video resolution
  video.hide(); // Hide the extra HTML video element p5.js creates
  console.log(video);
  
}

function draw() {
  //background(0);
  image(video, 0, 0, width, height);
  loadPixels();
    for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      // Get current colors, one pixel takes four indices, one each       for RGBA (red, green, blue, and alpha)  https://p5js.org/reference/p5/pixels/      
      
      let r = pixels[index + 0];
      let g = pixels[index + 1];
      let b = pixels[index + 2];
      let gry = (r+g+b)/3
      let lgry =  (r*0.299+g*0.587+b*0.114)/3
      
      //let redshift = constrain(d,0,255);
    
      // --- CUSTOM FILTER LOGIC START ---
      pixels[index + 0] = lgry+d;
      pixels[index + 1] = lgry; 
      pixels[index + 2] = lgry; 
      // --- CUSTOM FILTER LOGIC END ---
    }
  }
 updatePixels();
  
  text("Weather in Durham", width/6, 30);
  const dayTemps = temps.slice(0,24);
  const dayTime = time.slice(0,24);
  
  const cx = width/2;
  const cy = height/2;
  
  const outerR = 200;
  const innerR = 90;
  
  minT = min(dayTemps);
  maxT = max(dayTemps);
  
  //sound 
  d = dist(mouseX, mouseY, cx, cy);
  
  let hertz = map(d, 0, width, 20.0, 1000.0);
  sine.freq(hertz);
  console.log("hertz: " + hertz);
  
  let p= map(mouseX, 0, width, -1, 1);
  console.log("p" + p);
  sine.pan(p);
  
  
  //clock face
  stroke(100);
  noFill();
  ellipse(cx, cy, outerR*2);
  
  for(let i =0; i<24; i++){
    const a = map(i, 0,24, -HALF_PI, TWO_PI- HALF_PI);
    //console.log(a);
    const r = map(dayTemps[i], minT, maxT, innerR, outerR);
    
    const xInner = cx + cos(a) * innerR;
    const yInner = cy + sin(a) * innerR;
    
    const x = cx + cos(a)*r
    const y = cy + sin(a)*r
    
    const tNorm = map(dayTemps[i], minT, maxT, 0, 1);
    const c = lerpColor(color(80,150, 255), color(255, 90, 70), tNorm);
    
    stroke(c);
    line(xInner, yInner,x, y);
    
    noStroke();
    fill(c);
    ellipse(x,y,8);
    
    if (i %6 === 0){
      const labelR = outerR +20;
      const lx = cx + cos(a) *labelR;
      const ly = cy + sin(a) *labelR;
      fill(220);
      textAlign(CENTER, CENTER);
      text(i, lx, ly);
    }
  }
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text("24 Hour Clock with Temperature", width/2, height/2);
  text("min " + str(minT) +" "+ "max " + str(maxT), width/2, height/2+15);
  console.log(minT);
  
   
}