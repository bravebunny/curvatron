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

	    //Mods
		ui.modAuxButton = this.game.add.sprite(0,0,"number_mod");
		ui.modAuxButton.anchor.setTo(0.5,0.5);

		ui.imageMod = this.game.add.sprite(0,0, mods[0]);
	    ui.imageMod.anchor.setTo(0.5,0.5);

	    ui.leftArrow = this.game.add.button(0,0,"set_players",this.DecMod,this);
		ui.leftArrow.anchor.setTo(0.5,0.5);
		ui.leftArrow.alpha = 0.7;
		ui.leftArrow.scale.x = -1;
		ui.leftArrow.input.useHandCursor=true;

		ui.rightArrow = this.game.add.button(0,0,"set_players",this.IncMod,this);
		ui.rightArrow.anchor.setTo(0.5,0.5);
		ui.rightArrow.alpha = 0.7;
		ui.rightArrow.input.useHandCursor=true;

		//Play Button
		ui.playButton = this.game.add.button(0,0,"resume_button",this.playTheGame,this);
		ui.playButton.anchor.setTo(0.5,0.5);
		ui.playButton.input.useHandCursor=true;

	   //Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button",this.backPressed,this);
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;

		this.setPositions();

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	playTheGame: function(){
		numberPlayers = 0;
    	menuMusic.fadeOut(2000);
		this.game.state.start("PreloadGame",true,false);
	},

	backPressed:function(){
		this.game.state.start("Menu");
	},

	DecMod: function(){
		if(mod==0){
			mod=maxMods;
		}
		else{
			mod--;
		}
		this.ui.imageMod.loadTexture(mods[mod]);
	},

	IncMod: function(){
		if(mod==maxMods){
		    mod=0;
	    }
	    else{
			mod++;
	    }
	    this.ui.imageMod.loadTexture(mods[mod]);
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

    	ui.modAuxButton.position.set(w2,h2);
    	ui.imageMod.position.set(w2+100,h2+10);
		ui.leftArrow.position.set(w2-150,h2);
		ui.rightArrow.position.set(w2+150,h2);
		ui.playButton.position.set(w2+w2/2,h2+230);
		ui.backButton.position.set(w2/2,h2+230);
  	}
}