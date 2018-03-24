"use strict";

var grid = function(){
	this.id=grid.ID;
	grid.ID ++;

	this.scale=window.devicePixelRatio;
	this.prevX;
	this.prevY;
	this.width=this.scale*window.innerWidth;
	this.height=this.scale*window.innerHeight;
	this.center = [this.width/this.scale/2, this.height/this.scale/2];
	this.cvs;
	this.ctx;
	this.createCanvas();
};
grid.ID=0;

grid.prototype.extendBody = function(x, y){
	var oldCvs = this.cvs;
	this.width += this.scale * Math.abs(x);
	this.height += this.scale * Math.abs(y);
	this.createCanvas();
	var offsetX = (0<x)?0:-x;
	var offsetY = (0<y)?0:-y;
	this.ctx.drawImage(oldCvs, offsetX, offsetY);
	this.scroll(offsetX/this.scale, offsetY/this.scale);
	document.body.removeChild(oldCvs);
}
grid.prototype.scroll = function(x, y){
	this.center[0] += x;
	this.center[1] += y;
	this.reposition();
}
grid.prototype.reposition = function(){
	this.cvs.style.left = (window.innerWidth/2 - this.center[0])/this.scale + "px";
	this.cvs.style.top = (window.innerHeight/2 - this.center[1])/this.scale + "px";
}

grid.prototype.createCanvas = function(){
	var x = this.width;
	var y = this.height;
	var canvas = document.createElement("canvas");
	canvas.id = this.id + "ctx";
	canvas.width = x;
	canvas.height = y;
	canvas.style.width = (x/this.scale)+"px";
	canvas.style.height = (y/this.scale) + "px";
	canvas.style.touchAction="none";
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0,0,0,1)";
	canvas.addEventListener("pointerdown", down);
	canvas.addEventListener("pointerup", up);
	canvas.addEventListener("pointermove", move);
	this.ctx=ctx;
	this.cvs=canvas;
}

grid.prototype.draw = function(x, y){
	x *= this.scale;
	y *= this.scale;
	//this.ctx.moveTo(this.prevX, this.prevY);
	this.ctx.lineTo(x, y);
	this.ctx.stroke();
	this.prevX = x;
	this.prevY = y;
	if (x > this.width/this.scale-100){
		this.extendBody(255,0);
	}
	if (y > this.height/this.scale-100){
		this.extendBody(0,255);
	}
	if (x < 100){
		this.extendBody(-255,0);
	}
	if (y < 100){
		this.extendBody(0,-255);
	}
}

grid.prototype.move = function(x, y){
	x *= this.scale;
	y *= this.scale;
	this.prevX = x;
	this.prevY = y;
	this.ctx.moveTo(x, y);
}
