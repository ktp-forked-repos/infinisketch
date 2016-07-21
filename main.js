function main(){
	requestAnimationFrame(main);
	if(brush.down){
		grid.draw(brush.x, brush.y);
	}
}

function extendBody(x, y){
	extendX = x + window.innerWidth;
	extendY = y + window.innerHeight;
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
	window.brush = new cursor();
	window.grid = new grid();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});