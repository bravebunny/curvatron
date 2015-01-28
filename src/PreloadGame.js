var preloadGame = function(game){}

preloadGame.prototype = {
	init: function(numberPlayers){
		this.numberOfPlayers = numberPlayers;
		this.players = null;
	},

	preload: function(){ 
        var loadingBar = this.add.sprite(this.game.world.centerX,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        //Load all stuf from game
		this.game.load.image('power', 'assets/power.png');
		this.game.load.image('crown', 'assets/crown.png');	

		for(var i=1; i <= this.numberOfPlayers+1; i++){
			this.game.load.image('player' + i, 'assets/player' + i +'.png');
			this.game.load.image('trail' + i, 'assets/trail'+ i +'.png');
		}
	},
  	create: function(){
		this.game.state.start("GameMananger",true,false,this.numberOfPlayers);
	}
}