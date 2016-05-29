function main(){
	requestAnimationFrame(main);
	if(cursor.down){
		grid.draw(cursor.x, cursor.y);
	}
	if(changingColor){
		for (var i =0;i < colorInputs.length;i ++){
			selectedColor[i] = colorInputs[i].value;
		}
		colorPreview.style.backgroundColor = "rgb(" + selectedColor[0] + "," + selectedColor[1] + "," + selectedColor[2] + ")";
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
			console.log(brushes[this.value].color)
			grid.changeBrush(brushes[this.value]);
			for (var i = 0;i < colorInputs.length;i ++){
				colorInputs[i].value = brushes[this.value].color[i];
			}
		});
	}

	window.colorInputs = document.getElementsByName("color");
	window.changingColor = false;
	window.colorPreview = document.getElementById("colorPreview");
	window.selectedColor = [0,0,0];
	for(var i=0;i < colorInputs.length;i ++){
		colorInputs[i].addEventListener("mousedown", function(){
			changingColor = true;
		});
		colorInputs[i].addEventListener("mouseup", function(){
			changingColor = false;
		});
		colorInputs[i].addEventListener("change", function(){
			grid.changeColor(selectedColor);
		});
	}
	
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});