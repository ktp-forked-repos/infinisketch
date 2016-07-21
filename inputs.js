var cursor = function(){
	this.down = false;
	document.body.addEventListener("mousedown", function(obj){
		return function(e){
			obj.clicked(e);
		}
	}(this));
	document.body.addEventListener("mousemove", function(obj){
		return function(e){
			obj.mouse(e);
		}
	}(this));
	document.body.addEventListener("touchstart", function(obj){
		return function(e){
			obj.tapped(e);
		}
	}(this));
	document.body.addEventListener("touchend", function(obj){
		return function(e){
			obj.tapped(e);
		}
	}(this));
	document.body.addEventListener("touchmove", function(obj){
		return function(e){
			obj.touch(e);
		}
	}(this));
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