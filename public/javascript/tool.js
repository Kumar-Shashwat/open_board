
let optionCont = document.querySelector(".option-cont");
let optionIcon = document.querySelector(".option-icon");
let toolCont = document.querySelector(".tool-cont");

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");

let optionStatus = true;
let pencilStatus = false;
let eraserStatus = false;

let notes = document.querySelector(".notes");
let upload = document.querySelector(".upload");

optionCont.addEventListener("click", (e) => {
    optionStatus = !optionStatus;

    if(optionStatus) showHamburger();
    else showClose();
})

function showHamburger(){
    optionIcon.innerHTML = "menu";
    toolCont.style.display = "flex";
}

function showClose(){
    optionIcon.innerHTML = "close";
    toolCont.style.display = "none";

    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}


pencil.addEventListener("click", (e) => {
    pencilStatus = !pencilStatus;

    if(pencilStatus) showPencilToolCont();
    else hidePencilToolCont();

    eraserStatus = false;
})

function showPencilToolCont(){
    pencilToolCont.style.display = "flex";
    eraserToolCont.style.display = "none";

}

function hidePencilToolCont(){
    pencilToolCont.style.display = "none";
}


eraser.addEventListener("click", (e) => {

    eraserStatus = !eraserStatus;

    if(eraserStatus) showEraserToolCont();
    else hideEraserToolCont();

    pencilStatus = false;
})

function showEraserToolCont(){

    eraserToolCont.style.display = "flex";
    pencilToolCont.style.display = "none";
}

function hideEraserToolCont(){
    eraserToolCont.style.display = "none";
}

upload.addEventListener("click", (e) =>{

    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

    let template = `
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>

    <div class="footer">
        <img class = "upload-img" src = "${url}" />
    </div>
    `;

    createNoteCont(template);

    })
    
})


function createNoteCont(template){
    
        let notesCont = document.createElement("div");
        notesCont.setAttribute("class", "notes-cont");
        notesCont.setAttribute("draggable", "true");

        notesCont.innerHTML = template;

        document.body.appendChild(notesCont);

        // drag and drop functionalities will be added later. copy code form the internet.

        let minimize = notesCont.querySelector(".minimize");
        let remove = notesCont.querySelector(".remove");
        notesActions(minimize, remove, notesCont);

        notesCont.onmousedown = function (event) {
            dragAndDrop(notesCont, event);
        };
    
        notesCont.ondragstart = function () {
            return false;
        };
   

}

function dragAndDrop(element, event){

    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}




notes.addEventListener("click", (e) => {

    let template = `
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>

    <div class="footer">
        <textarea spellcheck = "false" ></textarea>
    </div>
    `;

    createNoteCont(template);
    
})


function notesActions(minimize, remove, notesCont){
    remove.addEventListener("click", (e) =>{
        notesCont.remove();
    })

    minimize.addEventListener("click", (e) => {
        let footer = notesCont.querySelector(".footer");
        let footerDisplay = getComputedStyle(footer).getPropertyValue("display");

        if(footerDisplay === "none") footer.style.display = "block";
        else    footer.style.display  = "none";
    })
}





