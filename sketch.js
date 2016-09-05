"use strict";

var grid = function(){
	this.id=grid.ID;
	grid.ID ++;

	document.body.style.width = bodyWidth + "px";
	document.body.style.height = bodyHeight + "px";
	this.prevX;
	this.prevY;
	this.ctx;
	this.maxX=-1;this.maxY=-1;
};
grid.ID=0;
var bodyWidth = window.innerWidth;
var bodyHeight = window.innerHeight;

grid.prototype.createCanvas = function(x, y){
	if (x > this.maxX){this.maxX = x;}
	if (y > this.maxY){this.maxY = y;}
	var canvas = document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.left = x* 255 + "px";
	canvas.style.top = y * 255 + "px";
	canvas.id = this.id + "-" + x + "," + y;
	canvas.width = 255;
	canvas.height = 255;
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0,0,0,1)";
	grid[x + "," + y] = ctx;
	this.ctx=ctx;
}

grid.prototype.getCtx = function(x, y){
	var canvasX=Math.trunc(x/255);
	var canvasY=Math.trunc(y/255);
	if(grid[canvasX + "," + canvasY] == null){
		this.createCanvas(canvasX, canvasY);
	}
	this.ctx = grid[canvasX + "," + canvasY];
}

grid.prototype.draw = function(x, y){
	//Calculate the tile locations for previous and current cursor locations
	//Currently only works going downwards, to the right
	var pX=Math.trunc(this.prevX/255);
	var pY=Math.trunc(this.prevY/255);
	var cX=Math.trunc(x/255);
	var cY=Math.trunc(y/255);
	//Loop through all tiles in rectangle. 
	for(var i = Math.min(pX,cX);i <= Math.max(pX,cX);i ++){
		for (var j = Math.min(pY,cY);j <= Math.max(pY,cY);j ++){
			this.getCtx(i*255, j*255);
			//compute coordinates relative to top left of tile
			this.ctx.moveTo(this.prevX - i * 255, this.prevY - j * 255);
			this.ctx.lineTo(x - i * 255, y - j * 255);
			this.ctx.stroke();
		}
	}
	this.prevX = x;
	this.prevY = y;
}

grid.prototype.move = function(x, y){
	this.getCtx(x, y);
	this.prevX = x;
	this.prevY = y;
	x %= 255;
	y %= 255;
	this.ctx.moveTo(x, y);
}