var singlePlayer = function(game){
	this.ui = {};
	mods=['classic','survival']
};
  
singlePlayer.prototype = {
	create: function(){

		var ui = this.ui;

		ui.title = this.game.add.text(0,0, "single player", {
	    font: "150px dosis",
	    fill: "#ffffff",
	    align: "center"});
	  	ui.title.anchor.setTo(0.5,0.5);

		//Play Buttons
		ui.normalButton = this.game.add.button(0,0,"collecting_button",this.playNormalGame,this);
		ui.normalButton.anchor.setTo(0.5,0.5);
		ui.normalButton.input.useHandCursor=true;

		ui.endlessButton = this.game.add.button(0,0,"endless_button",this.playEndlessGame,this);
		ui.endlessButton.anchor.setTo(0.5,0.5);
		ui.endlessButton.input.useHandCursor=true;

	   //Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button",this.backPressed,this);
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;

		this.setPositions();

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	playNormalGame: function(){
		numberPlayers = 0;
		mod = 0;
    	menuMusic.fadeOut(2000);
		this.game.state.start("PreloadGame",true,false);
	},

	playEndlessGame: function(){
		numberPlayers = 0;
		mod = 1;
    	menuMusic.fadeOut(2000);
		this.game.state.start("PreloadGame",true,false);
	},

	backPressed:function(){
		this.game.state.start("Menu");
	},

	setPositions: function() {
		var ui = this.ui;

  		if(this.orientation == "portrait" && mobile){
    		ui.title.position.set(w2,140);
	  		ui.title.text ="single\nplayer";
	  		ui.title.scale.set(0.7,0.7);
	  	}else{
	  		ui.title.position.set(w2,120);
	  		ui.title.scale.set(1,1);
	  	}

		ui.normalButton.position.set(w2-170,h2);
		ui.endlessButton.position.set(w2+170,h2);
		ui.backButton.position.set(w2/2,h2*1.6);
  	}
}