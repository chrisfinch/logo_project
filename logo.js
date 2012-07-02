/* 
* Logo.js - an interpreter for the logo language
*
* @author Chris Finch
*/

// Initialize class

window.logo = function () {

	// Initialize canvas element with 2d context
	this.canvas = document.getElementById('canvas');  
	this.ctx = this.canvas.getContext('2d');  
	this.ctx.strokeStyle = '#ffffff';

	// Set starting point, starting orientation and pen state
	this.orientation = 0; //in deg
	this.x = 500;
	this.y = 400;
	this.state = true;

	// Get form
	this.form = document.forms['commandsForm'];
	this.queue = [];

	// Parse textarea contents
	this.parse(this.form['commands'].value, false);

	// Listen for a reset
	var _this = this;
	document.getElementById("reset").addEventListener("click", function (event) { // Monitor form for submit
		event.preventDefault();
		_this.canvas.width = _this.canvas.width;
	}, false);
};

window.logo.prototype = {

	// Take a string of commands, tokenise, repeat if necessary and add to queue
	parse: function (commandString, nested) {

		// split in to token array on space after striping whitespace and line breaks
		var tokens = commandString
		.replace(/(\r\n|\n|\r)/gm," ")
		.replace(/^\s+/, '')
		.replace(/\s+$/, '')
		.toLowerCase()
		.split(/\s+/);
		
		var	token,
			param,
			action;

		// Iterate over tokens array removing commands as they are queued up
		while (tokens.length) {
			
			token = tokens.shift();

			if (token) {
				
				action = this[token]; // set method

				// Do we check for a parameter?
				if (token == 'forward' || 
					token == 'right' || 
					token == 'left' || 
					token == 'repeat' || 
					token == 'color') {

					param = tokens.shift();

				} else {
					param = null;
				}

				// Should we repeat this section?
				if (token == 'repeat') {
					var subTokens= [];
					var nest = 0;
					while (tokens && (tokens[0] != 'end' || nest > 0)) { // Is there anything left in this loop or are we in a nested repeat?
						if (tokens[0] == 'repeat') {
							nest++;
						} else if (tokens[0] == 'end') {
							nest--;
						}
						subTokens.push(tokens.shift());
					}
					tokens.shift();
					for (var i=0; i<param; i++) {
						this.parse(subTokens.join(' '), true); // call self to add repeat instructions, pass nested as false so as not to process queue yet
					}
				} else {
					this.queue.push({ func: action, param: param});
				}
				if (tokens.length == 0 && nested == false) { // all done? process queue...
					this.processQueue();
				}
			}
		}
	},
	
	// Take a queue and execute functions in order after initializing context
	processQueue: function () {
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		for (var i = 0; i < this.queue.length; i++) {
			this.queue[i].func.call(this, this.queue[i].param); // Make sure to execute functions in right context with call()
		}
		this.ctx.stroke(); // Fill in the path - done!
	},

	// Helper function for getting next coordinates
	getCoordinates: function (dist) {
		// Convert degrees to radians with deg*(PI/180)
		var result = {
			x: this.x + Math.cos(this.orientation * (Math.PI/180)) * dist,
			y: this.y + Math.sin(this.orientation * (Math.PI/180)) * dist
		};
		return result;
	},

	// change color
	color: function (color) {
		this.ctx.strokeStyle = color;
	},

	// Draw a line
	forward: function (dist) {
		var r = this.getCoordinates(dist);
		if (this.state) {
			this.ctx.lineTo(r.x,r.y);
		} else {
			this.ctx.moveTo(r.x,r.y);
		}		
		this.x = r.x;
		this.y = r.y;		
	},

	// Change orientation to the right
	right: function (amount) {
		var deg = this.orientation + parseInt(amount, 10);
		if (deg <= 360) {
			this.orientation = deg;
		} else {
			this.orientation = deg - 360;
		}		
	},

	// Change orientation to the left
	left: function (amount) {
		var deg = this.orientation - parseInt(amount, 10);
		if (deg <= 360) {
			this.orientation = deg;
		} else {
			this.orientation = deg - 360;
		}		
	},

	// Draw a line
	penup: function () {
		this.state = false;
	},

	// Move without drawing
	pendown: function () {
		this.state = true;
	}
};

// On load, wait for submit before executing
window.onload = function() {
	document.getElementById("commandsForm").addEventListener("submit", function (event) { // Monitor form for submit
		event.preventDefault();
		var a = new window.logo;
	}, false);
}
