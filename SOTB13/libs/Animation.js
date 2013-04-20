function Animation(img, w, h, numFrames) {
	
	var img = this.img = img; 
	this.playing = true; 
	this.looping = true;
	this.width = w; 
	this.height = h;
	this.scaleX = 1; 
	this.scaleY = 1; 
	this.x = 0; 
	this.y = 0; 
	
	this.offsetX = 0; 
	this.offsetY = 0; 
	
	if(typeof(numFrames)=='undefined') {
		this.numFrames = Math.floor(img.width/this.width) ;
	} else { 
		this.numFrames = numFrames; 
	}
	
	this.currentFrame = 0; 

	this.gotoAndStop = function( framenum ) {
		this.currentFrame = framenum ;
	};

	this.update = function() {

		
		if( this.playing )
		{
			var nextFrame = this.currentFrame + 1 ;
			if( nextFrame >= this.numFrames )
			{
				if( this.looping ) this.gotoAndStop( 0 ) ;
				else
				{
					this.playing = false; 
					this.gotoAndStop( this.numFrames - 1 ) ; 
				}
			}
			else this.gotoAndStop( nextFrame ) ;			

		}
	};
	
	this.play = function () {
		playing = true; 
	};
	
	this.render = function(ctx) {
			
		var frameOffsetX = this.currentFrame * this.width;
		ctx.save(); 
		ctx.translate(this.x, this.y); 
		ctx.scale(this.scaleX, this.scaleY); 

		ctx.drawImage(img, frameOffsetX, 0, this.width, this.height, this.x, this.y, this.width, this.height ); 
		
		
	};

	this.play = function(){
		this.playing = true; 
	};
	
}