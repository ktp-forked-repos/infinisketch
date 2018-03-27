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
var mode = "draw";

function main(){
	requestAnimationFrame(main);
	if (!brush.down){return;}
	if (brush.px == brush.x && brush.py == brush.y){return;}
	switch (mode) {
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

function modeSwitch(e){
	mode = e.target.id;
	console.log(mode);
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
	document.getElementById("size").addEventListener("change", function(e){
		canvas.setStyle("lineWidth", parseInt(e.target.value));
	});
	document.getElementById("color").addEventListener("change", function(e){
		canvas.setStyle("strokeStyle", e.target.value);
	});
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
window.onerror = function(e){alert(e);}