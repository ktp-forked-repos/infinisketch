var grid = function(){
	this.id=grid.ID;
	console.log("Created grid " + this.id);
	grid.ID ++;

	document.body.style.width = bodyWidth + "px";
	document.body.style.height = bodyHeight + "px";
	this.strokeId = 0;
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
	ctx = this.getCtx(x, y);
	if (ctx.lastStroke + 1 != this.strokeId){
		this.move(x, y);
	}
	ctx.lastStroke = this.strokeId;
	x %= 255;
	y %= 255;
	ctx.lineTo(x, y);
	console.log("line to " + x + ", " + y);
	ctx.stroke();
	this.strokeId ++;
}

grid.prototype.move = function(x, y){
	ctx = this.getCtx(x, y);
	x %= 255;
	y %= 255;
	ctx.moveTo(x, y);
	console.log("moved to " + x + ", " + y);
}