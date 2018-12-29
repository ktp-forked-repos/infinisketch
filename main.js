"use strict"

let brush = {
	p: [0, 0], // position
	d: [0, 0], // delta
	p0: [0, 0],// start position
	"down":false,
	weight: 2,
	palette: [0, 0],
}
let keymap = {
	"a":"pen",
	"s":"eraser",
	"d":"move",
	"f":"zoom"
}
let prevKey = "";
let currTool = "pen";
let sketch = createSketch();


function opt(a, b) {
    if (typeof a !== "undefined") {
        return a;
    }
    return b;
}

function main(){
	requestAnimationFrame(main);
	if (!brush.down){return;}
	if (Math.abs(brush.d[0]) < 1 
			&& Math.abs(brush.d[1]) < 1){
		return;
	}
	if (currTool in tools && "move" in tools[currTool]) {
    	tools[currTool].move({inputs: brush, sketch: sketch, view: canvas});
	}
	brush.d[0] = 0;
	brush.d[1] = 0;
	canvas.render();
}

function down(e){
	if (e.button != 0){return;}
	brush.down=true;
	brush.p[0] = brush.p0[0] = e.pageX;
	brush.p[1] = brush.p0[1] = e.pageY;
	brush.d[0] = brush.d[1] = 0;
	if (currTool in tools && "down" in tools[currTool]) {
	    tools[currTool].down({inputs: brush, sketch: sketch, view: canvas});
	}
}
function up(e){
	brush.down=false;
	if (currTool in tools && "up" in tools[currTool]) {
	   tools[currTool].up({inputs: brush, sketch: sketch, view: canvas});
	}
}
function move(e){
	brush.p[0] = e.pageX;
	brush.p[1] = e.pageY;
	brush.d[0] += e.movementX;
	brush.d[1] += e.movementY;
}

function toolSwitch(e){
	currTool = e.target.id;
}
function changeTool(newTool){
    currTool = newTool;
	document.getElementById(newTool).checked = true;
}

function keyDown(e){
	if (e.key == prevKey){return;}
	prevKey = e.key;
	if (e.key in keymap){
		var newTool = keymap[e.key];
		if (newTool == currTool) {return;}
		changeTool(newTool);
	}
}
function keyUp(e){
	prevKey = "";
    changeTool("pen");
}

function init(){
	console.log("init");
	var palette = document.getElementById("palette")
	window.canvas = createGlview(palette, sketch);
	document.body.appendChild(canvas.domElement);
	canvas.resize();
	var toolSwitches = document.getElementsByClassName("mode");
	for (var i = 0; i < toolSwitches.length; i ++){
		toolSwitches[i].addEventListener("change", toolSwitch);
	}
	window.addEventListener("resize", ()=>(canvas.resize()));
	canvas.domElement.addEventListener("pointerdown", down);
	canvas.domElement.addEventListener("pointerup", up);
	canvas.domElement.addEventListener("pointercancel", up);
	canvas.domElement.addEventListener("pointerout", up);
	canvas.domElement.addEventListener("pointerleave", up);
	canvas.domElement.addEventListener("pointermove", move);
	document.body.addEventListener("keydown", keyDown);
	document.body.addEventListener("keyup", keyUp);
	document.getElementById("lineWidth").addEventListener("change", function(e){
		brush.weight = parseInt(e.target.value);
	});
	document.getElementById("paletteX").addEventListener("change", function(e){
		brush.palette[0] = e.target.value/256;
	});
	document.getElementById("paletteY").addEventListener("change", function(e){
		brush.palette[1] = e.target.value/256;
	});
	main();
}

document.addEventListener("DOMContentLoaded", init);