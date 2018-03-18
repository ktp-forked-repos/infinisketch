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
	e.preventDefault();
	brush.down=true;
	canvas.move(brush.x, brush.y)
}
function tdown(e){
	if (e.touches.length == 1){
		e.preventDefault();
	}
	brush.down=true;
	canvas.move(e.touches[0].pageX, e.touches[0].pageY);
	brush.x = e.touches[0].pageX;
	brush.y = e.touches[0].pageY;
}
function up(e){
	e.preventDefault();
	brush.down=false;
	if (brush.x > canvas.width-100){
		canvas.extendBody(255,0);
	}
	if (brush.y > canvas.height-100){
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
function tmove(e){
	if (e.touches.length == 1){
		e.preventDefault();
	}
	brush.x=e.touches[0].pageX;
	brush.y=e.touches[0].pageY;
}

function init(){
	console.log("init");
	window.canvas = new grid();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
window.onerror = function(e){alert(e);}