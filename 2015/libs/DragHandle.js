
DragHandle = function(x,y,size,colour) {

	colour = colour || "rgba(255,255,255,0.5)"; 
	size = size || 10; 
	this.pos = new Vector2(x,y); 
	 
	var dom = this.domElement = document.createElement( 'canvas' );
	var ctx = dom.getContext( '2d' );
	
	dom.width = dom.height = size;
	this.halfWidth = size/2; 
	this.halfHeight = size/2; 
	
	ctx.lineWidth = 1.5; 
	ctx.strokeStyle = "#fff"; 
	
	ctx.fillStyle = colour; 
	ctx.fillRect(0,0,size,size); 
	ctx.strokeRect(0,0,size,size); 
	dom.style.zIndex = 1;
	dom.style.position = "absolute";
	dom.style.left = (x-this.halfWidth)+"px"; 
	dom.style.top = (y-this.halfHeight)+"px"; 
	
	dom.dragHandle = this; 
	
	Drag.init(this.domElement); 

	this.domElement.onDrag = function(x,y) {
	
		this.dragHandle.setPos(x,y); 
		if(this.dragHandle.onDrag) this.dragHandle.onDrag(x,y); 
	};
	
	this.setPos = function (x,y) {
		this.pos.reset(x+this.halfWidth, y+this.halfHeight);
	};
		
	

};