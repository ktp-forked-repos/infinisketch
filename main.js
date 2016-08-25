function main(){
	requestAnimationFrame(main);
	if(brush.down){
		grid.draw(brush.x, brush.y);
	}
	if (window.innerHeight > window.innerWidth){
		var scrollmap = [2, 0];
		var reversex=1;
	}
	else{
		var scrollmap = [0,2];
		var reversex=-1;
	}
	var scrollSpeed = [0,0];
	for (var i = 0;i < scrollmap.length;i ++){
		var tilt = loc.tilt[scrollmap[i]];
		if (tilt > 10){
			scrollSpeed[i] = tilt - 10;
		}
		if (tilt < -10){
			scrollSpeed[i] = tilt + 10;
		}
	}
	window.scrollBy(reversex*scrollSpeed[0], scrollSpeed[1]);
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

function init(){
	console.log("init");
	var handlers = {
		mousedown:function(){grid.move(brush.x, brush.y);},
		touchstart:function(){grid.move(brush.x, brush.y);},
		mouseup:function(){extendBody(brush.x, brush.y);},
		touchend:function(){extendBody(brush.x, brush.y);}
	}
	window.brush = new cursor(handlers);
	window.grid = new grid();
	window.loc = new tracker();
	main();
}

document.addEventListener("DOMContentLoaded", function(event) {init()});
//window.onerror = function(e){alert(e);}