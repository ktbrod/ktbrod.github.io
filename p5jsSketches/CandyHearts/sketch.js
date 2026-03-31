
let heartText = ["marry \nur cat","love \nur friends", "mingle \n as a single", "paris \nalone", "hug \nur mom"];
let rando;
let hearts = [];

//good example of why better to use a constructor, too

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
  background("red");
}


function mouseClicked() {
  rando = int(random(heartText.length));
  heartcolor = int(random(240, 360));
  //double
  heart(mouseX, mouseY+5, 55, heartText, heartcolor);
  //heart face
  heart(mouseX,mouseY,55, heartText, heartcolor);
}


function heart(x,y, size, txt, c) {
  
  fill(c, 100, 80);
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
  
  //text
  textAlign(CENTER);
  textSize(10);
  stroke(c+10, 80, 20);
  fill(c+10, 80, 20);
  text(txt[rando], x, y+15);
}
