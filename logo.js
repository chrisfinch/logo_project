/* 
* Logo.js - an interpreter for the logo programming language
*
* @author Chris Finch
*/

window.logo = {};

logo.processCommands = function (commandString, ctx) {
	//console.log(commandString, this);

	var txt = 'forward 50 right 90 forward 50 right 90 penup forward 25 pendown forward 25 right 90 forward 50  ';
	var arr = txt.split(' ');
	
	this.orientation = 270; //in deg
	this.x = 250;
	this.y = 250;
	this.state = true;

	ctx.beginPath();
	ctx.moveTo(this.x, this.y);

	for (i=0; i<arr.length; i++) {
		
		switch (arr[i]) {
			
			case 'forward':

				console.log(arr[i], arr[i+1]);

				var r = this.getCoordinates(arr[i+1]);

				if (this.state) {
					ctx.lineTo(r.x,r.y);
				} else {
					ctx.moveTo(r.x,r.y);
				}

				this.x = r.x;
				this.y = r.y;

			break;

			case 'right':
				
				console.log(arr[i], arr[i+1]);

				var deg = this.orientation + parseInt(arr[i+1], 10);

				if (deg <= 360) {
					this.orientation = deg;
				} else {
					this.orientation = deg - 360;
				}

			break;

			case 'penup':
				this.state = false;
			break;

			case 'pendown':
				this.state = true;
			break;
		}

	}

	ctx.stroke(); 

}

logo.getCoordinates = function (dist) {
	
	console.log(this.orientation);

	var result = {
		x: this.x + Math.cos(this.orientation * (Math.PI/180)) * dist,
		y: this.y + Math.sin(this.orientation * (Math.PI/180)) * dist
	};

	return result;
}

var myFunction = function () {

	var canvas = document.getElementById('canvas');  
	var ctx = canvas.getContext('2d');  
	var form = document.forms['form'];

	logo.processCommands(form['commands'].value, ctx);

	return false;
	

// ctx.beginPath();  
// ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle  
// ctx.moveTo(110,75);  
// ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)  
// ctx.moveTo(65,65);  
// ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye  
// ctx.moveTo(95,65);  
// ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye  
// ctx.stroke();  

// ctx.beginPath();  
// ctx.moveTo(75,50);  
// ctx.lineTo(100,75);  
// ctx.lineTo(100,25);  
// ctx.fill();  
}


//window.addEventListener('load', myFunction, false);