var gameTitle = function(game){
	this.menuSpace = 160;
}

gameTitle.prototype = {

  create: function(){
  		this.game.world.scale.set(1);

		var gameTitle = this.game.add.sprite(0,-160,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		text = this.game.add.text(0,-160, "CurvaTorn", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

		var playButton = this.game.add.button(0,0,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(0,0, "Single Player", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    	//Multiplayer
		var playButton = this.game.add.button(0,160,"play",this.multiplayer,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(0,160, "Multiplayer Player", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);
	},

	playTheGame: function(){
		this.game.state.start("PreloadGame",true,false,0);
	},

	multiplayer: function(){
		this.game.state.start("Multiplayer");
	}
}