var Trail = function(x, y, death) {
	this.trail = null;
	this.x = x;
	this.y = y;
	this.death = death;
};

Trail.prototype = {

	preload: function() {
		game.load.image('trail', 'assets/trail.png');
	},

	create: function() {
		this.trail = game.add.sprite(this.x, this.y, 'trail');
		this.trail.anchor.setTo(.5,.5);
	},

	update: function() {
		if (death < game.time.totalElapsedSeconds()) {
			this.trail.kill();
		}
	},

	render: function(){
	}
};