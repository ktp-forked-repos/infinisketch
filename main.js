"use strict"

var brush = {
	"x":0,
	"y":0,
	"px":0,
	"py":0,
	"x0":0,
	"y0":0,
	"responded":true,
	"down":false
}
var modeStack = ["draw"];
var keymap = {
	"a":"draw",
	"s":"erase",
	"d":"move",
	"f":"zoom"
}
var prevKey = "";

var styles = [
	{"lineWidth":2, "strokeStyle":"#222222"},
	{"lineWidth":4, "strokeStyle":"#c55f39"},
	{"lineWidth":2, "strokeStyle":"#222222"},
	{"lineWidth":2, "strokeStyle":"#98a292"},
	{"lineWidth":2, "strokeStyle":"#37c345"},
	{"lineWidth":2, "strokeStyle":"#37c3be"},
	{"lineWidth":2, "strokeStyle":"#ffa8bc"},
	{"lineWidth":2, "strokeStyle":"#8c421c"},
	{"lineWidth":2, "strokeStyle":"#7df088"},
	{"lineWidth":2, "strokeStyle":"#54f2b9"},
]

function opt(a, b) {
    if (typeof a !== "undefined") {
        return a;
    }
    return b;
}

function main(){
	requestAnimationFrame(main);
	if (!brush.down){return;}
	if (Math.abs(brush.px - brush.x) < 1 
			&& Math.abs(brush.py - brush.y) < 1){
		return;
	}
	switch (currMode()) {
		case "draw":
			canvas.draw([brush.x, brush.y]);
			break;
		case "erase":
			canvas.erase([brush.x, brush.y]);
			break;
		case "move":
			canvas.pan([brush.px - brush.x, brush.py - brush.y]);
			break;
		case "zoom":
			var fac = 1- Math.abs(brush.py - brush.y)/100;
			if (brush.py > brush.y){
				canvas.zoom(fac);
			} else {
				canvas.zoom(1/fac);
			}
	}
	brush.px = brush.x;
	brush.py = brush.y;
	canvas.render();
}

function down(e){
	if (e.button != 0){return;}
	brush.down=true;
	brush.x = brush.px = brush.x0 = e.pageX;
	brush.y = brush.py = brush.y0 = e.pageY;
	canvas.move([brush.x, brush.y]);
}
function up(e){
	brush.down=false;
	if (Math.abs(brush.x-brush.x0) < 2 && Math.abs(brush.y-brush.y0) < 2) {
		canvas.draw([brush.x+2, brush.y+2]);
	}
	canvas.strokeEnd();
}
function move(e){
	brush.x=e.pageX;
	brush.y=e.pageY;
}

function currMode(){
	return modeStack[modeStack.length-1];
}
function modeSwitch(e){
	modeStack = [e.target.id];
	console.log(currMode());
}
function changeMode(newMode){
	document.getElementById(newMode).checked = true;
	console.log(currMode());
}
function changeStyle(newstyle){
	for (var i in newstyle){
		canvas.setStyle(i, newstyle[i]);
		document.getElementById(i).value = newstyle[i];
	}
}

function keyDown(e){
	if (e.key == prevKey){return;}
	prevKey = e.key;
	if (e.key in keymap){
		var newMode = keymap[e.key];
		if (newMode == currMode()){return;}
		modeStack.push(newMode);
		changeMode(newMode);
	} else if (parseInt(e.key) < styles.length){
		changeStyle(styles[parseInt(e.key)]);
	}
}
function keyUp(e){
	prevKey = "";
	if (modeStack.length == 1){return;}
	var i = modeStack.indexOf(keymap[e.key]);
	if (i == modeStack.length-1) {
		modeStack.pop();
		changeMode(currMode());
	} else {
		modeStack.splice(i, 1);
	}
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
	document.body.addEventListener("pointerdown", down);
	document.body.addEventListener("pointerup", up);
	document.body.addEventListener("pointercancel", up);
	document.body.addEventListener("pointerout", up);
	document.body.addEventListener("pointerleave", up);
	document.body.addEventListener("pointermove", move);
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

document.addEventListener("DOMContentLoaded", function(event) {init()});
// window.onerror = function(e){alert(e);}