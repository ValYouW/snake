window.VYW = window.VYW || {};
(function(VYW) {

	function Board(w, h, boxSize, color) {
		this.rectangle = new VYW.Rectangle(0, 0, w, h);
		this.boxSize = boxSize;
		this.color = color;

		// Hold the number of boxes we can have on the board on X/Y axis
		this.horizontalBoxes = Math.floor(this.rectangle.width / this.boxSize);
		this.verticalBoxes = Math.floor(this.rectangle.height / this.boxSize);
	}

	Board.prototype.toScreen = function(boxIndex) {
		// Make sure that boxIndex is integer
		return Math.floor(boxIndex) * this.boxSize;
	};

	Board.prototype.draw = function(graphics) {
		graphics.clear();
		graphics.fillRectangle(this.rectangle,  this.color);
	};

	VYW.Board = Board;

}(window.VYW));
