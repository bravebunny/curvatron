var multiplayer = function(game){
	maxPlayers = 7;
	numberOfPlayers = 1;
};
  
multiplayer.prototype = {
	preload: function(){
        this.game.load.image("loading","assets/Load.png");
        this.game.renderer.roundPixels = false;

	    this.game.stage.smoothed = true;
	},
  	create: function(){

    	//Number of players
		var playersAuxButton = this.game.add.sprite(0,0,"auxBar");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textPlayers = this.game.add.text(0,0, (numberOfPlayers+1) + " players", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	textPlayers.anchor.setTo(0.5,0.5);

    	var leftArrow = this.game.add.button(0-112,0,"arrow",this.DecNumberOfPlayers,this);
		leftArrow.anchor.setTo(0.5,0.5);

		var rightArrow = this.game.add.button(0+112,0,"arrow",this.IncNumberOfPlayers,this);
		rightArrow.anchor.setTo(0.5,0.5);

		//Play Button
		var playButton = this.game.add.button(0,160,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(0,160, "PLAY", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    	//Go back Button
		var playButton = this.game.add.button(-480,320,"play",this.back,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(-480,320, "Back", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);
	},

	update: function(){
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){this.game.state.start("GameTitle");}, this);
	},

	playTheGame: function(){
		this.game.state.start("PreloadGame",true,false,numberOfPlayers);
	},

	back:function(){
		this.game.state.start("GameTitle");
	},

	DecNumberOfPlayers: function(){
		if(numberOfPlayers==1){
			numberOfPlayers=maxPlayers;
		}
		else{
			numberOfPlayers--;
		}
		textPlayers.setText("" + (numberOfPlayers+1) + " players");
	},

	IncNumberOfPlayers: function(){
		if(numberOfPlayers==maxPlayers){
		    numberOfPlayers=1;
	    }
	    else{
			numberOfPlayers++;
	    }
	    textPlayers.setText("" + (numberOfPlayers+1) + " players");
	},
}