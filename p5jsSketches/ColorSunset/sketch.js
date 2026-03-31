function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
  frameRate(10);
  noStroke();
  frameRate(5);
}
let i = 0;
let x = 200;
let z = 0;
let f = 360;
let y = 250;


function draw() {
  background(f--,f--,50, 0.5);
  
  fill(i++,i++, 50);
  ellipse(windowWidth/2,windowHeight/2,windowWidth/2);
  y+=0.2;
   
  fill(f--,f--,50, 0.7);
  rect(0,windowHeight/2,windowWidth,windowHeight/2);
  //fill(i++,i++, 50);
  for(z=windowHeight/2;z<height; z +=20)
  {
  rect(0,z,width,10);
  }
    
    //console.log(i);
    //console.log(p);
    //console.log(x);

}


function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 30);
  }
}
