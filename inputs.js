var cursor = function(){
	this.down = false;
	this.x = this.y = this.prevX = this.prevY = -1;
	document.body.addEventListener("mousedown", function(e){cursor.clicked(e)});
	console.log(document.body.onmousedown);
	document.addEventListener("mouseup", function(e){cursor.clicked(e)});
	document.addEventListener("touchstart", function(e){cursor.tapped(e)});
	document.addEventListener("touchend", function(e){cursor.tapped(e)});
	document.addEventListener("mousemove", function(e){cursor.mouse(e)});
	document.addEventListener("touchmove", function(e){cursor.touch(e)});
}

//Mouse inputs
cursor.prototype.clicked = function(e){
	this.down=!this.down;
	grid.strokeId ++;
}
cursor.prototype.tapped = function(e){
	if (e.changedTouches.length <= 1){
		this.down = !this.down;
		grid.strokeId ++;
		this.touch(e);
	}
	else{
		this.down = false;
	}
}
cursor.prototype.mouse = function(e){
	x = e.clientX + document.body.scrollLeft;
	y = e.clientY + document.body.scrollTop;
	this.move(x, y);
}
cursor.prototype.touch = function(e){
	if (e.touches.length <= 1){
		e.preventDefault();	
	}
	x = e.touches[0].pageX;
	y = e.touches[0].pageY;
	this.move(x, y);
}
cursor.prototype.move = function(x, y){
	extendBody(x, y);
	this.prevX = this.x;
	this.prevY = this.y;
	this.x = x;
	this.y = y;
}