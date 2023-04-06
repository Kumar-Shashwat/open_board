let pencilColor = document.querySelectorAll(".pencil-color");
let pencilRangeCont = document.querySelector(".pencil-range-cont");
let eraserRangeCont = document.querySelector(".eraser-range-cont");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Api
let tool = canvas.getContext("2d");

let mouseDownStatus = false;

let penColor = pencilColor[0].classList[1]
let penWidth = pencilRangeCont.value

let eraserColor = "white";
let eraserWidth = eraserRangeCont.value;

let undoRedoTracker = [];
let track = 0;

let currentColor  = penColor;
let currentWidth = penWidth;

tool.strokeStyle = currentColor ;
tool.lineWidth = currentWidth;


canvas.addEventListener("mousedown", (e) =>{
    mouseDownStatus = true;
    
    let data = {
        x: e.clientX,
        y: e.clientY,
        color : currentColor,
        width : currentWidth
    }
    // send data to server
    socket.emit("beginPath", data);

    
})

canvas.addEventListener("mousemove", (e) => {

    if(mouseDownStatus === true){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color : currentColor,
            width : currentWidth
        }
        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouseDownStatus = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
 })


 undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObject) {
    tool.beginPath();
    tool.moveTo(strokeObject.x, strokeObject.y );
    tool.strokeStyle = strokeObject.color;
    tool.lineWidth = strokeObject.width;
}

function drawStroke(strokeObject){

    tool.lineTo(strokeObject.x, strokeObject.y);
    tool.stroke();
    tool.strokeStyle = strokeObject.color;
    tool.lineWidth = strokeObject.width;
}

pencilColor.forEach( (colorElem) => {
    colorElem.addEventListener("click", (e) =>{
        penColor = colorElem.classList[1];
        currentColor = penColor; 
    })
})

pencilRangeCont.addEventListener("change", (e) => {
    penWidth = pencilRangeCont.value;
    currentWidth = penWidth;
})


eraserRangeCont.addEventListener("change", (e) => {
    eraserWidth = eraserRangeCont.value;
    currentWidth = eraserWidth;
})

eraser.addEventListener("click" , (e) => {

    
    if(eraserStatus)
    {
        console.log("eraser Activated.")

        currentColor = eraserColor;
        currentWidth = eraserWidth;
    }
    else {
        console.log("eraser Deactivated.")
        
        currentColor = penColor;
        currentWidth = penWidth;
    }
})



pencil.addEventListener("click", (e) =>{
    currentColor = penColor;
    currentWidth = penWidth;
})



download.addEventListener("click", (e) => {

    let url = canvas.toDataURL();
    
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("redoUndo", (data) => {
    undoRedoAction(data);
})
