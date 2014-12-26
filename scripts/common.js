window.VYW = window.VYW || {};
(function(VYW) {

	VYW.GameState = {
		Paused: 0,
		Running: 1,
		End: 2
	};

	VYW.KeyCodes = {
		Pause: 32,
		Left: 37,
		Up: 38,
		Right: 39,
		Down: 40
	};

	VYW.Direction = {
		Left: 0,
		Up: 1,
		Right: 2,
		Down: 3
	};

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
