window.VYW = window.VYW || {};
(function(VYW) {

	function SnakePart(location, size, color) {
		this.location = location;
		this.prevLocation = null;
		this.size = size;
		this.color = color;
	}

	/**
	 * Draws the snake part onto graphics
	 * @param {Graphics} graphics - The game graphics object
	 */
	SnakePart.prototype.draw = function(graphics) {
		graphics.fillRectangle(this.location, this.size, this.size,  this.color);
	};

	SnakePart.prototype.update = function(direction) {
		this.prevLocation = this.location.clone();
		switch (direction) {
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

	VYW.SnakePart = SnakePart;

}(window.VYW));