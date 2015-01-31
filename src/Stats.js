var stats = function(game){
};
  
stats.prototype = {
  	create: function(){
    	
		var stastPlayer = this.game.add.sprite(w2-64, h2-64, 'gametitle');
		stastPlayer.anchor.setTo(0.5,0.5);
		statsPlayers = this.game.add.text(w2-64, h2-64, "stats", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	statsPlayers.anchor.setTo(0.5,0.5);

		var stastPlayer = this.game.add.sprite(w2, h2, 'gametitle');
		stastPlayer.anchor.setTo(0.5,0.5);
		statsPlayers = this.game.add.text(w2,h2, "stats", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	statsPlayers.anchor.setTo(0.5,0.5);

    	var stastPlayer = this.game.add.sprite(w2+64, h2+64, 'gametitle');
		stastPlayer.anchor.setTo(0.5,0.5);
		statsPlayers = this.game.add.text(w2+64, h2+64, "stats", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	statsPlayers.anchor.setTo(0.5,0.5);

    	//back button
		var backButton = this.game.add.button(w2/2,h2+230,"back_button",function(){this.game.state.start("Menu");},this);
		backButton.anchor.setTo(0.5,0.5);
		backButton.input.useHandCursor=true;

	},

	update: function(){
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){this.game.state.start("Menu");}, this);
	},

}