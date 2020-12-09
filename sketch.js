let numBoards = 20;
let artboards = [];
let thumbnails = [];
let saved_thumbnails = [];
let thumbnail_up = 0;
let board_no = 0;

let temp = [];
let displayKey;

let init = true;

let scrollbar;

let inputTitle;
let inputName;
let selectBox;
let textbox;
let inputText;
let duration;
let inputDuration;

let title_content = "";
let name_content = "";
let caption_content = "";
let notes_content = "";

let brushButton;
let brushSlider;
let squareButton;
let circleButton;
let triangleButton;
let shapeSlider;
let eraserButton;
let eraserSlider;
let submitButton;
let playButton;
let clearButton;

let countTime;
let interval;

let clrR;
let clrG;
let clrB;
let value;
let brushtool;
let erasertool;
let shapetool;
let shapeSwitch = true;

let s;
let ind_red = 0;

let drawing = [];
let currentPath = [];
let currentShape = [];
let isDrawing = false;
let drawing_temp = [];
let saveBoard;
let exist = false;

let save;
let saving = true;
let duration_content = 2;
let text_content = 'Select which box you want to input... Input your text here...              Then click the submit button...';
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
    var ref = database.ref('drawings');
    ref.on('value', gotData, errorData);

    //create artboards+thumbnails
    for (let i=0; i<numBoards; i++) {
        artboards[i] = new Board();
        thumbnails[i] = new Thumbnail();
        saved_thumbnails[i] = new Saved_thumbnail();
        
        var dr = [];
        drawing_temp.push(dr);
    }
    
    //create fill-in boxes
    textbox = createElement('textarea', text_content);
    textbox.attribute("rows","5");
    textbox.attribute("cols","40");
    inputDuration = createInput(duration_content);
    inputDuration.class('namebox');
    inputDuration.input(updateDuration);
    
    selectBox = createSelect();
    selectBox.option('SELECT BOX TO INPUT');
    selectBox.option('TITLE');
    selectBox.option('NAME');
    selectBox.option('CAPTION');
    selectBox.option('NOTES');
    selectBox.class('dropdown');
        
    //create dom for brushes
    brushSlider = createSlider(1,10,5,1);
    shapeSlider = createSlider(1,10,5,1);
    eraserSlider = createSlider(2.5,50,25,2.5);
    
    //create buttons for shapes
    brushButton = createButton('ACTIVATE BRUSH');
    squareButton = createButton('DRAW SQUARE');
    circleButton = createButton('DRAW CIRCLE');
    triangleButton = createButton('DRAW TRIANGLE');
    eraserButton = createButton('ACTIVATE ERASER');
    submitButton = createButton('S U B M I T');
    playButton = createButton('PLAY BOARDS');
    clearButton = createButton('CLEAR DRAWING');
    
    brushButton.mousePressed(activateBrush);
    squareButton.mousePressed(shapeSquare);
    circleButton.mousePressed(shapeCircle);
    triangleButton.mousePressed(shapeTriangle);
    eraserButton.mousePressed(activateEraser);
    submitButton.mousePressed(submitText);
    playButton.mousePressed(playBoards);
    clearButton.mousePressed(clearDrawing);
    
    brushButton.class('shapebuttons');
    squareButton.class('shapebuttons');
    circleButton.class('shapebuttons');
    triangleButton.class('shapebuttons');
    eraserButton.class('shapebuttons');
    submitButton.class('shapebuttons');
    playButton.class('shapebuttons');
    clearButton.class('shapebuttons');
          
    repositionAll();
    
    displayKey = temp[0];

    //create scrollbar
    scrollbar = new Scrollbar(width-30, 0, 10, height);
  
    //s = new Scribble();
    
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
    erasertool = false;
    shapetool = false;
}

function shapeSquare() {
    //shape = sq;
    value = shapeSlider.value();
    brushtool = false;
    erasertool = false;
    shapetool = true;
}

function shapeCircle() {
    //shape = ci;
}

function shapeTriangle() {
    //shape = tr;
}

function activateEraser() {
    clrR = 255;
    clrG = 255;
    clrB = 255;
    value = eraserSlider.value();
    shapetool = false;
    erasertool = true;
    brushtool = false;
}

function playBoards() {
    countTime = 0;
    interval = setInterval(timeIt, duration_content*1000);
    saving = false;
}

function timeIt() {
    showDrawing(thumbnails[countTime % 20].html);
    countTime++;
}

function stopPlay() {
    clearInterval(interval);
}

function submitText() {
    let value = selectBox.value();
    
    if (value == 'TITLE') {
        title_content = textbox.value();
        thumbnails[0].save_title(title_content);
    } else if (value == 'NAME') {
        name_content = textbox.value();
        thumbnails[0].save_name(name_content);
    } else if (value == 'CAPTION') {
        caption_content = textbox.value();
        thumbnails[board_no].save_caption(caption_content);
    } else if (value == 'NOTES') {
        notes_content = textbox.value();
        thumbnails[board_no].save_notes(notes_content);
    }
}

function updateDuration() {
    duration_content = inputDuration.value();
}

function startPath() {
    isDrawing = true;
    currentPath = [];
    //currentShape = [];
    drawing.push(currentPath);
    //drawing.push(currentShape);
}

function endPath() {
    isDrawing = false;
    shapeSwitch = true;
    
    drawing_temp[board_no] = drawing;
        
    saveBoard = get(150,height/2+25-240,776,480);
    saved_thumbnails[board_no].change_exist();
    saved_thumbnails[board_no].save_img(saveBoard);    
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
    text('SKETCHED BY:',975,225);
    text('CAPTION:',975,275);
    text('NOTES:',975,377.5);
    text('(TEXT BOX)',975,480);
    text('DURATION:',975,592.5);
    textSize(7.5);
    text('(PER BOARD)',975,602.5);
    text('SECOND(S)',975,640);
    
    fill(112,36,31);
    rect(975, 172.5, 270, 32.5);
    rect(975, 232.5, 270, 22.5);
    rect(975, 282.5, 270, 75);
    rect(975, 385, 270, 75);
    
    fill(255);
    textStyle(BOLD);
    textSize(22.5);
    text(title_content,977.5,190);
    textSize(15);
    text(name_content,977.5,245);
    textStyle(NORMAL);
    textSize(10);
    text(caption_content,977.5,290);
    text(notes_content,977.5,392.5);
    
    //draw artboards+thumbnails    
    for (let i=0; i<numBoards; i++) {
        artboards[i].display();
        
        thumbnails[i].change_y(25+(75*i)-thumbnail_up);
        thumbnails[i].display();
        thumbnails[i].mouseControl(i);
        thumbnails[i].set_html(temp[i]);
        
        noStroke();
        fill(255);
        textFont('Roboto Mono');
        textSize(8);
        textAlign(CENTER, CENTER);
        text(i+1, width-165, 55+(75*i)-thumbnail_up); 
        
        saved_thumbnails[i].change_y(25+(75*i)-thumbnail_up);
        saved_thumbnails[i].display();   
    }
    
    //connect scrollbar with thumbnails
    let bottomScroll = map(scrollbar.new_sliderY, 0, height-500, 0, 100);
    thumbnail_up = map(bottomScroll, 0, 100, 0, 1550-height);
        
    //save drawing every second
    let time = 0;
    
    if (millis() >= 2000+time) {
        saveDrawing(displayKey);
        time = millis();
        console.log(displayKey);
    }
    
    //draw scrollbar
    scrollbar.update();
    scrollbar.display(); 
    
    //scribbles
    /*push();
    //frameRate(10);
    strokeWeight(5);
    stroke(50,50,50);
    s.scribbleRect(300, 300, 50, 50);
    pop();*/
    
    //draw brushstroke      
    if (brushtool) {
        value = brushSlider.value();
    } else if (erasertool) {
        value = eraserSlider.value();
    } else if (shapetool) {
        value = shapeSlider.value();
    }
    
    if (isDrawing && mouseX >= 150 && mouseX <= 150+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
        if (brushtool || erasertool) {
            var point = {
                x: mouseX,
                y: mouseY,
                stroke: value,
                r: clrR,
                g: clrG,
                b: clrB,
                type: 'point',
            }
            currentPath.push(point);
        }
        /*else if (shapetool && shapeSwitch){
            var rectangle = {
                x: mouseX,
                y: mouseY,
                stroke: value,
                width: 0,
                height: 0,
                type: 'rectangle',
            }
            shapeSwitch = false;
            currentShape.push(rectangle);
        }*/
    }
    
    for (let i=0; i<drawing.length; i++) {
        var path = drawing[i];
        
        noFill();
        beginShape();
        for (let j=0; j<path.length; j++) {
            if (path[j].type == 'point') {
                strokeWeight(path[j].stroke);
                stroke(path[j].r, path[j].g, path[j].b);
                //scale(0.5);
                vertex(path[j].x, path[j].y);
            }
        }
        endShape();
    }
    
    /*for (let i=0; i<drawing_temp.length; i++) {
        var d_t = drawing_temp[i];
        
        for(let j=0; j<d_t.length; j++){
            var path_temp = d_t[j];
            
            noFill();
            beginShape();
            for (let k=0; k<path_temp.length; k++) {
                if (path_temp[k].type == 'point') {
                    strokeWeight(path_temp[k].stroke);
                    stroke(path_temp[k].r, path_temp[k].g, path_temp[k].b);
                    vertex(path_temp[k].x+100, path_temp[k].y-100);
                }
            }
            endShape();
        }
    }*/  

} 
    
    /*for (let i=0; i<drawing.length; i++) {
        var shape1 = drawing[i];
        
        noFill();
        for (let j=0; j<shape1.length; j++) {
            if(shape1[j].type == 'rectangle'){
                strokeWeight(shape1[j].stroke);
                stroke(50);
                s.scribbleRect(shape1[j].x, shape1[j].y, mouseX - shape1[j].x, mouseY - shape1[j].y);
            }
        }
    }*/

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
        this.title = "";
        this.name = "";
        this.caption = "";
        this.notes = "";
    }
    
    change_y(y) {
        this.y = y;
    }
    
    change_trans(trans) {
        this.transparency = trans;
    }
    
    display() {
        strokeWeight(15);
        stroke(50,50,50, this.transparency);
        fill(255);
        rect(this.x, this.y, this.width, this.height, 2.5, 2.5, 2.5, 2.5);
    }
    
    mouseControl(i) {
        if (mouseX >= this.x && mouseX <= this.x+this.width && mouseY >= this.y && mouseY <= this.y+this.height && mouseIsPressed) {
            saving = false;
            thumbnails[ind_red].change_trans(0);
            ind_red = i;
            this.transparency = 255;
            displayKey = this.html;
            board_no = i;
            showDrawing(this.html);
            print('show board no:' + board_no);
            print('this.caption: '+ this.caption);
            stopPlay();
            caption_content = this.caption;
            notes_content = this.notes;
            saving = true;
        }
    }
    
    set_html(html){
        this.html = html;
    }
    
    get_html() {
        return this.html;
    }
    
    save_title(title) {
        this.title = title;
    }
    
    save_name(name) {
        this.name = name;
    }
    
    save_caption(caption) {
        this.caption = caption;
    }
    
    save_notes(notes) {
        this.notes = notes;
    }
}

class Saved_thumbnail {
    constructor() {
        this.x = width-150;
        this.y = 25;
        this.img;
        this.exist = false;
    }
    
    change_y(y) {
        this.y = y;
    }
    
    save_img(img) {
        this.img = img;
    }
    
    change_exist() {
        this.exist = true;
    }
    
    display() {
        if(this.exist) { 
            image(this.img, width-150, this.y);
            this.img.resize(97,60);
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
            this.beyond = true;
        } else {
            this.beyond = false;
        }
        if (mouseIsPressed && this.beyond) {
            this.locked = true;
        }
        if (!mouseIsPressed) {
            this.locked = false;
        }
        if (this.locked) {
            this.new_sliderY = this.constrain(mouseY, this.sliderMin, this.sliderMax);
        }
        if (abs(this.new_sliderY - this.sliderY) > 1) {
            this.sliderY = this.sliderY + (this.new_sliderY - this.sliderY)/15;
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
    if (saving) {
        let ref = database.ref('drawings');
        let data = {
            drawing: drawing,
            title: title_content,
            name: name_content,
            caption: caption_content,
            notes: notes_content,
        }

        ref.child(key).update({'drawing': drawing});
        ref.child(key).update({'title': title_content});
        ref.child(key).update({'name': name_content});
        ref.child(key).update({'caption': caption_content});
        ref.child(key).update({'notes': notes_content});
    }
}

function saveDrawing2() {
    let ref = database.ref('drawings');
    let data = {
        drawing: drawing,
        title: title_content,
        name: name_content,
        caption: caption_content,
        notes: notes_content,
    }
    
    //ref.child(key).update({'drawing': drawing})
    
    //var updates = {};
    //updates['/drawing/' + key] = data;
    //ref.update(updates);
    ref.push(data);
}

function gotData(data) {
    let elts = selectAll('.listing');
    for (let i=0; i<elts.length; i++) {
        elts[i].remove();
    }
    
    let drawings = data.val();
    let keys = Object.keys(drawings);
    for (let i=0; i<keys.length; i++) {
        var key = keys[i];
        append(temp, key);
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
    var ref = database.ref('drawings/'+key); 
    ref.once('value', oneDrawing, errorData);

    function oneDrawing(data) {
        var drawings = data.val();
        drawing = drawings.drawing;
        title_content = drawings.title;
        name_content = drawings.name;
        caption_content = drawings.caption;
        notes_content = drawings.notes;
        print('loaded title : ' + title_content);
        print('loaded caption : ' + caption_content);
        thumbnails[board_no].save_caption(drawings.caption);
        thumbnails[board_no].save_name(drawings.name);
        thumbnails[board_no].save_notes(drawings.notes);
        thumbnails[board_no].save_title(drawings.title);
    }
}

function clearDrawing() {
    saving = false;
    drawing = [];
    var point = {
                x: 405,
                y: 259,
                stroke: 5,
                r: 255,
                g: 255,
                b: 255,
                type: 'point',
            }
    currentPath.push(point);
    drawing.push(currentPath);
    saving = true;
    
    saveBoard = get(150,height/2+25-240,776,480);
    saved_thumbnails[board_no].change_exist();
    saved_thumbnails[board_no].save_img(saveBoard); 
}

function repositionAll() {
    textbox.position(975, 487.5);
    textbox.size(244, 77.5);
    inputDuration.position(975, 610);
    inputDuration.size(55, 20);
    
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
    
    selectBox.position(1100, 472.5);
    selectBox.size(125, 16);
    submitButton.position(1225, 487.5);
    submitButton.size(20, 83.5);
    playButton.position(1050, 585);
    playButton.size(90, 57.5);
    clearButton.position(1155, 585);
    clearButton.size(90, 57.5);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    repositionAll();
}