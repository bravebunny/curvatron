var Trail = function(id) {
	this.trail = null;
	this.death = null;
	this.id = id;
};

Trail.prototype = {

	create: function(x, y, death) {

		this.death = death;
		this.trail = game.add.sprite(x, y, 'trail');
		this.trail.anchor.setTo(.5,.5);
		game.time.events.add(Phaser.Timer.SECOND * death, this.kill);
	},

	kill: function() {
		this.trail.kill();
	},

	render: function(){
	}
};