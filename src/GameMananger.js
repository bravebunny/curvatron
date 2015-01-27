var GameMananger = function(g) {

	game = g;
	player = null;
	textWriter = null;
	objectsConstructor  = null;
	this.playerCanMove = false;
	levelTutorial = null;
};

GameMananger.prototype = {

	preload: function() {
    	levelTutorial = new LevelTutorial(game);
		levelTutorial.preload();

		player = new Player(game);
		player.preload();

		objectsConstructor = new ObjectsConstructor(game);
		objectsConstructor.preload(); 

		textWriter = new TextWriter(game);

		this.playerCanMove = false;

	},

	create: function() {
		levelTutorial.create();
		player.create();

		levelTutorial.textSequence();
	},

	update: function() {
		if(this.playerCanMove){
			player.update();
			
    	}
	},

	render: function(){
		/*player.render();
		objectsConstructor.render();*/
	}
};