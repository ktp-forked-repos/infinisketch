var grid = function(){
	this.id=grid.ID;
	grid.ID ++;

	document.body.style.width = bodyWidth + "px";
	document.body.style.height = bodyHeight + "px";
	this.prevX;
	this.prevY;
	this.brush;
	window.ctx = {x:-1, y:-1};
};
grid.ID=0;
var bodyWidth = window.innerWidth;
var bodyHeight = window.innerHeight;

grid.prototype.createCanvas = function(x, y){
	canvas = document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.left = x* 255 + "px";
	canvas.style.top = y * 255 + "px";
	canvas.id = this.id + "-" + x + "," + y;
	canvas.width = 255;
	canvas.height = 255;
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.x = x; ctx.y = y;
	grid[x + "," + y] = ctx;
}

grid.prototype.getCtx = function(x, y){
	canvasX=Math.trunc(x/255);
	canvasY=Math.trunc(y/255);
	if(grid[canvasX + "," + canvasY] == null){
		this.createCanvas(canvasX, canvasY);
	}
	ctx = grid[canvasX + "," + canvasY];
	ctx.beginPath();
	ctx.lineWidth = this.brush.lineWidth;
	ctx.strokeStyle = ctx.shadowColor = "rgb(" + this.brush.color[0] + "," + this.brush.color[1] + "," + this.brush.color[2] + ")";
	ctx.shadowBlur = this.brush.blur;
	//ctx.shadowColor = this.brush.color;
	return ctx;
	console.log(this.brush.color);
}

grid.prototype.draw = function(x, y){
	//Calculate the tile locations for previous and current cursor locations
	pX=Math.trunc(this.prevX/255);
	pY=Math.trunc(this.prevY/255);
	cX=Math.trunc(x/255);
	cY=Math.trunc(y/255);
	//Loop through all tiles in rectangle.
	//Can this be optimized?
	for(var i = Math.min(pX,cX);i <= Math.max(pX,cX);i ++){
		for (var j = Math.min(pY,cY);j <= Math.max(pY,cY);j ++){
			if (ctx.x != i || ctx.y != j){
				ctx = this.getCtx(i*255, j*255);
				//compute coordinates relative to top left of tile
				ctx.moveTo(this.prevX - i * 255, this.prevY - j * 255);
			}
			ctx.beginPath();
				ctx.moveTo(this.prevX - i * 255, this.prevY - j * 255);
			ctx.lineTo(x - i * 255, y - j * 255);
			ctx.stroke();
		}
	}
	this.prevX = x;
	this.prevY = y;
}

grid.prototype.move = function(x, y){
	this.prevX = x;
	this.prevY = y;
	ctx.beginPath();
}

grid.prototype.changeBrush = function(newBrush){
	this.brush = newBrush;
	window.ctx = {x:-1, y:-1};
}

grid.prototype.changeColor = function(color){
	console.log("color change");
	this.brush.color = color;
	window.ctx = {x:-1, y:-1};
}