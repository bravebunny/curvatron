var preloadGame = function(game){}

preloadGame.prototype = {
	init: function(){
		this.players = null;
	},

	preload: function(){ 
        var loadingBar = this.add.sprite(this.game.world.width,this.game.world.height,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        //Load all stuf from game
		this.game.load.image('power', 'assets/power.png');
		this.game.load.image('crown', 'assets/crown.png');	

		for(var i=0; i <= numberPlayers; i++){
			this.game.load.image('player' + i, 'assets/player' + i +'.png');
			this.game.load.image('trail' + i, 'assets/trail'+ i +'.png');
			this.game.load.image('crown' + i, 'assets/crown'+ i +'.png');
		}
	},
  	create: function(){
		this.game.state.start("GameMananger");
	}
}