window.VYW = window.VYW || {};
(function(VYW, win) {
	var REFRESH_RATE = 300;

	function SnakeEngine(canvas, settings) {
		this.canvas = canvas;
		this.graphics = new VYW.Graphics(canvas);

		this.settings = typeof settings === 'object' && settings !== null ? settings : {};
		this.settings.boardColor = this.settings.boardColor || '#ffffff';
		this.settings.snakeColor = this.settings.snakeColor || '#000000';
		this.settings.snakeSize = this.settings.snakeSize || 10;

		this.gameTimer = null;
		this.direction = VYW.Direction.Right;
		this.snake = [];

		win.addEventListener('keydown', this.handleKeyDown.bind(this), true);
	}

	SnakeEngine.prototype.handleKeyDown = function(e) {
		if (e.keyCode < VYW.KeyCodes.Left || e.keyCode > VYW.KeyCodes.Down) {
			return;
		}

		var refresh = false;
		if (e.keyCode === VYW.KeyCodes.Left && this.direction !== VYW.Direction.Right && this.direction !== VYW.Direction.Left) {
			this.direction = VYW.Direction.Left;
			refresh = true;
		} else if (e.keyCode === VYW.KeyCodes.Right && this.direction !== VYW.Direction.Right && this.direction !== VYW.Direction.Left) {
			this.direction = VYW.Direction.Right;
			refresh = true;
		} else if (e.keyCode === VYW.KeyCodes.Up && this.direction !== VYW.Direction.Down && this.direction !== VYW.Direction.Up) {
			this.direction = VYW.Direction.Up;
			refresh = true;
		} else if (e.keyCode === VYW.KeyCodes.Down && this.direction !== VYW.Direction.Down && this.direction !== VYW.Direction.Up) {
			this.direction = VYW.Direction.Down;
			refresh = true;
		}

		if (refresh) {
			this.update();
		}
	};

	SnakeEngine.prototype.start = function() {
		clearInterval(this.gameTimer);

		var startX = 20;
		var startY = Math.floor(this.canvas.height / 2);
		var snakeHead = new VYW.SnakePart(new VYW.Point(startX, startY), this.settings.snakeSize, this.settings.snakeColor);
		this.snake.push(snakeHead);

		this.gameTimer = setInterval(this.update.bind(this), REFRESH_RATE);
	};

	var j = 1;
	SnakeEngine.prototype.update = function() {
		this.graphics.clear();
		var p = new VYW.Point(0, 0);
		this.graphics.fillRectangle(p, this.canvas.width, this.canvas.height, this.settings.boardColor);

		for (var i = 0; i < this.snake.length; ++i) {
			this.snake[i].draw(this.graphics);
			this.snake[i].update(this.direction);
		}

		++j;
		if (j % 5 === 0) {
			var snakeTail = new VYW.SnakePart(this.snake[this.snake.length - 1].prevLocation, this.settings.snakeSize, this.settings.snakeColor);
			this.snake.push(snakeTail);
		}
	};

	VYW.SnakeEngine = SnakeEngine;

}(window.VYW, window));