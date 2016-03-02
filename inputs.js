function inputInit(){
	window.cursor={
		down:false,
		x:0,
		y:0,
	};
	document.addEventListener("mousedown", clicked);
	document.addEventListener("mouseup", clicked);
	document.addEventListener("touchstart", clicked);
	document.addEventListener("touchend", clicked);
	document.addEventListener("mousemove", move);
	document.addEventListener("touchmove", touch);
}

//Mouse inputs
function clicked(e){
	cursor.down=!cursor.down;
	if(cursor.down){
		grid.strokeId ++;
	}
}
function move(e){
	cursor.x=e.clientX + document.body.scrollLeft;
	cursor.y=e.clientY + document.body.scrollTop;
}
function touch(e){
	if(e.touches.length<2){
		e.preventDefault();
		cursor.x=e.touches[0].pageX + document.body.scrollLeft;
		cursor.y=e.touches[0].pageY + document.body.scrollTop;
	}
	else{
	}
}