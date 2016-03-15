var grid = function(){
	this.id=grid.ID;
	console.log("Created grid " + this.id);
	grid.ID ++;

	document.body.style.width = bodyWidth + "px";
	document.body.style.height = bodyHeight + "px";
	this.strokeId = 0;
	this.prevX;
	this.prevY;
};
grid.ID=0;
var bodyWidth = window.innerWidth;
var bodyHeight = window.innerHeight;

grid.prototype.createCanvas = function(x, y){
	console.log("Creating canvas for grid " + this.id + " at ("+x+", "+y+")");
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
	ctx.lastStroke = this.strokeId;
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
	prevTileX=Math.trunc(this.prevX/255);
	prevTileY=Math.trunc(this.prevY/255);
	currTileX=Math.trunc(x/255);
	currTileY=Math.trunc(y/255);
	//Loop within rectangle of tiles. Top right corner at previous cursor location,
	//bottom left corner at current cursor location
	//On each tile, calculate relative position of the line to draw.
	//If crossing into a new tile, the line's endpionts will be outside the tile
	//Just moveTo() and lineTo() anyway; canvas seems to handle it.
	for(var i = prevTileX;i <= currTileX;i ++){
		for (var j = prevTileY;j <= currTileY;j ++){
			ctx = this.getCtx(i*255, j*255);
			console.log(this.prevX - i * 255, this.prevY - j * 255)
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
	x %= 255;
	y %= 255;
	ctx.moveTo(x, y);
}