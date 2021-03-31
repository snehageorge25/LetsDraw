const clearButton = document.querySelector('.clear')
const stroke_weight = document.querySelector('.stroke-weight')
const color_picker = document.querySelector('.color-picker')
const colors = document.querySelector('.colors');


const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let is_drawing = false;
let draw_color = "black";

let restore_array = [];
let index = -1;

function changeColor(element) {
  draw_color = element.style.background;
}

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopdraw);
canvas.addEventListener("mouseout", stopdraw);

canvas.addEventListener("touchstart", start);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopdraw);


function start(e) {
  is_drawing = true;
  draw(e);
  e.preventDefault();
}

function draw({clientX:x, clientY: y}) {
  if (is_drawing) {
    context.lineWidth = stroke_weight.value;
    context.strokeStyle = draw_color;
    colors.style.background = color_picker.value;
    context.lineCap = "round";
    // context.lineJoin = "round";

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  }

}

function stopdraw(e) {
  if (is_drawing) {
    context.stroke();    
    context.closePath();
    is_drawing = false;
    context.beginPath();
  }
  e.preventDefault();
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;

}

function saveImage() {
  var link = document.getElementById('link');
  link.setAttribute('download', 'LetsDraw.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  index = -1;
}

function undoLast() {
  if( index <= 0 ) {
    clearCanvas();
  } else {
    index -= 1;
    restore_array.pop();
    context.putImageData(restore_array[index], 0, 0);
  }
}

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
