var gameTitle = function(game){
	this.menuSpace = 160;
	maxPlayers = 7;
	  keys = [
    Phaser.Keyboard.Q,
    Phaser.Keyboard.Z,
    Phaser.Keyboard.R,
    Phaser.Keyboard.C,
    Phaser.Keyboard.U,
    Phaser.Keyboard.B,
    Phaser.Keyboard.P,
    Phaser.Keyboard.M,]
   numberPlayers = 0;

}

gameTitle.prototype = {

  create: function(){
  	this.game.world.scale.set(1);

		var gameTitle = this.game.add.sprite(this.game.world.width,-160+this.game.world.height,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.width,-160+this.game.world.height, "CurvaTorn", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

		var playButton = this.game.add.button(this.game.world.width,this.game.world.height,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.width,this.game.world.height, "Single Player", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    //Multiplayer
		var playButton = this.game.add.button(this.game.world.width,160+this.game.world.height,"play",this.multiplayer,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.width,160+this.game.world.height, "Multiplayer", {
      font: "40px Arial",
      fill: "#ff0044",
      align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);

  	//SetKeys
  	var playButton = this.game.add.button(this.game.world.width,320+this.game.world.height,"play",this.setKeys,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(this.game.world.width,320+this.game.world.height, "Set Keys", {
      font: "40px Arial",
      fill: "#ff0044",
      align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);
	},

	playTheGame: function(){
		numberPlayers = 0;
		this.game.state.start("PreloadGame",true,false);
	},

	multiplayer: function(){
		this.game.state.start("Multiplayer");
	},

	setKeys: function() {
		this.game.state.start("SetKeys");
	}
}