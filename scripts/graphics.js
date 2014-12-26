window.VYW = window.VYW || {};
(function(VYW) {

	/**
	 * Creates a new Point instance
	 * @param {number} x - The x coordinate
	 * @param {number} y - The y coordinate
	 * @constructor
	 */
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	Point.prototype.clone = function() {
		return new Point(this.x,  this.y);
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
	 * @param {Point} point - The rectangle upper left corner
	 * @param {number} width - The rectangle width
	 * @param {number} height - The rectangle height
	 * @param {string} [color='#000000'] - The rectangle color
	 */
	Graphics.prototype.fillRectangle = function(point, width, height, color) {
		this.context.beginPath();
		this.context.rect(point.x, point.y, width, height);
		this.context.fillStyle = color || '#000000';
		this.context.fill();
	};

	VYW.Graphics = Graphics;
	VYW.Point = Point;

}(window.VYW));