Key = new (function() {
	this.UP = 38; 
	this.LEFT = 37; 
	this.RIGHT = 39; 
	this.DOWN = 40; 
	this.SPACE = 32; 
})(); 


KeyTracker = new (function(){
	
	this.keysPressed = {}; 

	var keyDownListeners = this.keyDownListeners = []; 
	var keyUpListeners = this.keyUpListeners = []; 
		
	this.isKeyDown = function (key) { 
		if (typeof key == 'string')
			key = key.charCodeAt(0); 
		return(this.keysPressed[key]);
	};
	
	document.addEventListener("keydown", function(e) {	
		
		
		for(var i = 0; i<keyDownListeners.length; i++) { 
			if((e.keyCode == keyDownListeners[i].key ) && (!KeyTracker.keysPressed[e.keyCode])) keyDownListeners[i].func();  
			
		}
		
		KeyTracker.keysPressed[e.keyCode] = true; 
		
		//console.log('key down '+e.keyCode); 
		}); 
		
	document.addEventListener("keyup", 	function(e) {
		KeyTracker.keysPressed[e.keyCode] = false;
		
			for(var i = 0; i<keyUpListeners.length; i++) { 
				if(e.keyCode == keyUpListeners[i].key ) keyUpListeners[i].func();  

			}
		
		//console.log('key up '+e.keyCode); 
		
		}); 
		
	this.addKeyDownListener = function(key, func) { 
		
		if (typeof key == 'string')
			key = key.charCodeAt(0); 
		
		this.keyDownListeners.push({key:key, func:func});
		
	}
	
	this.addKeyUpListener = function(key, func) { 
		
		if (typeof key == 'string')
			key = key.charCodeAt(0); 
		
		this.keyUpListeners.push({key:key, func:func});
		
	}
	
		
})();