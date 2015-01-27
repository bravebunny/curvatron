var gameTitle = function(game){
	numberOfPlayers = 1;
	gameMode = 0;
	gameModes = ["Nomral Mode", "coiso", "Outro coiso"];
}

gameTitle.prototype = {

  	create: function(){
		var gameTitle = this.game.add.sprite(this.game.world.centerX,160,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.centerX,160, "CurvaTorn", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

		var playButton = this.game.add.button(this.game.world.centerX,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.centerX,320, "PLAY", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    	///////////////////////////////////////Number of players////////////////////////////////////////////////////////
		var playersAuxButton = this.game.add.sprite(this.game.world.centerX,480,"auxBar");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textPlayers = this.game.add.text(this.game.world.centerX,480, numberOfPlayers + " players", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	textPlayers.anchor.setTo(0.5,0.5);

    	var leftArrow = this.game.add.button(this.game.world.centerX-112,480,"arrow",this.DecNumberOfPlayers,this);
		leftArrow.anchor.setTo(0.5,0.5);

		var rightArrow = this.game.add.button(this.game.world.centerX+112,480,"arrow",this.IncNumberOfPlayers,this);
		rightArrow.anchor.setTo(0.5,0.5);

		///////////////////////////////////////////Game Mode////////////////////////////////////////////////////////////////
		var playersAuxButton = this.game.add.sprite(this.game.world.centerX,640,"auxBar");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textGameMode = this.game.add.text(this.game.world.centerX,640, "Normal Game", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	textGameMode.anchor.setTo(0.5,0.5);

    	var leftArrow = this.game.add.button(this.game.world.centerX-112,640,"arrow",this.DecGameMode,this);
		leftArrow.anchor.setTo(0.5,0.5);

		var rightArrow = this.game.add.button(this.game.world.centerX+112,640,"arrow",this.IncGameMode,this);
		rightArrow.anchor.setTo(0.5,0.5);

		//this.game.state.start("GameMananger");
	},

	playTheGame: function(){
		this.game.state.start("GameMananger",true,false,numberOfPlayers-1);
	},

	DecNumberOfPlayers: function(){
		if(numberOfPlayers==1){
			numberOfPlayers=4;
		}
		else{
			numberOfPlayers--;
		}
		textPlayers.setText("" + numberOfPlayers + " players");
	},

	IncNumberOfPlayers: function(){
		if(numberOfPlayers==4){
		    numberOfPlayers=1;
	    }
	    else{
			numberOfPlayers++;
	    }
	    textPlayers.setText("" + numberOfPlayers + " players");
	},

	DecGameMode: function(){
		if(gameMode<1){
			gameMode = 2;
		}
		else{
			gameMode--;
		}
    	textGameMode.setText(gameModes[gameMode]);
	},

	IncGameMode: function(){
		if(gameMode>1){
			gameMode = 0;
		}
		else{
	    	gameMode++;
		}
	    textGameMode.setText(gameModes[gameMode]);
	}
}