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
	{"lineWidth":4, "strokeStyle":"#DD1111"},
	{"lineWidth":4, "strokeStyle":"#11DD11"},
	{"lineWidth":4, "strokeStyle":"#1111DD"},
]

function main(){
	requestAnimationFrame(main);
	if (!brush.down){return;}
	if (brush.px == brush.x && brush.py == brush.y){return;}
	switch (currMode()) {
		case "draw":
			canvas.draw(brush.x, brush.y);
			break;
		case "erase":
			canvas.erase(brush.x, brush.y);
			break;
		case "move":
			canvas.scroll(brush.px - brush.x, brush.py - brush.y);
			break;
		case "zoom":
			var fac = 1- Math.abs(brush.py - brush.y)/100;
			if (brush.py > brush.y){
				canvas.rescale(fac);
			} else {
				canvas.rescale(1/fac);
			}
	}
	brush.px = brush.x;
	brush.py = brush.y;
}

function down(e){
	console.log("cvs down");
	brush.down=true;
	brush.x = brush.px = brush.x0 = e.pageX;
	brush.y = brush.py = brush.y0 = e.pageY;
	canvas.move(brush.x, brush.y)
}
function up(e){
	console.log("cvs up");
	brush.down=false;
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
		console.log(i);
		canvas.setStyle(i, newstyle[i]);
		document.getElementById(i).value = newstyle[i];
	}
}

function keyDown(e){
	if (e.key == prevKey){return;}
	prevKey = e.key;
	console.log(prevKey);
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
	window.canvas = new grid();
	var modeSwitches = document.getElementsByClassName("mode");
	for (var i = 0; i < modeSwitches.length; i ++){
		modeSwitches[i].addEventListener("change", modeSwitch);
	}
	document.body.addEventListener("pointerdown", down);
	document.body.addEventListener("pointerup", up);
	document.body.addEventListener("pointermove", move);
	document.body.addEventListener("keydown", keyDown);
	document.body.addEventListener("keyup", keyUp);
	document.getElementById("lineWidth").addEventListener("change", function(e){
		canvas.setStyle("lineWidth", parseInt(e.target.value));
	});
	document.getElementById("strokeStyle").addEventListener("change", function(e){
		canvas.setStyle("strokeStyle", e.target.value);
	});
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
window.onerror = function(e){alert(e);}