
var canvas, ctx, 
	leftDown, rightDown; 

var playerShip, 
	invaders, 
	bullets, particles; 

var screenHeight, screenWidth; 

init();

function init() { 

	screenWidth = window.innerWidth; 
	screenHeight = window.innerHeight; 

	canvas = document.createElement('canvas'); 
	document.body.appendChild(canvas); 
	canvas.width = screenWidth; 
	canvas.height = screenHeight; 
	ctx = canvas.getContext('2d'); 
	
	window.addEventListener('keydown', keyDown); 
	window.addEventListener('keyup', keyUp); 
	
	playerShip = new PlayerShip(screenWidth/2,screenHeight-80); 
	
	bullets = []; 
	particles = [];
	resetInvaders(); 
		
	setInterval(loop, 1000/50); 

}

function loop() {
	ctx.clearRect(0,0,screenWidth, screenHeight); 
	checkKeys(); 
	
	updateBullets(); 
	
	checkCollisions(); 
	
	
	
	renderBullets(); 
	renderInvaders(); 
	updateParticles(); 
	playerShip.render(ctx); 	
}

function checkCollisions() { 
	

	for(var i = 0; i<bullets.length; i++) { 
		var bullet = bullets[i]; 
		
		for(var j = 0; j<invaders.length; j++) { 
			var invader = invaders[j]; 
			
			if( (bullet.x > invader.x) && (bullet.x < invader.x + invader.width)
				&& (bullet.y >invader.y) && (bullet.y < invader.y +invader.height)) { 
					
				invaders.splice(j, 1); 
				j--; 
				bullets.splice(i,1); 
				i--; 
				
				makeExplosion(invader.x +invader.width/2, invader.y+invader.height/2)
					
			}
			
			
			
		}
		
	}
	
	
}



function resetInvaders() { 
	invaders = []; 
	
	for(var col = 0; col <10; col++) { 
		for(var row = 0; row<4; row++ ) {
			var invader = new Invader(col * 80, row*60); 
			invaders.push(invader); 
			
		}
	}
	
}

function updateBullets() { 
	for(var i =0; i<bullets.length; i++) { 
		
		bullets[i].update(); 
	}
	
	
}
function renderBullets() { 
	for(var i =0; i<bullets.length; i++) { 
		
		bullets[i].render(ctx); 
	}
	
	
}


function updateParticles() { 
	for(var i =0; i<particles.length; i++) { 
		particles[i].update(); 
		particles[i].render(ctx); 
	}
	
	
}


function renderInvaders() { 
	for(var i =0; i<invaders.length; i++) { 
		
		invaders[i].render(ctx); 
	}
	
	
}

function checkKeys() { 
	
	if(leftDown) { 
		playerShip.x -=10; 
	} else if(rightDown) { 
		playerShip.x +=10; 
	}
	
}

function keyDown(e) { 
	
	if(e.keyCode == 37) { 
		leftDown = true; 
	} else if (e.keyCode == 39) { 
		rightDown = true; 
	} 
	
	if(e.keyCode == 32) { 
		var bullet = new Bullet(playerShip.x + playerShip.width/2, playerShip.y); 
		bullets.push(bullet); 
	}
}

function keyUp(e) { 

	if(e.keyCode == 37) { 
		leftDown = false; 
	} else if (e.keyCode == 39) { 
		rightDown = false; 
	}
}


function PlayerShip(x, y) { 
	
	this.x = x; 
	this.y = y; 
	this.width = 60; 
	this.height = 40; 
	
	this.render = function (ctx) { 
		ctx.fillStyle = 'white'; 
		ctx.fillRect(this.x, this.y, this.width, this.height); 
	}
	
	
	
}


function Bullet(x, y) { 
	
	this.x = x; 
	this.y = y; 
	
	this.update = function () { 
		this.y -=20; 
		
		
	}
	this.render = function (ctx) { 
		ctx.fillStyle = 'white'; 
		ctx.fillRect(this.x, this.y, 4,10); 
	}
	
	
	
}


function Invader(x, y) { 
	
	this.x = x; 
	this.y = y; 
	this.width = 60; 
	this.height = 40; 
	
	this.render = function (ctx) { 
		ctx.fillStyle = 'red'; 
		ctx.fillRect(this.x, this.y, this.width, this.height); 
	}
	
}
function Particle(x, y) { 
	
	this.x = x; 
	this.y = y; 
	this.velX = Math.random()* 20 -10; 
	this.velY = Math.random()* 20 -10;
	this.size = 10; 
	this.update = function() { 
		this.x += this.velX; 
		this.y += this.velY; 
		
	}
	this.render = function (ctx) { 
		ctx.fillStyle = 'red'; 
		ctx.fillRect(this.x, this.y, this.size, this.size); 
	}
	
}

function makeExplosion(x, y) { 
	for(var i = 0; i<100; i++ ) { 
		
		var p =  new Particle(x,y); 
		particles.push(p); 
		
		
		
	}
	
	
}







