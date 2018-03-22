"use strict"

var brush = {
	"x":0,
	"y":0,
	"down":false
}
var control = {
	"x":0,
	"y":0
}

function main(){
	requestAnimationFrame(main);
	if(brush.down){
		canvas.draw(brush.x, brush.y);
	}
}

function down(e){
	brush.down=true;
	brush.x=e.pageX;
	brush.y=e.pageY;
	canvas.move(brush.x, brush.y)
}
function up(e){
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
}
function move(e){
	brush.x=e.pageX;
	brush.y=e.pageY;
}

function init(){
	console.log("init");
	window.canvas = new grid();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
window.onerror = function(e){alert(e);}