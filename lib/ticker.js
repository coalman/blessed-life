function Ticker(intervalTime, onTick) {
	this.running = false;
	this.intervalId = null;
	this.onTick = onTick;
	this.intervalTime = intervalTime;
}

Ticker.prototype.start = function() {
	if (this.running) {
		// TODO: throw an error?
		return;
	}

	this.running = true;
	this.intervalId = setInterval(this.onTick, this.intervalTime);
};
Ticker.prototype.stop = function() {
	if (!this.running) {
		// TODO: throw an error?
		return;
	}

	clearInterval(this.intervalId);
	this.running = false;
	this.intervalId = null;
};
Ticker.prototype.toggle = function() {
	if (this.running) {
		this.stop();
	} else {
		this.start();
	}
};

module.exports = Ticker;