var multiplayer = function(game){
};
  
multiplayer.prototype = {
  	create: function(){

  	if (numberPlayers == 0) {
  		numberPlayers = 1;
  	}

    	//Number of players
		var playersAuxButton = this.game.add.sprite(this.game.world.width,this.game.world.height,"auxBar");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textPlayers = this.game.add.text(this.game.world.width,this.game.world.height, (numberPlayers+1) + " players", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	textPlayers.anchor.setTo(0.5,0.5);

    	var leftArrow = this.game.add.button(this.game.world.width-112,this.game.world.height,"arrow",this.DecNumberOfPlayers,this);
		leftArrow.anchor.setTo(0.5,0.5);

		var rightArrow = this.game.add.button(this.game.world.width+112,this.game.world.height,"arrow",this.IncNumberOfPlayers,this);
		rightArrow.anchor.setTo(0.5,0.5);

		//Play Button
		var playButton = this.game.add.button(this.game.world.width,160+this.game.world.height,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.width,160+this.game.world.height, "PLAY", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    	//Go back Button
		var backButton = this.game.add.button(this.game.world.width-480,320+this.game.world.height,"play",this.back,this);
		backButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.width-480,320+this.game.world.height, "Back", {
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
		this.game.state.start("PreloadGame",true,false,numberPlayers);
	},

	back:function(){
		this.game.state.start("GameTitle");
	},

	DecNumberOfPlayers: function(){
		if(numberPlayers==1){
			numberPlayers=maxPlayers;
		}
		else{
			numberPlayers--;
		}
		textPlayers.setText("" + (numberPlayers+1) + " players");
	},

	IncNumberOfPlayers: function(){
		if(numberPlayers==maxPlayers){
		    numberPlayers=1;
	    }
	    else{
			numberPlayers++;
	    }
	    textPlayers.setText("" + (numberPlayers+1) + " players");
	},
}