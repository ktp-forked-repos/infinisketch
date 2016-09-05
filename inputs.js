//Sketch- Accel, array helpers
"use strict";

var inputs = function(objHandlers, customHandlers){
	console.log("inputs");
	for (event in objHandlers){
		window.addEventListener(event, function(obj){
			var objFunc = objHandlers[event];
			if (customHandlers){var customFunc = customHandlers[event];}
			return function(e){
				obj[objFunc](e);
				if (customFunc){customFunc(e);}
			};
		}(this));
	}
}

var cursor = function(customHandlers){
	console.log("cursor");
	var handlers = {
		mousedown:"clicked",
		mouseup:"clicked",
		mousemove:"mouse",
		touchstart:"tapped",
		touchend:"tapped",
		touchmove:"touch"
	};
	inputs.call(this, handlers, customHandlers);
	this.down = false;
	this.x=window.innerWidth/2;
	this.y=window.innerHeight/2;
	this.dragStart=[0,0];
	this.drag=[0,0];
}

//Mouse inputs
cursor.prototype.clicked = function(e){
	this.down=!this.down;
	this.move(e);
	this.dragStart=[this.x,this.y];
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
	if (this.down){
		this.drag=[this.x - this.dragStart[0], this.y - this.dragStart[1]];
	}
}
cursor.prototype.touch = function(e){
	if (e.touches.length <= 1){
		e.preventDefault();	
	}
	this.move(e);
	this.drag=[this.x - this.dragStart[0], this.y - this.dragStart[1]];
}
cursor.prototype.move = function(e){
	this.x = e.clientX + document.body.scrollLeft || e.changedTouches[0].pageX;
	this.y = e.clientY + document.body.scrollTop || e.changedTouches[0].pageY;
}

var tracker = function(customHandlers){
	console.log("tracker");
	var handlers = {
		devicemotion:"move",
		deviceorientation:"rotate"
	}
	inputs.call(this, handlers, customHandlers);
	this.pos=[0,0,0];
	this.velocity=[0,0,0];
	this.accel=[0,0,0];
	this.tilt=[0,0,0];
	this.lastSample = new Date().getTime();
}
tracker.prototype.move = function(e){
	var now = new Date().getTime();
	var elapsed = now - this.lastSample;
	var a = e.acceleration;
	this.accel = [a.x, a.y, a.z];

	var dv = this.accel.copy();
	dv.mult(elapsed/1000);
	this.velocity.add(dv);

	var dx = this.velocity.copy();
	dx.mult(elapsed/1000);
	this.pos.add(dx);

	this.lastSample = now;
}
tracker.prototype.rotate = function(e){
	this.tilt = [e.beta, e.alpha, e.gamma];
}

//Helpers
Array.prototype.copy = function(){
	var dup = [];
	for (var i = 0;i < this.length;i ++){
		dup[i] = this[i];
	}
	return dup;
}
Array.prototype.max = function(){
	var max = this[0];
	for (var i = 1;i < this.length;i ++){
		if (this[i] > max){max = this[i];}
	}
	return max;
}
Array.prototype.min = function(){
	var min = this[0];
	for (var i = 1;i < this.length;i ++){
		if (this[i] < min){min = this[i];}
	}
	return min;
}
Array.prototype.add = function(by){
	if (by.length != this.length){throw "DIM Mismatch";}
	for (var i =0;i < this.length;i ++){
		this[i] += by[i];
	}
}
Array.prototype.mult = function(by){
	if (typeof by != "number"){throw "Type error: Give a number.";}
	for (var i = 0;i < this.length;i ++){
		this[i] *= by;
	}
}
Array.prototype.toHTML = function(){
	var str ="";
	for (var i = 0;i < this.length;i ++){
		str += this[i] + "<br/>";
	}
	return str;
}