function main(){
	requestAnimationFrame(main);
	if(cursor.down){
		grid.draw(cursor.x, cursor.y);
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
	window.cursor = new cursor();
	window.grid = new grid();
	grid.changeBrush(brushes.pencil);

	var brushInputs = document.getElementsByName("brush");
	for (var i=0;i < brushInputs.length;i ++){
		brushInputs[i].addEventListener("change", function(){
			grid.changeBrush(brushes[this.value]);
		});
	}
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});