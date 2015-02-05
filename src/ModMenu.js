var modMenu = function(game){
	mods=['classic','survival','zombies?','king?']
	this.imageMod = null;
};
  
modMenu.prototype = {
	create: function(){

		var text = this.game.add.text(w2,120, "arranja um nome", {
	    font: "150px Dosis Extrabold",
	    fill: "#ffffff",
	    align: "center"});
	  	text.anchor.setTo(0.5,0.5);

	    //Number of players
		var playersAuxButton = this.game.add.sprite(w2,h2,"number_mod");
		playersAuxButton.anchor.setTo(0.5,0.5);

		this.imageMod = this.game.add.sprite(w2,h2+10, mods[0]);
	    this.imageMod.anchor.setTo(0.5,0.5);

	    var leftArrow = this.game.add.button(w2-150,h2,"set_players",this.DecNumberOfPlayers,this);
		leftArrow.anchor.setTo(0.5,0.5);
		leftArrow.alpha = 0.7;
		leftArrow.scale.x = -1;
		leftArrow.input.useHandCursor=true;

		var rightArrow = this.game.add.button(w2+150,h2,"set_players",this.IncNumberOfPlayers,this);
		rightArrow.anchor.setTo(0.5,0.5);
		rightArrow.alpha = 0.7;
		rightArrow.input.useHandCursor=true;

		//Play Button
		var playButton = this.game.add.button(w2+w2/2,h2+230,"resume_button",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		playButton.input.useHandCursor=true;


	   //Go back Button
		var backButton = this.game.add.button(w2/2,h2+230,"back_button",this.backPressed,this);
		backButton.anchor.setTo(0.5,0.5);
		backButton.input.useHandCursor=true;
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

	DecNumberOfPlayers: function(){
		if(mod==0){
			mod=maxMods;
		}
		else{
			mod--;
		}
		this.imageMod.loadTexture(mods[mod]);
	},

	IncNumberOfPlayers: function(){
		if(mod==maxMods){
		    mod=0;
	    }
	    else{
			mod++;
	    }
	    this.imageMod.loadTexture(mods[mod]);
	},

  resize: function (width, height) {
    this.game.state.states["Boot"].resize(width, height);
  }
}