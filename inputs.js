var cursor = function(){
	this.down = false;
	document.body.addEventListener("mousedown", function(e){cursor.clicked(e)});
	document.addEventListener("mouseup", function(e){cursor.clicked(e)});
	document.addEventListener("touchstart", function(e){cursor.tapped(e)});
	document.addEventListener("touchend", function(e){cursor.tapped(e)});
	document.addEventListener("mousemove", function(e){cursor.mouse(e)});
	document.addEventListener("touchmove", function(e){cursor.touch(e)});
}

//Mouse inputs
cursor.prototype.clicked = function(e){
	this.down=!this.down;
	this.move(e);
	grid.move(this.x, this.y);
}
cursor.prototype.tapped = function(e){
	if (e.changedTouches.length <= 1){
		this.clicked(e);
	}
	else{
		this.down = false;
	}
}
cursor.prototype.mouse = function(e){
	this.move(e);
}
cursor.prototype.touch = function(e){
	if (e.touches.length <= 1){
		e.preventDefault();	
	}
	this.move(e);
}
cursor.prototype.move = function(e){
	this.x = e.clientX + document.body.scrollLeft || e.touches[0].pageX;
	this.y = e.clientY + document.body.scrollTop || e.touches[0].pageY;

	extendBody(this.x, this.y);
}