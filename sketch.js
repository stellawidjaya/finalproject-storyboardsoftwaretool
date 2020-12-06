
let numBoards = 20;
let artboards = [];
let thumbnails = [];
let thumbnail_up = 0;
let board_no = 1;

let temp = [];
let displayKey;

let init = true;

let scrollbar;

let inputTitle;
let inputCaption;
let inputNotes;

let brushButton;
let brushSlider;
let squareButton;
let circleButton;
let triangleButton;
let shapeSlider;
let eraserButton;
let eraserSlider;

let clrR;
let clrG;
let clrB;
let value;
let brushtool;
let shape;

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
    saveButton.mousePressed(saveDrawing2);
  
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
    inputTitle = createInput();
    inputTitle.class('titlebox');
    inputCaption = createInput(); 
    inputNotes = createInput();
        
    //create dom for brushes
    brushSlider = createSlider(1,10,5,1);
    shapeSlider = createSlider(1,10,5,1);
    eraserSlider = createSlider(2.5,50,25,2.5);
    //brushCP = createColorPicker('rgb(50,50,50)');
    
    //create buttons for shapes
    brushButton = createButton('ACTIVATE BRUSH');
    squareButton = createButton('DRAW SQUARE');
    circleButton = createButton('DRAW CIRCLE');
    triangleButton = createButton('DRAW TRIANGLE');
    eraserButton = createButton('ACTIVATE ERASER');
    
    brushButton.mousePressed(activateBrush);
    squareButton.mousePressed(shapeSquare);
    circleButton.mousePressed(shapeCircle);
    triangleButton.mousePressed(shapeTriangle);
    eraserButton.mousePressed(activateEraser);
    
    brushButton.class('shapebuttons');
    squareButton.class('shapebuttons');
    circleButton.class('shapebuttons');
    triangleButton.class('shapebuttons');
    eraserButton.class('shapebuttons');
          
    repositionAll();
    
    displayKey = temp[0];

    //create scrollbar
    scrollbar = new Scrollbar(width-30, 0, 10, height);
  
    s = new Scribble();
    
    clrR = 50;
    clrG = 50;
    clrB = 50;
    brushtool = true;
}

function activateBrush() {
    clrR = 50;
    clrG = 50;
    clrB = 50;
    value = brushSlider.value();
    brushtool = true;
}

function shapeSquare() {
    shape = sq;
}

function shapeCircle() {
    shape = ci;
}

function shapeTriangle() {
    shape = tr;
}

function activateEraser() {
    clrR = 255;
    clrG = 255;
    clrB = 255;
    value = eraserSlider.value();
    brushtool = false;
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
    rect(20, 0, 40, height);
    
    fill(255,0,0,100);
    rect(0, 20, width-200, 75);
    
    fill(255,0,0,150);
    rect(width-200, 0, 200, height);
    
    fill(255);
    //stroke(brushSlider.value());
    rect(30, 40, 20, 12.5, 0, 5, 5, 0);
    rect(30, 55, 20, 12.5, 0, 5, 5, 0);
    
    textSize(7.5);
    textAlign(CENTER,CENTER);
    text('BO/RDS',40,75);
    
    //draw drawing tools
    drawTools();
    
    //text area
    noStroke();
    fill(255);
    textSize(10);
    textAlign(LEFT);
    text('PROJECT TITLE:',975,165);
    //text('BOARD: '+'of 20',975,235);
    text('CAPTION:',975,275);
    text('NOTES:',975,450);
    
    //title.position(975, 145);

    //draw artboards+thumbnails    
    for (let i=0; i<numBoards; i++) {
        artboards[i].display();
        
        thumbnails[i].change_y(25+(75*i) - thumbnail_up);
        thumbnails[i].display();
        thumbnails[i].mouseControl(i);
        thumbnails[i].set_html(temp[i]);
        
        fill(255);
        textFont('Roboto Mono');
        textSize(8);
        textAlign(CENTER, CENTER);
        text(i+1, width-165, 55+(75*i) - thumbnail_up);      
    }

    let bottomScroll = map(scrollbar.new_sliderY, 0, height - 500, 0, 100);
    print(bottomScroll);
    thumbnail_up = map(bottomScroll, 0, 100, 0, 1550 - height);
    
    //displayKey = thumbnails[0].get_html();
    
    //save drawing every second
    let time = 0;
    
    /*if (millis() >= 2000+time) {
        saveDrawing(displayKey);
        time = millis();
        console.log(displayKey);
    }*/
    
    //draw scrollbar
    scrollbar.update();
    scrollbar.display(); 
    
    //scribbles
    push();
    //frameRate(10);
    strokeWeight(5);
    stroke(50,50,50);
    s.scribbleRect(300, 300, 50, 50);
    pop();
    
    //draw brushstroke      
    if (brushtool) {
        value = brushSlider.value();
    } else {
        value = eraserSlider.value();
    }
    
    if (mouseIsPressed) {
        var point = {
            
            x: mouseX,
            y: mouseY,
            stroke: value,
            r: clrR,
            g: clrG,
            b: clrB,
        }
        
        if (mouseX >= 150 && mouseX <= 150+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
            
            currentPath.push(point);
        }
    }
    
    push();
    for (let i=0; i<drawing.length; i++) {
        var path = drawing[i];
        
        noFill();
        stroke(0, 255, 100);
        beginShape();
        for (let j=0; j<path.length; j++) {
            strokeWeight(path[j].stroke);
            stroke(path[j].r, path[j].g, path[j].b);
            vertex(path[j].x, path[j].y);
        }
        endShape();    
    }
    pop();
}

class Board {
    constructor() {
        this.x = 150;
        this.y = height/2+25;
        this.width = 776;
        this.height = 480;
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
            fill(255);
        } else {
            fill('RED');
        }
        
        rect(this.barX, this.sliderY, this.barW, 500);
    }
}

function drawTools() {
    //brush
    push();
        angleMode(DEGREES);
        translate(240,-85);
        rotate(45);
    
        stroke(255);
        strokeWeight(brushSlider.value());
        line(132.5, 35, 160, 25);
        noStroke();
        fill(255,0,0);
        triangle(130, 41, 135, 41, 132.5, 35);
        noFill();
        stroke(255,0,0);
        strokeWeight(1.5);
        rect(125, 50, 15, 45, 0, 0, 0, 0);
        triangle(125, 50, 140, 50, 132.5, 35);   
    pop();
    
    //eraser
    push();
    stroke(255);
    strokeWeight(eraserSlider.value());
    line(1072.5, 40, 1090, 47.5);
    pop();
    
    push();
        translate(1050,40);
        rotate(45);
        
        noFill();
        stroke(255,0,0);
        strokeWeight(1.5);
        rect(0, 0, 30, 30);
        arc(15, 0, 30, 30, 180, 0);
    pop();
    
    //slider format
    textSize(7.5);
    text('STROKE WEIGHT:',390,40);
    text('1',360,60);
    text('10',450,60);
    text('STROKE WEIGHT:',830,40);
    text('1',800,60);
    text('10',890,60);
    text('STROKE WEIGHT:',1150,40);
    text('2.5',1125,60);
    text('50',1210,60);
    
    //lines
    strokeWeight(2.5);
    stroke(50);
    line(150,25,150,90);
    line(480,25,480,90);
    line(920,25,920,90);
    line(1240,25,1240,90);
    
    //shapes
    noStroke();
    square(517.5, 37.5, 40);
    circle(607.5, 57.5, 40);
    triangle(677.5, 37.5, 697.5, 77.5, 657.5, 77.5);
    noFill();
    strokeWeight(2.5);
    stroke(255);
    square(735, 37.5, 40);
}

function saveDrawing(key) {
    let ref = database.ref('drawings');
    let data = {
        name: "stella",
        drawing: drawing,
    }
    
    //ref.child(key).update({'drawing': drawing})
    
    //var updates = {};
    //updates['/drawing/' + key] = data;
    //ref.update(updates);
    //ref.push(data);
}

function saveDrawing2() {
    let ref = database.ref('drawings');
    let data = {
        name: "stella",
        drawing: drawing,
    }
    
    //ref.child(key).update({'drawing': drawing})
    
    var updates = {};
    updates['/drawing/' + key] = data;
    ref.update(updates);
    ref.push(data);
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
        var li = createElement('li', '');
        li.class('listing');
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

function repositionAll() {
    inputTitle.position(975, 172.5);
    inputTitle.size(265, 30);
    inputCaption.position(975, 282.5);
    inputCaption.size(265, 150);
    inputNotes.position(975, 525);
    inputNotes.size(265, 100);
    
    brushButton.position(175, 25);
    brushButton.size(65, 65);
    brushSlider.position(355, 55);
    brushSlider.size(100, 25);
    
    squareButton.position(505, 25);
    circleButton.position(575, 25);
    triangleButton.position(645, 25);
    squareButton.size(65, 65);
    circleButton.size(65, 65);
    triangleButton.size(65, 65);
    shapeSlider.position(795, 55);
    shapeSlider.size(100, 25);
    
    eraserButton.position(945, 25);
    eraserButton.size(65, 65);
    eraserSlider.position(1115, 55);
    eraserSlider.size(100, 25);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    repositionAll();
}