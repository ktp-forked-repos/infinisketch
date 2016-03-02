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
	canvas.style = "position:absolute;left:" + x*255 + "px;top:" + y*255 + "px;";
	canvas.id = this.id + "-" + x + "," + y;
	canvas.width = 255;
	canvas.height = 255;
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0,0,0,1)";
	//ctx.fillText("("+x+", "+y+")", 0,10);
	ctx.lastStroke = this.strokeId;
	grid[x + "," + y] = ctx;
}

grid.prototype.draw = function(x, y){
	extendBody(x, y);
	canvasX=Math.trunc(x/255);
	canvasY=Math.trunc(y/255);
	x=x%255;
	y=y%255;
	if(grid[canvasX + "," + canvasY] == null){
		this.createCanvas(canvasX, canvasY);
	}
	ctx=grid[canvasX + "," + canvasY];
	if (ctx.lastStroke +1 < this.strokeId){
		ctx.moveTo(x, y);
	}
	ctx.lastStroke = this.strokeId;
	ctx.lastX = x;
	ctx.lastY = y;
	ctx.lineTo(x, y);
	this.strokeId ++;
	ctx.stroke();
}

function extendBody(x, y){
	extendX = x + window.innerWidth;
	extendY = y + window.innerHeight;
	if (extendX > bodyWidth + 255){
		document.body.style.width = extendX + "px";
		bodyWidth = extendX;
	}
	if (extendY > bodyHeight + 255){
		document.body.style.height = extendY + "px";
		bodyHeight = extendY;
	}
}