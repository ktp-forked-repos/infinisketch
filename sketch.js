"use strict";

var grid = function(){
	this.id=grid.ID;
	grid.ID ++;

	this.scale=window.devicePixelRatio;
	this.prevX;
	this.prevY;
	this.toExtend = [0,0];
	this.width=this.scale*window.innerWidth;
	this.height=this.scale*window.innerHeight;
	this.center = [this.width/2, this.height/2];
	this.view = [window.innerWidth/2 * this.scale, window.innerHeight/2*this.scale];
	this.cvs;
	this.ctx;
	this.createCanvas();
};
grid.ID=0;

grid.prototype.extendBody = function(x, y){
	var oldCvs = this.cvs;
	var oldCtx = this.ctx;
	this.width += this.scale * Math.abs(x);
	this.height += this.scale * Math.abs(y);
	this.createCanvas();
	this.ctx.lineWidth = oldCtx.lineWidth;
	this.ctx.strokeStyle = oldCtx.strokeStyle;
	var offsetX = (0<x)?0:-x;
	var offsetY = (0<y)?0:-y;
	this.ctx.drawImage(oldCvs, offsetX*this.scale, offsetY*this.scale);
	this.scroll(offsetX, offsetY);
	document.body.removeChild(oldCvs);
}
grid.prototype.scroll = function(x, y){
	this.center[0] += x * this.scale;
	this.center[1] += y * this.scale;
	this.reposition();
}
grid.prototype.reposition = function(){
	this.cvs.style.left = (this.view[0] - this.center[0])/this.scale + "px";
	this.cvs.style.top = (this.view[1] - this.center[1])/this.scale + "px";
}
grid.prototype.rescale = function(fac){
	this.scale *= fac;
	this.view = [window.innerWidth/2 * this.scale, window.innerHeight/2*this.scale];
	this.cvs.style.width = (this.width/this.scale)+"px";
	this.cvs.style.height = (this.height/this.scale) + "px";
	this.reposition();
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
	this.ctx=ctx;
	this.cvs=canvas;
}

grid.prototype.setStyle = function(param, val){
	this.ctx[param] = val;
}
grid.prototype.draw = function(x, y){
	x = x*this.scale +this.center[0]-this.view[0];
	y = y*this.scale +this.center[1]-this.view[1];
	//this.ctx.moveTo(this.prevX, this.prevY);
	this.ctx.lineTo(x, y);
	this.ctx.stroke();
	this.prevX = x;
	this.prevY = y;
	if (x > this.width-100){
		this.toExtend[0] = 255;
	}
	if (y > this.height-100){
		this.toExtend[1] = 255;
	}
	if (x < 100){
		this.toExtend[0] = -255;
	}
	if (y < 100){
		this.toExtend[1] = -255;
	}
}
grid.prototype.erase = function(x, y){
	x = x*this.scale +this.center[0]-this.view[0];
	y = y*this.scale +this.center[1]-this.view[1];
	var r = this.ctx.lineWidth * 10;
	this.ctx.clearRect(x-r/2, y-r/2, r, r);
}

grid.prototype.move = function(x, y){
	x = x*this.scale +this.center[0]-this.view[0];
	y = y*this.scale +this.center[1]-this.view[1];
	this.prevX = x;
	this.prevY = y;
	this.ctx.moveTo(x, y);
	this.ctx.beginPath();
}
grid.prototype.strokeEnd = function(){
	if (this.toExtend[0] != 0 || this.toExtend[1] != 0){
		this.extendBody(this.toExtend[0], this.toExtend[1]);
	}
	this.toExtend = [0,0];
}