var GameMananger = function(g) {

	game = g;
	player = null;
};

GameMananger.prototype = {

	preload: function() {
		player = new Player();
		player.preload();
	},

	create: function() {
	},

	update: function() {

	},

	render: function(){
	}
};