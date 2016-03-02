function main(){
	requestAnimationFrame(main);
	debugOut.innerHTML="Cursor: ("+cursor.x+", "+cursor.y+") \nDown: " + cursor.down;
	if(cursor.down){
		grid.draw(cursor.x, cursor.y);
	}
}

function init(){
	console.log("init");
	inputInit();
	window.grid = new grid();
	window.debugOut=document.getElementById("debug");
	main();
}

console.log("start");
document.addEventListener("DOMContentLoaded", function(event) {init()});