
function PhysicsParticle(posx, posy)
{

	// the position of the particle
	this.pos = new Vector2(posx, posy); 
	
	// the velocity 
	this.vel = new Vector2(0, 0); 
	
	this.force = new Vector2(0,0); 
	
	// multiply the velocity by this every frame to create
	// drag. A number between 0 and 1, closer to one is 
	// more slippery, closer to 0 is more sticky. values
	// below 0.6 are pretty much stuck :) 
	this.drag = 1; 
	
	this.radius = 10; 
	
	this.update = function() 
	{
	
		// simulate drag
		this.vel.multiplyEq(this.drag); 
		
		this.vel.plusEq(this.force); 
		
		// and the velocity to the position
		this.pos.plusEq(this.vel);
	 
		this.force.reset(0,0); 
	};
	
	this.render = function(c)
	{
		// set the fill style to have the right alpha
		c.strokeStyle = "rgba(255,255,255,"+this.alpha+")";
		
		// draw a circle of the required size
		c.beginPath();
		c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, true);
		c.closePath();
		
		// and fill it
		c.stroke();
	
	};


}


function randomRange(min, max)
{
	return ((Math.random()*(max-min)) + min); 
}
