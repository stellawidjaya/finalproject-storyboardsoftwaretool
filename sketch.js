let numBoards = 12;
let artboards = [];
let thumbnails = [];

let scrollbar;

let inputTitle;
let inputCaption;
let addButton;

let squareButton;
let circleButton;
let triangleButton;

let s;
let transparency = 0;

let strokes = [];
let drawStrokes = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //background(50);
    
    //create artboards+thumbnails
    for (let i=0; i<numBoards; i++) {
        artboards[i] = new Board();
        thumbnails[i] = new Thumbnail();
    }
    
    //create fill-in boxes
    title = createElement('h3', 'PROJECT TITLE:');
    title.style('color', 'white');
    title.style('fontFamily', 'Roboto Mono');
    title.style('fontSize', '10px');
    
    inputTitle = createInput();
    
    caption = createElement('h3', 'caption:');
    caption.style('color', 'white');
    caption.style('fontFamily', 'Roboto Mono');
    caption.style('fontSize', '10px');
    
    inputCaption = createInput();
    
    //create buttons for shapes
    squareButton = createButton('SQUARE');
    circleButton = createButton('CIRCLE');
    triangleButton = createButton('TRIANGLE');
    
    squareButton.mousePressed(shapeSquare);
    circleButton.mousePressed(shapeCircle);
    triangleButton.mousePressed(shapeTriangle);
    
    squareButton.class('shapebuttons');
    circleButton.class('shapebuttons');
    triangleButton.class('shapebuttons');
  
    repositionAll();
    
    //create scrollbar
    scrollbar = new Scrollbar(width-20, 0, 10, height);
  
  s = new Scribble();
}

function shapeSquare() {
  transparency = 255;
}

function shapeCircle() {
  transparency = 0;
}

function shapeTriangle() {
  
}

function draw() {  
    background(50);
    
    //draw logo banner
    noStroke();
    fill(255,0,0);
    rect(10, 0, 40, height);
    
    fill(255);
    rect(20, 20, 20, 12.5, 0, 5, 5, 0);
    rect(20, 35, 20, 12.5, 0, 5, 5, 0);
    
    //draw drawing tools
    drawTools();
    
    //draw artboards+thumbnails    
    for (let i=0; i<numBoards; i++) {
        artboards[i].display();
        
        thumbnails[i].change_y(25+(75*i));
        thumbnails[i].display();
        thumbnails[i].mouseControl();
        
        fill(255);
        textFont('Roboto Mono');
        textSize(8);
        textAlign(CENTER, CENTER);
        text(i+1, width-165, 55+(75*i));  
    }
    
    //draw scrollbar
    scrollbar.update();
    scrollbar.display(); 
    
    //scribbles
    push();
    //frameRate(10);
    strokeWeight(1);
    stroke(50,50,50,transparency);
    s.scribbleRect(300, 300, 50, 50);
    pop();
    
    //draw brushstroke
    push();
    if(drawStrokes) {
        strokes.push(createVector(mouseX, mouseY));
    }
    
    strokeWeight(5);
    stroke(50);
    noFill();
    beginShape();
    for (let i=0; i<strokes.length; i++) {
        let x = strokes[i].x;
        let y = strokes[i].y;
        
        vertex(x, y);
    }
    endShape();
    pop();
}

class Board {
    constructor() {
        this.x = 100;
        this.y = height/2;
        this.width = 582;
        this.height = 360;
    }
    
    display() {
        noStroke();
        fill(255);
        rect(this.x, this.y-(this.height/2), this.width, this.height, 2.5, 2.5, 2.5, 2.5);
    }
}

class Thumbnail {
    constructor() {
        this.x = width-150;
        this.y = 25;
        this.width = 97;
        this.height = 60;
    }
    
    change_y(y){
        this.y = y;
    }
        
    display() {
        noStroke();
        fill(255);
        //rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 2.5, 2.5, 2.5, 2.5);
    }
    
    mouseControl() {
        if (mouseX >= this.x && mouseX <= this.x+this.width && mouseY >= this.y && mouseY <= this.y+this.height) {
            console.log('1');
        }
    }
}
    
class Scrollbar {
    constructor(barX, barY, barW, barH) {
        this.barX = barX;
        this.barY = barY;
        this.barW = barW;
        this.barH = barH;
        this.sliderY = this.barY;
        this.new_sliderY = this.sliderY;
        this.sliderMin = 0;
        this.sliderMax = height-500;
        this.beyond = false;
        this.locked = false;
    }
    
    update() {
        if (this.beyondSlider()) {
            //log.console('test');
            this.beyond = true;
        } else {
            this.beyond = false;
        }
        if (mouseIsPressed && this.beyond) {
            //console.log('true');
            this.locked = true;
        }
        if (!mouseIsPressed) {
            //console.log('false');
            this.locked = false;
        }
        if (this.locked) {
            this.new_sliderY = this.constrain(mouseY, this.sliderMin, this.sliderMax);
            //console.log(this.new_sliderY);
        }
        if (abs(this.new_sliderY - this.sliderY) > 1) {
            this.sliderY = this.sliderY + (this.new_sliderY - this.sliderY)/15;
            //console.log(this.sliderY);
        }
    }
    
    constrain(value, minValue, maxValue) {
        return min(max(value, minValue), maxValue);
    }
    
    beyondSlider() {
        if (mouseX > this.barX && mouseX < this.barX + this.barW && mouseY > this.sliderY && mouseY < this.sliderY + this.barH) {
            return true;
        } else {
            return false;
        }
    }
    
    display() {
        noStroke();
        fill(50);
        rect(this.barX, this.barY, this.barW, this.barH);
        if (this.beyond || this.locked) {
            fill(200);
        } else {
            fill('RED');
        }
        
        rect(this.barX, this.sliderY, this.barW, 500);
    }
}

function drawTools() {
    noStroke();
    fill(255);
    rect(125, 0, 40, 60, 0, 0, 15, 15);
    
    square(410, 10, 30);
    circle(475, 25, 30);
    triangle(525, 10, 540, 40, 510, 40);
}

function mousePressed() {
    drawStrokes = true;
    strokes = [];
}

function mouseReleased() {
    drawStrokes = false;
}

function repositionAll() {
    title.position(100,125);
    inputTitle.position(100, 150);
    inputTitle.size(250,25);
    
    caption.position(100,550);
    inputCaption.position(100, 575);
    inputCaption.size(576,25);
  
    squareButton.position(400, 0);
    circleButton.position(450, 0);
    triangleButton.position(500, 0);
    squareButton.size(50, 50);
    circleButton.size(50, 50);
    triangleButton.size(50, 50);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    repositionAll();

}