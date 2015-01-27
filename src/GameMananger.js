var GameMananger = function(g) {

	game = g;
	player = null;
};

GameMananger.prototype = {

	preload: function() {
		player = new Player();
		player.preload();

		trail = new Trail();
		trail.preload();
	},

	create: function() {
		player.create();
		trail.create();
	},

	update: function() {

	},

	render: function(){
	}
};