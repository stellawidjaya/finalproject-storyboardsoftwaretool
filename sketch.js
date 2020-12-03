
let numBoards = 20;
let artboards = [];
let thumbnails = [];
let temp = [];
let displayKey;

let init = true;

let scrollbar;

let brushSlider;
let inputTitle;
let inputCaption;
let addButton;

let squareButton;
let circleButton;
let triangleButton;

let s;
let transparency = 0;
let ind_red = 0;

let drawing = [];
let currentPath = [];
let isDrawing;

let save;
var database;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(startPath);
    canvas.parent('canvascontainer');
    canvas.mouseReleased(endPath);
    
    var saveButton = select('#saveButton');
    saveButton.mousePressed(saveDrawing);
  
    //start firebase
    var firebaseConfig = {
    apiKey: "AIzaSyCFRYCFf94YIclONyOKRzeUBFwbh7am4LE",
    authDomain: "my-storyboard-software.firebaseapp.com",
    databaseURL: "https://my-storyboard-software.firebaseio.com",
    projectId: "my-storyboard-software",
    storageBucket: "my-storyboard-software.appspot.com",
    messagingSenderId: "625029995907",
    appId: "1:625029995907:web:e99107e955033c685f2ab6",
    measurementId: "G-026KHL8HLB"
    };
    
    // initialize firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    database = firebase.database();
    console.log(database);
    var ref = database.ref('drawings');
    ref.on('value', gotData, errorData);
    console.log(firebase);
  
    //let drawings = database.val();
    /*console.log(drawings);
    let keys = Object.keys(drawings);
    for (let i=0; i < keys.length; i++) {
        var key = keys[i];*/
    
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
    
    //create dom for brushes
    brushSlider = createSlider(0,10,5,1);
        change_brushstroke = brushSlider.value();

    
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
    
    displayKey = temp[0];

    
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

function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath() {
    isDrawing = false;
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
        thumbnails[i].mouseControl(i);
        thumbnails[i].set_html(temp[i]);
        
        fill(255);
        textFont('Roboto Mono');
        textSize(8);
        textAlign(CENTER, CENTER);
        text(i+1, width-165, 55+(75*i));  
    }
    
    //displayKey = thumbnails[0].get_html();
    
    //save drawing every second
    let time = 0;
    
    if (millis() >= 2000+time) {
        saveDrawing(displayKey);
        time = millis();
        console.log(displayKey);
    }
    
    /*for(let x=0; x<=2; x++) {
        if (time % 2000 == 0) {
            x++;
            console.log(x);
            saveDrawing(data);
        }
    }*/
    
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
    var value = brushSlider.value();
    
    if (mouseIsPressed) {
        var point = {
            x: mouseX,
            y: mouseY,
        }
        
        if (mouseX >= 100 && mouseX <= 682 && mouseY >= height/2-180 && mouseY <= height/2+180) {
            currentPath.push(point);
        }
    }
    
    push();
    
    for (let i=0; i<drawing.length; i++) {
        var path = drawing[i];
        
        strokeWeight(value);
        stroke(50);
        noFill();
        beginShape();
        for (let j=0; j<path.length; j++) {
            vertex(path[j].x, path[j].y);
        }
        endShape();    
    }
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
        this.transparency = 0;
        this.html;
    }
    
    change_y(y){
        this.y = y;
    }
    
    change_trans(trans){
        this.transparency = trans;
    }
        
    display() {
        strokeWeight(2.5);
        stroke(255,0,0, this.transparency);
        fill(255);
        //rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 2.5, 2.5, 2.5, 2.5);
    }
    
    mouseControl(i) {
        if (mouseX >= this.x && mouseX <= this.x+this.width && mouseY >= this.y && mouseY <= this.y+this.height && mouseIsPressed) {
            thumbnails[ind_red].change_trans(0);
            ind_red = i;
            showDrawing(this.html);
            //numBoards++;
            this.transparency = 255;
            //console.log('1');
            displayKey = this.html;
        }
    }
    
    set_html(html){
        this.html = html;
    }
    
    get_html() {
        return this.html;
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

function saveDrawing(key) {
    let ref = database.ref('drawings');
    let data = {
        name: "stella",
        drawing: drawing,
    }
    
    ref.child(key).update({'drawing': drawing})
    
    //var updates = {};
    //updates['/drawing/' + key] = data;
    //ref.update(updates);
    //ref.push(data);
}

function gotData(data) {
    let elts = selectAll('.listing');
    for (let i=0; i < elts.length; i++) {
        elts[i].remove();
    }
    
    let drawings = data.val();
    //console.log(drawings);
    let keys = Object.keys(drawings);
    for (let i=0; i < keys.length; i++) {
        var key = keys[i];
        append(temp, key);
        //var li = createElement('li', '');
        //li.class('listing');
        //var ahref = createA('#', key);
        //ahref.mousePressed(showDrawing);
        //ahref.parent(li);
        //li.parent('drawinglist');
    }
    
    if(init) {
        displayKey = temp[0];
        showDrawing(temp[0]);
        init = false;
    }
}

function errorData(error) {
    console.log(error);
}

function showDrawing(key) {
    //var key = this.html();
    //print(key);
    var ref = database.ref('drawings/'+key); 
    ref.once('value', oneDrawing, errorData);

    function oneDrawing(data) {
        var drawings = data.val();
        drawing = drawings.drawing;
        //console.log(drawing);
    }
}

function mouseDragged() {
    let value = brushSlider.value();
    
    strokeWeight(value);
    stroke(50,50,50);
    line(pmouseX, pmouseY, mouseX, mouseY);
}

function repositionAll() {
    title.position(100,125);
    inputTitle.position(100, 150);
    inputTitle.size(250,25);
    
    caption.position(100,550);
    inputCaption.position(100, 575);
    inputCaption.size(576,25);
    
    brushSlider.position(200,25);
    brushSlider.size(100,25);
    
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