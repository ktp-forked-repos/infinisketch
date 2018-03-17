"use strict";

var grid = function(){
	this.id=grid.ID;
	grid.ID ++;

	this.prevX;
	this.prevY;
	this.width=window.innerWidth;
	this.height=window.innerHeight;
	this.cvs;
	this.ctx;
	this.createCanvas();
};
grid.ID=0;

grid.prototype.extendBody = function(x, y){
	var oldCvs = this.cvs;
	this.width += Math.abs(x);
	this.height += Math.abs(y);
	this.createCanvas();
	var offsetX = (0<x)?0:-x;
	var offsetY = (0<y)?0:-y;
	this.ctx.drawImage(oldCvs, offsetX, offsetY);
	window.scrollBy(offsetX, offsetY);
	document.body.removeChild(oldCvs);
}

grid.prototype.createCanvas = function(){
	var x = this.width;
	var y = this.height;
	var canvas = document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.left = 0 + "px";
	canvas.style.top = 0 + "px";
	canvas.id = this.id + "ctx";
	canvas.width = x;
	canvas.height = y;
	canvas.style.width = x;
	canvas.style.height = y;
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0,0,0,1)";
	this.ctx=ctx;
	this.cvs=canvas;
}

grid.prototype.draw = function(x, y){
	this.ctx.moveTo(this.prevX, this.prevY);
	this.ctx.lineTo(x, y);
	this.ctx.stroke();
	this.prevX = x;
	this.prevY = y;
}

grid.prototype.move = function(x, y){
	this.prevX = x;
	this.prevY = y;
	this.ctx.moveTo(x, y);
}