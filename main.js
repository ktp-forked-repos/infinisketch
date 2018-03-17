"use strict"

var brush = {
	"x":0,
	"y":0,
	"dx":0,
	"dy":0,
	"down":false
}

function main(){
	requestAnimationFrame(main);
	if(brush.down){
		canvas.draw(brush.x, brush.y);
	}
}

function init(){
	console.log("init");
	document.body.addEventListener("mousedown", function(){
		brush.down=true;
		canvas.move(brush.x, brush.y)
	});
	document.body.addEventListener("mouseup", function(e){
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
	});
	document.body.addEventListener("mousemove", function(e){
		brush.x=e.clientX + brush.dx;
		brush.y=e.clientY + brush.dy;
	});
	window.addEventListener("scroll", function(){
		brush.dx=document.documentElement.scrollLeft;
		brush.dy=document.documentElement.scrollTop;
	});
	window.canvas = new grid();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
//window.onerror = function(e){alert(e);}