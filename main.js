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

function extendBody(x, y){
	var extendX = x + window.innerWidth;
	var extendY = y + window.innerHeight;
	if (extendX > bodyWidth + 255){
		document.body.style.width = extendX + "px";
		bodyWidth = extendX;
	}
	if (extendY > bodyHeight + 255){
		document.body.style.height = extendY + "px";
		bodyHeight = extendY;
	}
}

function init(){
	console.log("init");
	document.body.addEventListener("mousedown", function(){
		brush.down=true;
	});
	document.body.addEventListener("mouseup", function(e){
		brush.down=false;
		extendBody(e.clientX, e.clientY);
	});
	document.body.addEventListener("mousemove", function(e){
		brush.x=e.clientX;
		brush.y=e.clientY;
	});
	window.canvas = new grid();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
//window.onerror = function(e){alert(e);}