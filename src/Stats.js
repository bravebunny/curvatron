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

		var highScore = this.game.add.sprite(w2/2, h2, 'score-stat');
		highScore.anchor.setTo(0.5,0.5);
		highScore.alpha = 0.7;
		highScoretext = this.game.add.text(w2/2+50, h2+8, bestScore.toString(), {
	        font: "60px Dosis Extrabold",
	        fill: colorHex,
	        align: "center"
    	});
    	highScoretext.anchor.setTo(0.5,0.5);

		var totalBalls = this.game.add.sprite(w2, h2, 'total-stats');
		totalBalls.anchor.setTo(0.5,0.5);
		totalBalls.alpha = 0.7;
		totalBallsText = this.game.add.text(w2+50,h2+8, ballsScore.toString(), {
	        font: "60px Dosis Extrabold",
	        fill: colorHex,
	        align: "center"
    	});
    	totalBallsText.anchor.setTo(0.5,0.5);

    	var statsDeaths = this.game.add.sprite(w2+w2/2, h2, 'deaths-stats');
		statsDeaths.anchor.setTo(0.5,0.5);
		statsDeaths.alpha = 0.7;
		textDeaths = this.game.add.text(w2+w2/2+50, h2+8, deathScore.toString(), {
	        font: "60px Dosis Extrabold",
	        fill: colorHex,
	        align: "center"
    	});
    	textDeaths.anchor.setTo(0.5,0.5);

    	//back button
		var backButton = this.game.add.button(w2/2,h2+230,"back_button",this.backPressed,this);
		backButton.anchor.setTo(0.5,0.5);
		backButton.input.useHandCursor=true;

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);

	},

	backPressed:function(){
		this.game.state.start("Menu");
	}

}