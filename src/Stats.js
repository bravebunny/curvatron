var stats = function(game){
};
  
stats.prototype = {
  	create: function(){

		var text = this.game.add.text(w2,120, "singleplayer stats", {
	      font: "150px Dosis Extrabold",
	      fill: "#ffffff",
	      align: "center"
	  	});
	  	text.anchor.setTo(0.5,0.5);

		var stastPlayer = this.game.add.sprite(w2/2, h2, 'score-stat');
		stastPlayer.anchor.setTo(0.5,0.5);
		statsPlayers = this.game.add.text(w2/2+50, h2+8, localStorage.getItem("highScore"), {
	        font: "60px Dosis Extrabold",
	        fill: colorHex,
	        align: "center"
    	});
    	statsPlayers.anchor.setTo(0.5,0.5);

		var stastPlayer = this.game.add.sprite(w2, h2, 'total-stats');
		stastPlayer.anchor.setTo(0.5,0.5);
		statsPlayers = this.game.add.text(w2+50,h2+8, localStorage.getItem("ballsCounter"), {
	        font: "60px Dosis Extrabold",
	        fill: colorHex,
	        align: "center"
    	});
    	statsPlayers.anchor.setTo(0.5,0.5);

    	var statsDeaths = this.game.add.sprite(w2+w2/2, h2, 'deaths-stats');
		statsDeaths.anchor.setTo(0.5,0.5);
		textDeaths = this.game.add.text(w2+w2/2+50, h2+8, localStorage.getItem("deadCounter"), {
	        font: "60px Dosis Extrabold",
	        fill: colorHex,
	        align: "center"
    	});
    	textDeaths.anchor.setTo(0.5,0.5);

    	//back button
		var backButton = this.game.add.button(w2/2,h2+230,"back_button",function(){this.game.state.start("Menu");},this);
		backButton.anchor.setTo(0.5,0.5);
		backButton.input.useHandCursor=true;

	},

	update: function(){
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){this.game.state.start("Menu");}, this);
	},

}