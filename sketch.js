//pendulum measures
let r1 = 150;
let r2 = 150;
let m1 = 20;
let m2 = 20;
let a1, a2;

//velocity
let a1_v = 0;
let a2_v = 0;

//gravity force
let g = 1;

//previous values of x,y to create a line
let px2 = -1;
let py2 = -1;

//canvas centre
let cx,cy;

//used for createGraphics function
let graphics;

//variables to manipulate the music
let song;
let button;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //song file loading and analizing the amplitude
  song = loadSound("shivadance.mp3", loaded);
  amplitude = new p5.Amplitude();

  //initial angles' values
  a1 = PI/2;
  a2 = PI/2;
  
  //canvas centre
  cx = width/2;
  cy = 150;
  
  //creating animation effect with the function
  graphics = createGraphics(windowWidth, windowHeight);
  graphics.push();
  graphics.background(0);
  graphics.pop();
}

//used to make sure the song file is loaded before user can interact with the programme
function loaded(){
  button = createButton("play");
  button.position(19,19);
  button.mousePressed(togglePlaying);
 
}

//used to play and pause the song using a button
function togglePlaying(){
  if (!song.isPlaying()){
    song.loop();
    song.setVolume(1);
    button.html("pause");
  } else{
    song.pause();
    button.html("play");
  }
}

function draw() {
  
  //measure the aplitude and map its level to bigger values
  //change the angle1 value according to the aplitude
  let level = amplitude.getLevel();
  let size = map(level, 0, 1, 0, 15);
  a1 = size;
  a2 = 0;
  
  //double pendulum formula
  let num1 = -g * (2 * m1 + m2) * sin(a1);
  let num2 = -m2 * g * sin(a1 - 2 * a2);
  let num3 = -2 * sin(a1 - a2) * m2;
  let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
  let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a1_a = (num1 + num2 + num3 * num4) / den;
  
  num1 = 2*sin(a1-a2);
  num2 = (a1_v*a1_v*r1*(m1+m2));
  num3 = g*(m1 +m2) * cos(a1);
  num4 = a2_v*a2_v*r2*m2*cos(a1-a2);
  den = r2 * (2*m1+m2-m2*cos(2*a1-2*a2));
  let a2_a = (num1*(num2+num3+num4)) / den;
  
  //pendulum animation
  image(graphics, 0, 0);
  stroke(255);
  strokeWeight(2);

  translate(cx, cy);

  let x1 = r1 * sin(a1);
  let y1 = r1 * cos(a1);
  
  let x2 = x1 + r2 * sin(a2);
  let y2 = y1 + r2 * cos(a2);

  //drawing a pendulum
  line(0, 0, x1, y1);
  fill(255);
  ellipse(x1, y1, m1, m1);

  line(x1, y1, x2, y2);
  fill(255);
  ellipse(x2, y2, m2, m2);

  //acceleration and velocity 
  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;
  
  //slowing velocity a bit to add natural resistance
  a1_v*= 0.999;
  a2_v*= 0.999;
  
  //creating a path of moving pendulum
  graphics.push();
  graphics.translate(cx, cy);
  graphics.strokeWeight(2);
  graphics.stroke(random(255),random(255),random(255));
  if (frameCount > 1) {
  graphics.line(px2, py2,x2, y2);
  }
  graphics.pop();
  px2 = x2;
  py2 = y2;
  
}
