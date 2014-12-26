window.VYW = window.VYW || {};
(function(VYW) {
	/**
	 * Define some enums and common classes/utils
	 */

	/**
	 * A game state enum
	 */
	VYW.GameState = {
		Paused: 0,
		Running: 1,
		End: 2
	};

	/**
	 * Keyboard key codes enum
	 */
	VYW.KeyCodes = {
		Pause: 32,
		Left: 37,
		Up: 38,
		Right: 39,
		Down: 40
	};

	/**
	 * Snake direction enum
	 */
	VYW.Direction = {
		Left: 0,
		Up: 1,
		Right: 2,
		Down: 3
	};

	/**
	 * The game settings class
	 * @param {object} settings - An object with initial game settings
	 * @constructor
	 */
	VYW.GameSettings = function(settings) {
		settings = typeof settings === 'object' && settings !== null ? settings : {};

		this.boardColor = settings.boardColor || '#ffffff';
		this.snakeColor = settings.snakeColor || '#000000';
		this.pelletColor = settings.pelletColor || '#ff3300';
		this.boxSize = settings.boxSize || 10;
		this.maxPellets = settings.maxPellets || 3;
		this.pelletsProbability = settings.pelletsProbability || 0.1;
		this.initialSnakeSize = settings.initialSnakeSize || 6;
	};

	/**
	 * Inherit the prototype methods from one constructor into another.
	 * @param {function} ctor - Constructor function which needs to inherit the prototype.
	 * @param {function} superCtor - Constructor function to inherit prototype from.
	 */
	VYW.inherits = function(ctor, superCtor) {
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	};

}(window.VYW));

window.VYW = window.VYW || {};
(function(VYW) {

	/**
	 * Creates a new Rectangle instance
	 * @param {number} x - Upper left corner x
	 * @param {number} y - Upper left corner y
	 * @param {number} width - The rectangle width
	 * @param {number} height - The rectangle height
	 * @constructor
	 */
	function Rectangle(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
	 * Clones the rectangle
	 * @returns {Rectangle}
	 */
	Rectangle.prototype.clone = function() {
		return new Rectangle(this.x,  this.y, this.width, this.height);
	};

	/**
	 * Check if the dst Rectangle equals to this rectangle
	 * @param {Rectangle} dst - The Rectangle to compare to
	 * @returns {boolean}
	 */
	Rectangle.prototype.equals = function(dst) {
		return this.x === dst.x && this.y === dst.y && this.width === dst.width && this.height === dst.height;
	};

	/**
	 * Creates a new Graphics instance
	 * @param {object} canvas - An HTML Canvas element
	 * @constructor
	 */
	function Graphics(canvas) {
		if (!canvas || canvas.nodeName.toLowerCase() !== 'canvas') {
			throw new Error('canvas is mandatory and must be a canvas element');
		}

		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
	}

	/**
	 * Clears the drawing canvas
	 */
	Graphics.prototype.clear = function() {
		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
	};

	/**
	 * Draws a rectangle filled with color
	 * @param {Rectangle} rect - The rectangle to fill
	 * @param {string} [color='#000000'] - The rectangle color
	 */
	Graphics.prototype.fillRectangle = function(rect, color) {
		this.context.beginPath();
		this.context.rect(rect.x, rect.y, rect.width, rect.height);
		this.context.fillStyle = color || '#000000';
		this.context.fill();
	};

	VYW.Graphics = Graphics;
	VYW.Rectangle = Rectangle;

}(window.VYW));

window.VYW = window.VYW || {};
(function(VYW) {

	/**
	 * Creates a new game board instance
	 * @param {number} w - The board width
	 * @param {number} h - The board height
	 * @param {number} boxSize - The box size of each box on the board
	 * @param {string} color - The board color
	 * @constructor
	 */
	function Board(w, h, boxSize, color) {
		this.rectangle = new VYW.Rectangle(0, 0, w, h);
		this.boxSize = boxSize;
		this.color = color;

		// Hold the number of boxes we can have on the board on X/Y axis
		this.horizontalBoxes = Math.floor(this.rectangle.width / this.boxSize);
		this.verticalBoxes = Math.floor(this.rectangle.height / this.boxSize);
	}

	/**
	 * Convert a box index to screen location
	 * @param {number} boxIndex - A box index
	 * @returns {number} The screen location on the box
	 */
	Board.prototype.toScreen = function(boxIndex) {
		// Make sure that boxIndex is integer
		return Math.floor(boxIndex) * this.boxSize;
	};

	/**
	 * Draws the board
	 * @param {Graphics} graphics - The game graphics
	 */
	Board.prototype.draw = function(graphics) {
		graphics.clear();
		graphics.fillRectangle(this.rectangle,  this.color);
	};

	VYW.Board = Board;

}(window.VYW));

window.VYW = window.VYW || {};
(function(VYW) {

	/**
	 * Creates a new Pellet instance
	 * @param {number} x - The pellet x location
	 * @param {number} y - The pellet y location
	 * @param {number} size - The pellet size
	 * @param {string} color - The pellet color
	 * @constructor
	 */
	function Pellet(x, y, size, color) {
		this.location = new VYW.Rectangle(x, y, size, size);
		this.size = size;
		this.color = color;
	}

	/**
	 * The Pellet update method
	 */
	Pellet.prototype.update = function() {
		// Nothing now, but maybe can switch colors or whatever....
	};

	/**
	 * Draws the Pellet
	 * @param {Graphics} graphics - The game graphics
	 */
	Pellet.prototype.draw = function(graphics) {
		graphics.fillRectangle(this.location,  this.color);
	};

	VYW.Pellet = Pellet;

}(window.VYW));


window.VYW = window.VYW || {};
(function(VYW) {

	/*
	 * This file contains 3 classes that represents the snake.
	 * 1) SnakePart - This is an abstract class that have the common snake part (link) feature
	 * 2) SnakeBody - Part of the snake that is not the head
	 * 3) SnakeHead - The part of the snake that is the head
	 *
	 * I did this because a SnakeBody and a SnakeHead have a slightly different behavior (different update method)
	 */

	/* ---- SnakePart -----*/

	/**
	 * Creates a new SnakePart instance
	 * @param {number} x - The SnakePart x location
	 * @param {number} y - The SnakePart y location
	 * @param {number} size - The SnakePart size
	 * @param {string} color - The SnakePart color
	 * @abstract
	 */
	function SnakePart(x, y, size, color) {
		this.location = new VYW.Rectangle(x, y, size, size);
		this.size = size;
		this.color = color;
		this.prevLocation = null;
	}

	/**
	 * Draws the snake part onto graphics
	 * @param {Graphics} graphics - The game graphics
	 */
	SnakePart.prototype.draw = function(graphics) {
		graphics.fillRectangle(this.location,  this.color);
	};

	/**
	 * Updates the snake state
	 */
	SnakePart.prototype.update = function() {
		// Save the current location as previous
		this.prevLocation = this.location.clone();
	};

	/* ---- END SnakePart -----*/


	/* ---- SnakeBody -----*/

	function SnakeBody(x, y, size, color, following) {
		SnakePart.call(this, x, y, size, color);
		this.following = following;

		if (!(this.following instanceof SnakePart)) {
			throw new Error('SnakeBody must be following someone...');
		}
	}
	// Inherit from SnakePart
	VYW.inherits(SnakeBody, SnakePart);

	SnakeBody.prototype.update = function() {
		// Do the base update
		SnakePart.prototype.update.call(this);

		// We are just followers here...
		this.location = this.following.prevLocation;
	};

	/* ---- END SnakeBody -----*/

	/* ---- SnakeHead -----*/

	function SnakeHead(x, y, size, color) {
		SnakePart.call(this, x, y, size, color);
		this.direction = null;
	}
	// Inherit from SnakePart
	VYW.inherits(SnakeHead, SnakePart);

	SnakeHead.prototype.update = function(newDirection) {
		// Do the base update
		SnakePart.prototype.update.call(this);

		// Update the head direction according to the new direction, MAKE SURE we can do the change (can't do 180 degrees turns)
		if (newDirection === VYW.Direction.Right && this.direction !== VYW.Direction.Left) {
			this.direction = newDirection;
		} else if (newDirection === VYW.Direction.Left && this.direction !== VYW.Direction.Right) {
			this.direction = newDirection;
		} else if (newDirection === VYW.Direction.Up && this.direction !== VYW.Direction.Down) {
			this.direction = newDirection;
		} else if (newDirection === VYW.Direction.Down && this.direction !== VYW.Direction.Up) {
			this.direction = newDirection;
		}

		// Update location based on updated direction
		switch (this.direction) {
			case VYW.Direction.Right:
				this.location.x += this.size;
				break;
			case VYW.Direction.Left:
				this.location.x -= this.size;
				break;
			case VYW.Direction.Up:
				this.location.y -= this.size;
				break;
			case VYW.Direction.Down:
				this.location.y += this.size;
				break;
		}
	};

	/* ---- END SnakeHead -----*/

	// Expose the classes
	VYW.SnakeBody = SnakeBody;
	VYW.SnakeHead = SnakeHead;

}(window.VYW));


window.VYW = window.VYW || {};
(function(VYW, win) {
	var REFRESH_RATE = 100;

	/**
	 * Creates a new snake game
	 * @param {object} canvas - The Canvas DOM element
	 * @param {object} [settings] - The game settings
	 * @constructor
	 */
	function SnakeEngine(canvas, settings) {
		this.canvas = canvas;
		this.graphics = new VYW.Graphics(canvas);
		this.settings = new VYW.GameSettings(settings);

		this.gameState = VYW.GameState.Paused;
		this.direction = VYW.Direction.Right;
		this.snake = [];
		this.pellets = [];
		this.board = new VYW.Board(this.canvas.width, this.canvas.height, this.settings.boxSize, this.settings.boardColor);

		// Bind to the window key-down event
		win.onkeydown = this.handleKeyDown.bind(this);
	}

	/**
	 * Starts the game
	 */
	SnakeEngine.prototype.start = function() {
		// Create the snake head, we create it vertically centered
		var startX = this.settings.boxSize * this.settings.initialSnakeSize;
		var startY = this.board.toScreen(this.board.verticalBoxes / 2);
		var snakePart = new VYW.SnakeHead(startX, startY, this.settings.boxSize, this.settings.snakeColor);
		this.snake.push(snakePart);

		// Create the initial snake body
		for (var i = 0; i < this.settings.initialSnakeSize-1; ++i) {
			startX -= this.settings.boxSize;
			snakePart = new VYW.SnakeBody(startX, startY, this.settings.boxSize, this.settings.snakeColor, this.snake[this.snake.length-1]);
			this.snake.push(snakePart);
		}

		// Set the game state to running and run the timer
		this.gameState = VYW.GameState.Running;
		setTimeout(this.update.bind(this), REFRESH_RATE);
	};

	/**
	 * Toggle the game state
	 * @param {boolean} gameOver - Whether the game is over
	 */
	SnakeEngine.prototype.toggleGameState = function(gameOver) {
		// If game over just color the canvas
		if (gameOver) {
			this.canvas.style.borderColor = 'red';
			this.gameState = VYW.GameState.End;
			return;
		}

		// Toggle between Pause/Running
		if (this.gameState === VYW.GameState.Running) {
			this.canvas.style.borderColor = 'orange';
			this.gameState = VYW.GameState.Paused;
		} else if (this.gameState === VYW.GameState.Paused) {
			this.canvas.style.borderColor = 'green';
			this.gameState = VYW.GameState.Running;
			// Important to call update as there is no Timer running
			this.update();
		}
	};

	/**
	 * Starts the game update process
	 */
	SnakeEngine.prototype.update = function() {
		if (this.gameState !== VYW.GameState.Running) {
			return;
		}

		// Draw the board first
		this.board.draw(this.graphics);

		// Update snake location and draw it
		for (var i = 0; i < this.snake.length; ++i) {
			this.snake[i].update(this.direction);
			this.snake[i].draw(this.graphics);
		}

		// Check if the snake collides with itself or out-of-bounds
		var collision = this.checkCollision();
		if (collision) {
			this.toggleGameState(true);
			return;
		}

		// Check if the snake eats a pellet
		this.eatAndAddPellet();

		// Draw the pellets
		for (i = 0; i < this.pellets.length; ++i) {
			this.pellets[i].update();
			this.pellets[i].draw(this.graphics);
		}

		// Reload the timer
		setTimeout(this.update.bind(this), REFRESH_RATE);
	};

	/**
	 * Checks if the snake collides with itself ot out-of-bounds
	 * @returns {boolean} Whether there was a collision
	 */
	SnakeEngine.prototype.checkCollision = function() {
		// Check if the head is out-of-bounds
		if (this.snake[0].location.x < 0 ||
			this.snake[0].location.y < 0 ||
			this.snake[0].location.x + this.snake[0].size > this.canvas.width ||
			this.snake[0].location.y + this.snake[0].size > this.canvas.height) {

			return true;
		}

		// Check if the snake head collides with body
		for (var i = 1; i < this.snake.length; ++i) {
			if (this.snake[0].location.equals(this.snake[i].location)) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Check if the snake eats a pellet, add new ones if necessary
	 */
	SnakeEngine.prototype.eatAndAddPellet = function() {
		// Check if the snake head collides with pellet
		for (var i = 0; i < this.pellets.length; ++i) {
			if (this.snake[0].location.equals(this.pellets[i].location)) {
				// Create a SnakePart that would be the new snake tail
				var currTail = this.snake[this.snake.length-1];
				var newSnakeTail = new VYW.SnakeBody(currTail.prevLocation.x, currTail.prevLocation.y, this.settings.boxSize, this.settings.snakeColor, currTail);
				this.snake.push(newSnakeTail);

				// Remove this pellet
				this.pellets.splice(i, 1);
				break;
			}
		}

		// Check if we should add a new pellet
		if (this.pellets.length < this.settings.maxPellets && Math.random() < this.settings.pelletsProbability) {
			this.addPellet();
		}
	};

	/**
	 * Adds a new pellet to the game
	 */
	SnakeEngine.prototype.addPellet = function() {
		// Keep loop until we found a spot for a pellet (theoretically this can turn into an infinite loop, so a solution could
		// be to stop the random search after X times and look for a spot on the board).
		var keepSearch = true;
		while (keepSearch) {
			keepSearch = false;

			// Take a random spot on the board
			var x = Math.random() * this.board.horizontalBoxes;
			var y = Math.random() * this.board.horizontalBoxes;
			x = this.board.toScreen(x);
			y = this.board.toScreen(y);
			var pellet = new VYW.Pellet(x, y, this.settings.boxSize, this.settings.pelletColor);

			// check if the spot is vacant
			for (var i = 0; i < this.snake.length; ++i) {
				if (this.snake[i].location.equals(pellet.location)) {
					keepSearch = true;
					break;
				}
			}

			if (!keepSearch) {
				// Hooray we can add the pellet
				this.pellets.push(pellet);
			}
		}
	};

	/**
	 * Handles a key down event
	 * @param {object} e - The event args
	 * @private
	 */
	SnakeEngine.prototype.handleKeyDown = function(e) {
		switch (e.keyCode) {
			case VYW.KeyCodes.Pause:
				this.toggleGameState(false);
				break;
			case VYW.KeyCodes.Left:
				this.direction = VYW.Direction.Left;
				break;
			case VYW.KeyCodes.Right:
				this.direction = VYW.Direction.Right;
				break;
			case VYW.KeyCodes.Up:
				this.direction = VYW.Direction.Up;
				break;
			case VYW.KeyCodes.Down:
				this.direction = VYW.Direction.Down;
				break;
		}
	};

	VYW.SnakeEngine = SnakeEngine;

}(window.VYW, window));

