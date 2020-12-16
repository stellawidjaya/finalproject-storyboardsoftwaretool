let numBoards = 20;
let artboards = [];
let thumbnails = [];
let saved_thumbnails = [];
let thumbnail_up = 0;
let board_no = 0;

let rect_no = 0;
let ell_no = 0;

let temp = [];
let displayKey;

let init = true;

let scrollbar;

let rectTransparency = 255;
let ellTransparency = 0;
let screenTransparency = 255;
let dot1 = 255;
let dot2 = 255;
let dot3 = 255;

let inputTitle;
let inputName;
let selectBox;
let textbox;
let inputText;
let duration;
let inputDuration;
let caption;
let notes;

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
let saveButton;

let mouseCursor;

let countTime;
let interval;

let clrR;
let clrG;
let clrB;
let value;
let brushtool;
let erasertool;
let shapetool;
let recttool;
let elltool;
let shapeSwitch = true;
let withinCanvas;

let s;
let ind_red = 0;

let storage = [];
let drawing = [];
let currentPath = [];
let currentShape = [];
let isDrawing = false;
let drawing_temp = [];
let saveBoard;
let exist = false;

let dragX;
let dragY;
let releasedX;
let releasedY;

let save;
let saving = true;
let duration_content = 2;
let text_content = 'Input your text here...'

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(startPath);
    canvas.parent('canvascontainer');
    canvas.mouseReleased(endPath);
    
    mouseCursor = cursor('progress');
    
    for (let i=0; i<numBoards; i++) {
        storage.push({
            drawings: [],
            title: title_content,
            name: name_content,
            caption: caption_content,
            notes: notes_content,
        })
    }

    //create artboards+thumbnails
    for (let i=0; i<numBoards; i++) {
        artboards[i] = new Board();
        thumbnails[i] = new Thumbnail();
        saved_thumbnails[i] = new Saved_thumbnail();
    }
    
    //create fill-in boxes
    textbox = createElement('textarea', text_content);
    textbox.attribute("rows","5");
    textbox.attribute("cols","40");
    inputDuration = createInput(duration_content);
    inputDuration.class('durationbox');
    inputDuration.input(updateDuration);
    inputTitle = createInput(title_content);
    inputTitle.class('titlebox');
    inputName = createInput(name_content);
    inputName.class('namebox');
    caption = createElement('h2', caption_content);
    caption.class('par');
    notes = createElement('h2', notes_content);
    notes.class('par');
    
    selectBox = createSelect();
    selectBox.option('CAPTION');
    selectBox.option('NOTES');
    selectBox.class('dropdown');
        
    //create dom for brushes
    brushSlider = createSlider(1,10,5,1);
    shapeSlider = createSlider(1,10,5,1);
    eraserSlider = createSlider(2.5,50,25,2.5);
    
    //create buttons
    brushButton = createButton('ACTIVATE BRUSH');
    squareButton = createButton('ACTIVATE RECTANGLE');
    circleButton = createButton('ACTIVATE ELLIPSE');
    eraserButton = createButton('ACTIVATE ERASER');
    submitButton = createButton('SUBMIT');
    playButton = createButton('PLAY BOARDS');
    clearButton = createButton('CLEAR DRAWING');
    saveButton = createButton('SAVE SKETCH');
    
    brushButton.mousePressed(activateBrush);
    squareButton.mousePressed(shapeSquare);
    circleButton.mousePressed(shapeCircle);
    eraserButton.mousePressed(activateEraser);
    submitButton.mousePressed(submitText);
    playButton.mousePressed(playBoards);
    clearButton.mousePressed(clearDrawing);
    saveButton.mousePressed(downloadSketch);
    
    brushButton.class('shapebuttons');
    squareButton.class('shapebuttons');
    circleButton.class('shapebuttons');
    eraserButton.class('shapebuttons');
    submitButton.class('submitbutton');
    playButton.class('shapebuttons');
    clearButton.class('shapebuttons');
    saveButton.class('shapebuttons');
          
    initialDOM();
    
    displayKey = temp[0];

    //create scrollbar
    scrollX = width-20
    scrollbar = new Scrollbar(scrollX, 0, 10, height);
    
    //activate scribble
    s = new Scribble();
    
    //initialize brush
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
    recttool = false;
    elltool = false;
    shapetool = false;    
}

function shapeSquare() {
    value = shapeSlider.value();
    brushtool = false;
    erasertool = false;
    recttool = true;
    elltool = false;
    shapetool = true;
    rectTransparency = 255;
    ellTransparency = 0;
    mouseCursor = cursor(CROSS);
}

function shapeCircle() {
    value = shapeSlider.value();
    brushtool = false;
    erasertool = false;
    recttool = false;
    elltool = true;
    shapetool = true;
    rectTransparency = 0;
    ellTransparency = 255;
    mouseCursor = cursor(CROSS);
}

function activateEraser() {
    clrR = 255;
    clrG = 255;
    clrB = 255;
    value = eraserSlider.value();
    recttool = false;
    erasertool = true;
    brushtool = false;
    shapetool = false;
}

function playBoards() {
    if (!interval) {
        countTime = 0;
        interval = setInterval(timeIt, duration_content*1000);
        playButton.html('STOP BOARDS');
        saving = false;
    } else {
        clearInterval(interval);
        interval = false;
        playButton.html('PLAY BOARDS');
    }
}

function timeIt() {
    showDrawing2(countTime % 20);
    countTime++;
}

function stopPlay() {
    clearInterval(interval);
}

function submitText() {
    let value = selectBox.value();
    
    if (value == 'CAPTION') {
        caption_content = textbox.value();
        thumbnails[board_no].save_caption(caption_content);
        caption.html(caption_content);
    } else if (value == 'NOTES') {
        notes_content = textbox.value();
        thumbnails[board_no].save_notes(notes_content);
        notes.html(notes_content);
    }
}

function updateDuration() {
    duration_content = inputDuration.value();
}

function startPath() {
    isDrawing = true;
    currentPath = [];
    currentShape = [];
    drawing.push(currentPath);
    drawing.push(currentShape);
}

function endPath() {
    isDrawing = false;
    shapeSwitch = true;
            
    saveBoard = get(width/20*1.75,height/5,776,480);
    saved_thumbnails[board_no].change_exist();
    saved_thumbnails[board_no].save_img(saveBoard);
}

function downloadSketch() {
    var sketch = get(width/20*1.75+1,height/5+1,776-3,480-3);
    sketch.save('sketchboard'+(board_no+1), 'jpg');
}

function draw() {  
    background(50);
    
    if (millis() >= 4000 && millis() <= 5000) {
        repositionAll();
        mouseCursor = cursor(ARROW);
    }
    
    //draw artboards+thumbnails    
    for (let i=0; i<numBoards; i++) {
        artboards[i].display();   
    }
    
    //connect scrollbar with thumbnails
    let bottomScroll = map(scrollbar.new_sliderY, 0, height-500, 0, 100);
    thumbnail_up = map(bottomScroll, 0, 100, 0, 1550-height);
        
    //save drawing every second
    let time = 0;
    
    if (millis() >= 2000+time) {
        saveDrawing();
        time = millis();
    } 
    
    //for drawing tools      
    if (brushtool) {
        value = brushSlider.value();
    } else if (erasertool) {
        value = eraserSlider.value();
    } else if (shapetool) {
        value = shapeSlider.value();
    }
    
    if (isDrawing && mouseX >= width/20*1.75 && mouseX <= width/20*1.75+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
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
        else if (shapetool && shapeSwitch && recttool){
            var rectangle = {
                x: mouseX,
                y: mouseY,
                stroke: value,
                w: 0,
                h: 0,
                type: 'rectangle',
            }
            shapeSwitch = false;
            currentShape.push(rectangle);
            rect_no = drawing.length-1;
            withinCanvas = true;
        }
        else if (shapetool && elltool && shapeSwitch) {
            var ellipse = {
                x: mouseX,
                y: mouseY,
                stroke: value,
                w: 0,
                h: 0,
                type: 'ellipse',
            }
            shapeSwitch = false;
            currentShape.push(ellipse);
            ell_no = drawing.length-1;
            withinCanvas = true;
        }
    }
    
    push();
    //draw brushstroke & shapes
    for (let i=0; i<drawing.length; i++) {
        var path = drawing[i];
        
        noFill();
        beginShape();
        for (let j=0; j<path.length; j++) {
            if (path[j].type == 'point') {
                strokeWeight(path[j].stroke);
                stroke(path[j].r, path[j].g, path[j].b);
                vertex(path[j].x, path[j].y);
            }
            endShape();
            if (path[j].type == 'rectangle') {
                strokeWeight(path[j].stroke);
                stroke(50);
                s.scribbleRect(path[j].x-path[j].w/2, path[j].y-path[j].h/2, path[j].w, path[j].h);
            }
            if (path[j].type == 'ellipse') {
                strokeWeight(path[j].stroke);
                stroke(50);
                s.scribbleEllipse(path[j].x, path[j].y, path[j].w*2, path[j].h*2);
            } 
        }
    }
    pop();
    
    //layering
    noStroke();
    fill(50);
    rect(width/20*1.75, 100, -150, height-100);
    rect(width/20*1.75+776, 100, 150, height-100);
    rect(width/20*1.75-60, height/5, 776+120, -150);
    rect(width/20*1.75-60, height/5+480, 776+120, 150);
    
    //draw logo banner
    noStroke();
    fill(255,0,0);
    rect(0, 0, 40, height);
    
    fill(255,0,0,120);
    rect(0, 20, width-185, 75);
    fill(255,0,0,75);
    rect(0, 0, width-185, 20);
    
    fill(255,0,0,175);
    rect(width-185, 0, 185, height);
    
    fill(255);
    rect(10, 40, 20, 12.5, 0, 5, 5, 0);
    rect(10, 55, 20, 12.5, 0, 5, 5, 0);
    
    textStyle(NORMAL);
    textSize(7.5);
    textAlign(CENTER,CENTER);
    text('BO/RDS',20,75);
    
    //draw drawing tools
    drawTools();
    
    //draw artboards+thumbnails    
    for (let i=0; i<numBoards; i++) {
        thumbnails[i].change_y(25+(75*i)-thumbnail_up);
        thumbnails[i].display();
        thumbnails[i].mouseControl(i);
        thumbnails[i].set_html(temp[i]);
        
        noStroke();
        fill(255);
        textFont('Roboto Mono');
        textSize(8);
        textAlign(CENTER, CENTER);
        text(i+1, width-155, 55+(75*i)-thumbnail_up); 
        
        saved_thumbnails[i].change_y(25+(75*i)-thumbnail_up);
        saved_thumbnails[i].display();   
    }
    
    //draw scrollbar
    scrollbar.update();
    scrollbar.display();
    
    //text area
    noStroke();
    fill(255);
    textSize(10);
    textAlign(LEFT);
    text('PROJECT TITLE:',width/20*1.75+776+40,height/5+165-160);
    text('SKETCHED BY:',width/20*1.75+776+40,height/5+225-160);
    text('CAPTION:',width/20*1.75+776+40,height/5+297.5-160);
    text('NOTES:',width/20*1.75+776+40,height/5+405-160);
    textSize(7.5);
    text('(TEXT BOX)',width/20*1.75+776+40,height/5+512.5-160);
    
    strokeWeight(2.5);
    stroke(255,0,0);
    line(width/20*1.75+776+40, height/5+275-160, width/20*1.75+776+40+270, height/5+275-160);
    
    noStroke();
    fill(255,0,0,25);
    rect(width/20*1.75+776+40, height/5+172.5-160, 270, 32.5);
    rect(width/20*1.75+776+40, height/5+232.5-160, 270, 22.5);
    rect(width/20*1.75+776+40, height/5+305-160, 270, 80);
    rect(width/20*1.75+776+40, height/5+412.5-160, 270, 80);
    
    fill(255);
    textStyle(BOLD);
    textSize(22.5);
    text(title_content,width/20*12.5,190);
    textSize(15);
    text(name_content,width/20*12.5,245);
    
    //loading screen
    noStroke();
    fill(255,0,0,screenTransparency);
    rect(0, 0, width, height);
    fill(255,255,255,screenTransparency);
    textAlign(CENTER,CENTER);
    textSize(15);
    textStyle(BOLD);
    textSize(50);
    text('BO/RDS',width/2,height/2);
    textStyle(NORMAL);
    textSize(15);
    text('QUICKLY ILLUSTRATE YOUR STORYTELLING IDEAS.',width/2,height/2+50);
    textStyle(ITALIC);
    textSize(15);
    text('LOADING',width/2,height/2+150);
    fill(255,255,255,dot1);
    circle(width/2-15,height/2+175,5);
    fill(255,255,255,dot2);
    circle(width/2,height/2+175,5);
    fill(255,255,255,dot3);
    circle(width/2+15,height/2+175,5);
    
    if (millis() >= 1000) {
        dot1 = 0;
    }
    if (millis() >= 2000) {
        dot2 = 0;
    }
    if (millis() >= 3000) {
        dot3 = 0;
    }
    if (millis() >= 4000) {
        screenTransparency = 0;
    }
}
    
class Board {
    constructor() {
        this.x = width/20*1.75;
        this.y = height/5;
        this.width = 776;
        this.height = 480;
    }
    
    display() {
        noStroke();
        fill(255);
        rect(this.x, this.y, this.width, this.height, 2.5, 2.5, 2.5, 2.5);
    }
}

class Thumbnail {
    constructor() {
        this.x = width-140;
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
            //displayKey = this.html;
            board_no = i;
            showDrawing();
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
            image(this.img, width-140, this.y);
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
        translate(width/20*1.75,-85);
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
    line(width/20*10.925, 40, width/20*11.1, 47.5);
    pop();
    
    push();
        translate(width/20*10.625,40);
        rotate(45);
        
        noFill();
        stroke(255,0,0);
        strokeWeight(1.5);
        rect(0, 0, 30, 30);
        arc(15, 0, 30, 30, 180, 0);
    pop();
    
    //slider format
    textSize(10);
    textAlign(LEFT);
    text('BRUSH TOOL:',width/20*1.5,12.5);
    text('SHAPE TOOL:',width/20*5,12.5);
    text('ERASER TOOL:',width/20*9.75,12.5);
    text('PLAY YOUR BOARDS:',width/20*14.375,12.5);
    textSize(7.5);
    text('STROKE WEIGHT:',width/20*3.25,40);
    text('1',width/20*3.25,60);
    text('10',width/20*4.35,60);
    text('STROKE WEIGHT:',width/20*8,40);
    text('1',width/20*8,60);
    text('10',width/20*9.1,60);
    text('STROKE WEIGHT:',width/20*11.5,40);
    text('2.5',width/20*11.5,60);
    text('50',width/20*12.6,60);
    textSize(7.5);
    text('DURATION',width/20*15.5,35);
    text('PER BOARD:',width/20*15.5,45);
    text('SECOND(S)',width/20*15.5,82.5);
    
    //lines
    strokeWeight(2.5);
    stroke(50);
    line(width/20*1.25,5,width/20*1.25,90);
    line(width/20*4.75,5,width/20*4.75,90);
    line(width/20*9.5,5,width/20*9.5,90);
    line(width/20*14.125,5,width/20*14.125,90);
    line(width/20*16.5,5,width/20*16.5,90);
    
    //shapes
    noStroke();
    fill(255,0,0);
    square(width/20*5.175, 37.5, 40);
    circle(width/20*6.425, 57.5, 40);
    noFill();
    strokeWeight(shapeSlider.value());
    stroke(255, rectTransparency);
    square(width/20*7.125, 37.5, 40);
    stroke(255, ellTransparency);
    circle(width/20*7.125+20, 57.5, 40);
}

function mouseDragged() {
    if (withinCanvas && recttool && mouseX >= width/20*1.75 && mouseX <= width/20*1.75+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
        var sth = drawing[rect_no];
        var path = sth[0];
        path.w = path.x-mouseX;
        path.h = path.y-mouseY;
    }  
    if (withinCanvas && elltool && mouseX >= width/20*1.75 && mouseX <= width/20*1.75+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
        var sth = drawing[ell_no];
        var path = sth[0];
        path.w = path.x-mouseX;
        path.h = path.y-mouseY;
    }
}

function mouseReleased() {
    if (withinCanvas && recttool && mouseX >= 150 && mouseX <= 150+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
        var sth = drawing[rect_no];
        var path = sth[0];
        path.w = path.x-mouseX;
        path.h = path.y-mouseY;
        
        withinCanvas = false;
    }
    if (withinCanvas && elltool && mouseX >= 150 && mouseX <= 150+776 && mouseY >= height/2+25-240 && mouseY <= height/2+25+240) {
        var sth = drawing[ell_no];
        var path = sth[0];
        path.w = path.x-mouseX;
        path.h = path.y-mouseY;
        
        withinCanvas = false;
    }
}

function saveDrawing() {   
    if (saving) {
        storage[board_no].drawings = drawing;
        storage[board_no].title = title_content;
        storage[board_no].name = name_content;
        storage[board_no].caption = caption_content;
        storage[board_no].notes = notes_content;
    }
}

function showDrawing() {
    var drawings = storage[board_no];
    drawing = drawings.drawings;
    
    title_content = drawings.title;
    name_content = drawings.name;
    caption_content = drawings.caption;
    notes_content = drawings.notes;
    thumbnails[board_no].save_caption(drawings.caption);
    thumbnails[board_no].save_name(drawings.name);
    thumbnails[board_no].save_notes(drawings.notes);
    thumbnails[board_no].save_title(drawings.title);
}

function showDrawing2(i) {
    var drawings = storage[i];
    drawing = drawings.drawings;
    
    title_content = drawings.title;
    name_content = drawings.name;
    caption_content = drawings.caption;
    notes_content = drawings.notes;
    thumbnails[i].save_caption(drawings.caption);
    thumbnails[i].save_name(drawings.name);
    thumbnails[i].save_notes(drawings.notes);
    thumbnails[i].save_title(drawings.title);
}

function clearDrawing() {
    saving = false;
    drawing = [];
    saving = true;
    
    saveBoard = get(width/20*1.75,height/5,776,480);
    saved_thumbnails[board_no].change_exist();
    saved_thumbnails[board_no].save_img(saveBoard); 
} 

function initialDOM() {
    textbox.position(-975, 487.5);
    textbox.size(244, 77.5);
    inputDuration.position(-975, 610);
    inputDuration.size(55, 20);
    
    brushButton.position(-175, 25);
    brushButton.size(65, 65);
    brushSlider.position(-355, 55);
    brushSlider.size(100, 25);
    
    squareButton.position(-505, 25);
    circleButton.position(-575, 25);
    squareButton.size(65, 65);
    circleButton.size(65, 65);
    shapeSlider.position(-795, 55);
    shapeSlider.size(100, 25);
    
    eraserButton.position(-945, 25);
    eraserButton.size(65, 65);
    eraserSlider.position(-1115, 55);
    eraserSlider.size(100, 25);
    
    selectBox.position(-1100, 472.5);
    selectBox.size(125, 16);
    submitButton.position(-1225, 487.5);
    submitButton.size(20, 83.5);
    playButton.position(-1050, 585);
    playButton.size(90, 57.5);
    clearButton.position(-1155, 585);
    clearButton.size(90, 57.5);
}

function repositionAll() {
    inputTitle.position(width/20*1.75+776+40, height/5+172.5-160);
    inputTitle.size(264, 30);
    inputName.position(width/20*1.75+776+40, height/5+232.5-160);
    inputName.size(264, 20);
    textbox.position(width/20*1.75+775+40, height/5+542.5-160);
    textbox.size(266, 80);
    inputDuration.position(width/20*15.5, 52.5);
    inputDuration.size(55, 20);
    caption.position(width/20*1.75+776+40,height/5+297.5-160);
    caption.size(260,20);
    notes.position(width/20*1.75+776+40,height/5+405-160);
    notes.size(260,20);
    
    brushButton.position(width/20*1.5, 25);
    brushButton.size(65, 65);
    brushSlider.position(width/20*3.25, 55);
    brushSlider.size(90, 25);
    
    squareButton.position(width/20*5, 25);
    circleButton.position(width/20*6, 25);
    squareButton.size(65, 65);
    circleButton.size(65, 65);
    shapeSlider.position(width/20*8, 55);
    shapeSlider.size(90, 25);
    
    eraserButton.position(width/20*9.75, 25);
    eraserButton.size(65, 65);
    eraserSlider.position(width/20*11.5, 55);
    eraserSlider.size(90, 25);
    
    selectBox.position(width/20*1.75+775+40, height/5+520-160);
    selectBox.size(193.5, 22.5);
    submitButton.position(width/20*1.75+776+233.5, height/5+520.75-160);
    submitButton.size(76.5, 20.75);
    playButton.position(width/20*14.375, 25);
    playButton.size(65, 65);
    clearButton.position(width/20*13, 25);
    clearButton.size(65, 65);
    saveButton.position(width/20*1.75+776/2-50, height/5+480+20);
    saveButton.size(100, 30);
    
    for (let i=0; i<numBoards; i++) {
        artboards[i].x = width/20*1.75;
        artboards[i].y = height/5;
        thumbnails[i].x = width-140;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    repositionAll();
    scrollbar.barX = width-20;
    scrollbar.barH = height;
}