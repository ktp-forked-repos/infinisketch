"use strict"

var brush = {
	"x":0,
	"y":0,
	"down":false
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
	e.preventDefault();
	brush.down=true;
	canvas.move(e.touches[0].pageX, e.touches[0].pageY);
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

function init(){
	console.log("init");
	document.body.addEventListener("mousemove", function(e){
		brush.x=e.pageX;
		brush.y=e.pageY;
	});
	document.body.addEventListener("touchmove", function(e){
		brush.x=e.touches[0].pageX;
		brush.y=e.touches[0].pageY;
	});
	window.canvas = new grid();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
//window.onerror = function(e){alert(e);}