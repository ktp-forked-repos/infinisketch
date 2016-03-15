var grid = function(){
	this.id=grid.ID;
	grid.ID ++;

	document.body.style.width = bodyWidth + "px";
	document.body.style.height = bodyHeight + "px";
	this.prevX;
	this.prevY;
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
	grid[x + "," + y] = ctx;
}

grid.prototype.getCtx = function(x, y){
	canvasX=Math.trunc(x/255);
	canvasY=Math.trunc(y/255);
	if(grid[canvasX + "," + canvasY] == null){
		this.createCanvas(canvasX, canvasY);
	}
	return grid[canvasX + "," + canvasY];
}

grid.prototype.draw = function(x, y){
	//Calculate the tile locations for previous and current cursor locations
	//Currently only works going downwards, to the right
	pX=Math.trunc(this.prevX/255);
	pY=Math.trunc(this.prevY/255);
	cX=Math.trunc(x/255);
	cY=Math.trunc(y/255);
	//Loop through all tiles in rectangle. 
	for(var i = Math.min(pX,cX);i <= Math.max(pX,cX);i ++){
		for (var j = Math.min(pY,cY);j <= Math.max(pY,cY);j ++){
			ctx = this.getCtx(i*255, j*255);
			//compute coordinates relative to top left of tile
			ctx.moveTo(this.prevX - i * 255, this.prevY - j * 255);
			ctx.lineTo(x - i * 255, y - j * 255);
			ctx.stroke();
		}
	}
	this.prevX = x;
	this.prevY = y;
}

grid.prototype.move = function(x, y){
	ctx = this.getCtx(x, y);
	this.prevX = x;
	this.prevY = y;
	x %= 255;
	y %= 255;
	ctx.moveTo(x, y);
}