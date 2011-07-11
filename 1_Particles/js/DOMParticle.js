
function DOMParticle(posx, posy, imageSRC, imageWidth, imageHeight) {

	// use this code if you want to use an Image DOM object
	// this.domElement = new Image(); 
	// this.domElement.src = imageSRC;  
	// 
	// this.domElement.style.position = 'absolute';
	
	// and this if you want it to be a div with a background
	this.domElement = document.createElement('div');

	this.domElement.style.background = 'url('+imageSRC+')'; 
	this.domElement.style.position = 'absolute';
	this.domElement.style.display = 'block'; 
	this.domElement.style.width = imageWidth+"px"; 
	this.domElement.style.height = imageHeight+"px";

	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	this.transform3D = false; 
	
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
	
	this.render = function() {
		var dom = this.domElement,
			styleStr,
			//optimised Math.round snaps to pixels
			px = (0.5 + this.posX) >> 0 ,
			py = (0.5 + this.posY) >>0 ;
			
		if(this.transform3D)
			styleStr = "translate3d("+px+"px, "+py+"px, 0px) scale("+this.size+")"; 
		else
		 	styleStr = "translate("+px+"px, "+py+"px) scale("+this.size+")"; 
		
		dom.style.webkitTransform = dom.style.MozTransform = dom.style.OTransform = dom.style.transform = styleStr; 
	};


}


function randomRange(min, max) {
	return ((Math.random()*(max-min)) + min); 
}
