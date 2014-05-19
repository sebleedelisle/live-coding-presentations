function Particle(posx, posy) {

	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	
	// multiply the particle size by this every frame
	this.shrink = 1; 
	this.size = 1; 
	
	// multiply the velocity by this every frame to create
	// drag. A number between 0 and 1, closer to one is 
	// more slippery, closer to 0 is more sticky. values
	// below 0.6 are pretty much stuck :) 
	this.drag = 1; 
	
	// add this to the yVel every frame to simulate gravity
	this.gravity = 0; 
	
	// current transparency of the image
	this.alpha = 1; 
	// subtracted from the alpha every frame to make it fade out
	this.fade = 0; 

	this.update = function() {
	
		// simulate drag
		this.velX *= this.drag; 
		this.velY *= this.drag;
		
		// add gravity force to the y velocity 
		this.velY += this.gravity; 
		
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		
		// shrink the particle
		this.size *= this.shrink;
		
		// and fade it out
		this.alpha -= this.fade; 
	 
	};
	
	this.render = function(c) {
		
		if(this.alpha<0.01) return; 
		
		// set the fill style to have the right alpha
		c.fillStyle = "rgba(255,255,255,"+this.alpha+")";
		
		// draw a circle of the required size
		c.beginPath();
		c.arc(this.posX, this.posY, this.size, 0, Math.PI*2, true);
	
		// and fill it
		c.fill();
	
	};


}
