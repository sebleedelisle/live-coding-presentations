// This code by Seb Lee-Delisle 
// http://seb.ly
// twitter : seb_ly 
// You're free to use this code, but please credit me - thanks!

// state variables 
var STATE_WAITING = 0, 
	STATE_PLAYING = 1, 
	STATE_GAMEOVER = 2, 
	state = STATE_WAITING, 
	counter = 0, 
	gameStartTime = 0, 
	gameFinishTime = 0; 


// game variables

var playerShip, 
	invaders,
	bullets,
	
	particles, 
	stars, 
	
	screenWidth, 
	screenHeight, 
	playerType = Math.floor(Math.random()*5); // this is the browser that is playing

var canvas, 
	ctx; 
	
// load all the images for the ships
var images = []; 
for (var i = 0; i<5; i++) { 
	var img = new Image(); 
	img.src = "png-"+i+".png"; 
	images.push(img);	
}

var explodeSound = new Audio('explode.wav');
var fireSound = new Audio('laser.wav');
fireSound.volume = 0.5;
	
function setup(){
	initVars(); 
	initCanvas(); 
	initObjects(); 
	initListeners(); 

	//startGame(); 
}


function initVars() { 
	screenWidth = 1000; 
	screenHeight = 600; 	
}

function initObjects() { 

	playerShip = new PlayerShip(images[playerType]); 
	bullets = []; 
	invaders = []; 
	
	particles = []; 
	initStars();
}




// MAIN GAME LOOP

function draw() { 

	ctx.clearRect(0,0,canvas.width, canvas.height); 
	
	renderStars(); 
	
	if(state == STATE_PLAYING) { 
		checkKeys(); 
		updateInvaders(); 
		updateBullets();
		updateParticles(); 

		checkCollisions(); 
		
		playerShip.render(ctx); 
		renderInvaders(); 
		renderBullets(); 
		renderParticles();
		renderTimer(); 
		
		if(invaders.length==0) {
			state = STATE_GAMEOVER; 
			gameTime = Date.now()-gameStartTime; 
		}
		
	} else if(state == STATE_GAMEOVER) { 
		
		updateInvaders(); 
		updateBullets();
		updateParticles(); 

		checkCollisions(); 

		playerShip.render(ctx); 
	
		renderBullets(); 
		renderParticles();		
		
		renderMessage("YOUR TIME IS "+milsToTimer(gameTime)); 
		
	} else if(state == STATE_WAITING) { 
		
		updateInvaders(); 
		updateBullets();
		updateParticles(); 

		checkCollisions(); 

		playerShip.render(ctx); 
		renderBullets(); 
		renderParticles();		
		
		renderMessage("HIT FIRE TO PLAY"); 
		
		
	}
	
	counter++; 
}	

function checkKeys() { 
	if(KeyTracker.isKeyDown(Key.LEFT)) {
		playerShip.goLeft(); 
	}
	
	if(KeyTracker.isKeyDown(Key.RIGHT)) {
		playerShip.goRight(); 
	}
	
}

function checkCollisions() { 
	
	for(var i = 0; i<bullets.length; i++) { 
		
		var bullet = bullets[i]; 
		
		for (var j = 0; j<invaders.length; j++) { 
			var invader = invaders[j]; 
		
			if( pointRectPenetrationTest(bullet.pos, invader)) {
				
				makeParticleExplosion(invader.pos, invader.image); 
				explodeSound.currentTime = 0;
				explodeSound.play();
				invaders.splice(j,1); 
				j--; 
				bullets.splice(i,1); 
				i--; 
				break; 
			}
		}
	}
	
}



function pointRectPenetrationTest(point, rect) { 
	if( ((point.x<rect.pos.x + rect.width) && (point.x>rect.pos.x)) &&
			((point.y<rect.pos.y + rect.height) && (point.y>rect.pos.y)) ) { 
		return true; 
	} else { 
		return false; 
	}
}

function rectRectPenetrationTest(rect1, rect2) { 
	if( ((rect1.pos.x<rect2.pos.x + rect2.width) && (rect1.pos.x+rect1.width>rect2.pos.x)) &&
			((rect1.pos.y<rect2.pos.y + rect2.height) && (rect1.pos.y+rect1.height > rect2.pos.y))) { 
		return true; 
	} else { 
		return false; 
	}
}

function startGame() { 
	
	resetPlayer(); 
	resetInvaders(); 
	gameStartTime = Date.now(); 
	state = STATE_PLAYING; 
}

function updateBullets(){
	for(var i = 0 ; i<bullets.length; i++) { 
		var b = bullets[i]; 
		b.update(); 
		if(b.pos.y<0) {
			bullets.splice(i,1); 
			i--; 
		}
	}	
}


function updateInvaders() { 
	
	speed = map(invaders.length, 50,0,0.001,0.1);
	for(var i = 0; i<invaders.length; i++) { 
		invaders[i].update(speed); 
	}
}

function renderBullets() { 
	for(var i = 0; i<bullets.length; i++) { 
		bullets[i].render(ctx); 
	}
}

function renderInvaders() { 
	for(var i = 0; i<invaders.length; i++) { 
		invaders[i].render(ctx); 
	}
}

function renderMessage(msg) { 
	ctx.textAlign = 'center';
	ctx.font = '48pt Helvetica, Arial';
	ctx.fillStyle = hsl(0, 0, (100-(counter*2)%100));
	ctx.fillText(msg, screenWidth/2, screenHeight/2); 
	
}

function renderTimer() { 
	
	var timeElapsed = Date.now()-gameStartTime; 
	ctx.textAlign = 'center';
	ctx.font = '24pt Courier';
	ctx.fillStyle = 'white'
	
	
	ctx.fillText(milsToTimer(timeElapsed), screenWidth/2, 50); 
	
}

function milsToTimer(mils) { 
	var secs = Math.floor(mils/1000);
	

	var cents = Math.floor(mils/10)%100;
	if(cents<10) cents="0"+cents;
	return (secs+":"+cents); 
}
	

function resetPlayer() { 
	
	playerShip.pos.x = (screenWidth-playerShip.width)/2;
}
function resetInvaders() { 

	invaders = []; 
	
	
	var hspacing = 70; 
	var vspacing = 70;
	var numrows = 4; 
	var numcols = 10; 
	var count = 0; 
	for(var x = 0; x<numcols; x++) { 
		for(var y = 0; y<numrows; y++) { 
			invaders.push(new Invader(((screenWidth-(hspacing*numcols))/2)+x*hspacing,vspacing+y*vspacing, images[(y<playerType)?y:y+1], count)); 
			count++;
		}
	}

}


function initCanvas() { 

	canvas = document.createElement('canvas'); 
	ctx = canvas.getContext('2d'); 

	document.body.appendChild(canvas); 
	canvas.width = screenWidth; 
	canvas.height = screenHeight;
	
	
}

function initListeners() { 
	
	KeyTracker.addKeyDownListener(" ", firePressed); 
	KeyTracker.addKeyDownListener(Key.UP, firePressed); 
	document.body.addEventListener("keydown", keyPressed); 

}

function firePressed() { 
	if(state == STATE_PLAYING) { 
		bullets.push(new Bullet(playerShip.pos.x+playerShip.width/2, playerShip.pos.y)); 
		fireSound.play();
		playerShip.fire();
	} else if(state == STATE_WAITING) { 
		startGame(); 
	} 
}

function keyPressed(e) { 

	if (state == STATE_WAITING) { 
		if((e.keyCode>48) && (e.keyCode<=48+images.length)) {
			playerType = e.keyCode-49; 
			resetInvaders(); 
			playerShip.image = images[playerType];
			resetPlayer();
		}
	} else if(state == STATE_GAMEOVER) { 
		if(e.keyCode == 83) { // 'S' to start again 
			state = STATE_WAITING; 
		}
		
		
	}
		
}

//------------------- PLAYER SHIP ---------------------------

function PlayerShip(image) { 
	this.pos = new Vector2(screenWidth/2, screenHeight-70); 
	this.width = image.width; 
	this.height = image.height; 
	this.moveSpeed = 10; 
	this.image = image;
	
	var stretchVel = 0, 
		yScale = 1;
	
	this.render = function(c) { 
	
		stretchVel *= 0.7; 
		stretchVel+= (1 - yScale)*0.5; 
		yScale += stretchVel; 
		c.save(); 
		c.translate(this.pos.x + this.width/2, this.pos.y+this.height/2); 
		c.scale(1/yScale, yScale); 
		c.drawImage(this.image, -this.width/2, -this.height/2); 
		c.restore();
	}	
	
	this.fire = function () { 
		stretchVel += 0.3; 
		
		
		
	}
	
	this.goLeft = function() { 
		this.pos.x-=this.moveSpeed; 
	}
	
	this.goRight = function() { 
		this.pos.x+=this.moveSpeed;
	}
	
}

// -------------------- INVADER -------------------------
function Invader(x,y, image, offset)  {

	this.pos = new Vector2(x,y); 
	this.startPos = this.pos.clone(); 
	this.image = image; 
	this.width = 64; 
	this.height = 64; 
	this.counter = Math.PI/2 + (offset*0.5); 
	
	this.update = function(speed) { 
		this.pos.x=this.startPos.x + Math.sin(this.counter)*300; 
		this.counter+=speed;
		
	}
	
	this.render = function (c) { 
		c.drawImage(this.image,  this.pos.x, this.pos.y);	
	}
	
}

// ---------------------- BULLET -------------------------

function Bullet(x,y) { 
	this.pos = new Vector2(x,y); 
	this.vel = new Vector2(0,-25); 
	this.width = 7; 
	
	this.update = function() { 
		this.pos.plusEq(this.vel); 
		
	}
	this.render = function(c) { 
			
		
		for(var i = 0; i<4;i++) { 
			c.fillStyle = hsl(230,50,map(i,0,3,0,100)); 
			c.fillRect(this.pos.x, this.pos.y -i*8, 4, 8); 
		
		}
		 
		
	}
	
}


//----------------------  PARTICLES -----------------------
function makeParticleExplosion(pos, image){
	
	for(var i = 0; i<60; i++) { 
		
		var p = new Particle(pos.x, pos.y, image); 
		particles.push(p); 
	}
	
	
};
	

function updateParticles(){
	for(var i = 0 ; i<particles.length; i++) { 
		var p = particles[i]; 
		p.update(); 
		if((p.pos.y<0) || (p.size<0.01)) {
			particles.splice(i,1); 
			i--; 
		}

		
	}
	
}

function renderParticles() { 
//	ctx.globalCompositeOperation = 'lighter'; 
	for(var i = 0; i<particles.length; i++) { 
		particles[i].render(ctx); 
	}
	ctx.globalCompositeOperation = 'source-over'; 
}
	 

function Particle(x, y, image) { 
	this.pos = new Vector2(x,y);
	this.vel = new Vector2(random(20,26),0);
	this.vel.rotate(random(360));
	this.size = 0.5; 
	this.image = image; 

	this.update = function() { 
		this.pos.plusEq(this.vel); 
		this.vel.multiplyEq(0.9); 
		this.size*=0.91; 
	//	this.vel.y+=1;
	}
	this.render = function(c) { 
		c.save(); 
		c.translate(this.pos.x, this.pos.y); 
		c.scale(this.size, this.size); 
		
		c.drawImage(this.image, 0,0);
		c.restore();	
		
	}
	
}


//------------------- STAR FIELD ---------------------

function initStars() {
	stars = [];  
	for(var i = 0; i<200; i++) { 
		stars.push(new Star()); 
	}
	
	
}

function renderStars() { 
	for(var i = 0; i<stars.length; i++) { 
		stars[i].render(); 		
	}
}


function Star() { 
	this.pos = new Vector2(random(screenWidth), random(screenHeight)); 
	var z = random(300,2000); 
	this.scale = 250/(250+z); 
	
	this.render = function() { 
		
		this.pos.y+=this.scale*10; 
		while(this.pos.y>screenHeight) {
			this.pos.y-=screenHeight; 
			this.pos.x = random(screenWidth);
		}
		ctx.fillStyle = hsl(230,30,60); 
		ctx.fillRect(this.pos.x, this.pos.y, this.scale*10, this.scale*10); 
		
		
	}

}

