"use strict"

let brush = {
	p: [0, 0], // position
	d: [0, 0], // delta
	p0: [0, 0],// start position
	"down":false
}
let keymap = {
	"a":"draw",
	"s":"erase",
	"d":"move",
	"f":"zoom"
}
let prevKey = "";
let currMode = "draw";


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
	switch (currMode) {
		case "draw":
			canvas.draw(brush.p);
			break;
		case "erase":
			canvas.erase(brush.p);
			break;
		case "move":
			canvas.pan(brush.d);
			break;
		case "zoom":
			var fac = 1- Math.abs(brush.d[1])/100;
			if (brush.d[1] > 0){
				canvas.zoom(fac);
			} else {
				canvas.zoom(1/fac);
			}
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
	canvas.move(brush.p);
}
function up(e){
	brush.down=false;
	canvas.strokeEnd();
}
function move(e){
	brush.p[0] = e.pageX;
	brush.p[1] = e.pageY;
	brush.d[0] += e.movementX;
	brush.d[1] += e.movementY;
}

function modeSwitch(e){
	currMode = e.target.id;
}
function changeMode(newMode){
    currMode = newMode;
	document.getElementById(newMode).checked = true;
}

function keyDown(e){
	if (e.key == prevKey){return;}
	prevKey = e.key;
	if (e.key in keymap){
		var newMode = keymap[e.key];
		if (newMode == currMode) {return;}
		changeMode(newMode);
	}
}
function keyUp(e){
	prevKey = "";
    changeMode("draw");
}

function init(){
	console.log("init");
	var palette = document.getElementById("palette")
	window.canvas = new GlSketch(palette);
	document.body.appendChild(canvas.domElement);
	canvas.resize();
	var modeSwitches = document.getElementsByClassName("mode");
	for (var i = 0; i < modeSwitches.length; i ++){
		modeSwitches[i].addEventListener("change", modeSwitch);
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
		canvas.setStyle("lineWidth", parseInt(e.target.value));
	});
	document.getElementById("paletteX").addEventListener("change", function(e){
		canvas.setStyle("paletteX", e.target.value/256);
	});
	document.getElementById("paletteY").addEventListener("change", function(e){
		canvas.setStyle("paletteY", e.target.value/256);
	});
	main();
}

document.addEventListener("DOMContentLoaded", init);