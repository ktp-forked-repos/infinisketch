"use strict"

var brush = {
	"x":0,
	"y":0,
	"down":false
}
var dir = {
	"down":false,
	"mode":"",
	"size":75,
	"T":60,
	"rect":NaN,
	"dt":0,
	"x":0,
	"y":0
}

function main(){
	requestAnimationFrame(main);
	if(brush.down){
		canvas.draw(brush.x, brush.y);
	}
	scroll();
}
function scroll(){
	if (Math.abs(dir.x) < dir.size/3 && Math.abs(dir.y) < dir.size/3){return;}
	if (!dir.down){return;}
	if (dir.mode == "scroll"){
		window.scrollBy(scrollCurve(dir.x), scrollCurve(dir.y));
	}
	if (dir.mode == "button"){
		dir.dt --;
		if (dir.dt > 0){return;}
		dir.dt = dir.T;
		if (dir.x > dir.size/3){
			window.scrollBy(50,0);
		} else if (dir.x < -dir.size/3) {
			window.scrollBy(-50,0);
		}
		if (dir.y > dir.size/3){
			window.scrollBy(0,50);
		} else if (dir.y < -dir.size/3) {
			window.scrollBy(0,-50);
		}
	}
}
function scrollCurve(n){
	return (n-dir.size/3)/5;
}

function down(e){
	console.log("cvs down");
	brush.down=true;
	brush.x=e.pageX;
	brush.y=e.pageY;
	canvas.move(brush.x, brush.y)
}
function up(e){
	console.log("cvs up");
	brush.down=false;
	if (brush.x > canvas.width/canvas.scale-100){
		canvas.extendBody(255,0);
	}
	if (brush.y > canvas.height/canvas.scale-100){
		canvas.extendBody(0,255);
	}
	if (brush.x < 100){
		canvas.extendBody(-255,0);
	}
	if (brush.y < 100){
		canvas.extendBody(0,-255);
	}
	//document.body.style.width=canvas.width/canvas.scale + "px";
	//document.body.style.height=canvas.height/canvas.scale + "px";
}
function move(e){
	brush.x=e.pageX;
	brush.y=e.pageY;
}

function dirDown(e){
	console.log("dir down");
	dir.dt = 0;
	dirLoc(e);
	if (Math.abs(dir.x) < 25 && Math.abs(dir.y) < 25){
		dir.mode = "scroll";
	} else {
		dir.mode = "button";
	}
	dir.down=true;
}
function dirUp(){
	console.log("dir up");
	dir.down=false;
}
function dirMove(e){
	if (!dir.down){return;}
	dirLoc(e);
}
function dirLoc(e){
	dir.x = e.clientX - dir.size - dir.rect.x;
	dir.y = e.clientY - dir.size - dir.rect.y;
}

function init(){
	console.log("init");
	window.canvas = new grid();
	var dirE = document.getElementById("direction")
	dirE.addEventListener("pointermove", dirMove);
	dirE.addEventListener("pointerdown", dirDown);
	dirE.addEventListener("pointerup", dirUp);
	dir.elem = dirE;
	dir.rect = dirE.getBoundingClientRect();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
window.onerror = function(e){alert(e);}