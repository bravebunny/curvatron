var stats = function(game){
	this.orientation = null;
	this.ui = {};
};
  
stats.prototype = {
	init: function(){
		this.orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
	},

	create: function(){
		var ui = this.ui;

		ui.title = this.game.add.text(0,0, "singleplayer stats", {
	        font: "150px dosis",
	        fill: "#ffffff",
	        align: "center"
	  	});
	  	ui.title.anchor.setTo(0.5,0.5);

		ui.highScore = this.game.add.sprite(0, 0, 'score-stat');
		ui.highScore.anchor.setTo(0.5,0.5);
		ui.highScore.alpha = 0.7;
		ui.highScoretext = this.game.add.text(0, 0, bestScore.toString(), {
	        font: "60px dosis",
	        fill: colorHex,
	        align: "center"
    	});
    	ui.highScoretext.anchor.setTo(0.5,0.5);

		ui.totalBalls = this.game.add.sprite(0, 0, 'total-stats');
		ui.totalBalls.anchor.setTo(0.5,0.5);
		ui.totalBalls.alpha = 0.7;
		ui.totalBallsText = this.game.add.text(0,0, ballsScore.toString(), {
	        font: "60px dosis",
	        fill: colorHex,
	        align: "center"
    	});
    	ui.totalBallsText.anchor.setTo(0.5,0.5);

    	ui.statsDeaths = this.game.add.sprite(0, 0, 'deaths-stats');
		ui.statsDeaths.anchor.setTo(0.5,0.5);
		ui.statsDeaths.alpha = 0.7;
		ui.textDeaths = this.game.add.text(0, 0, deathScore.toString(), {
	        font: "60px dosis",
	        fill: colorHex,
	        align: "center"
    	});
    	ui.textDeaths.anchor.setTo(0.5,0.5);

    	//back button
		ui.backButton = this.game.add.button(0,0,"back_button",this.backPressed,this);
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;

		//Place the menu buttons and labels on their correct positions
    	this.setPositions();

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	backPressed:function(){
		this.game.state.start("Menu");
	},

	setPositions: function() {
		this.orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
  		var ui = this.ui;

    	if(this.orientation == "portrait" && mobile){
    		ui.title.position.set(w2,140);
	  		ui.title.text ="single player\nstats";
	  		ui.title.scale.set(0.7,0.7);
	  	}
	  	else{
	  		ui.title.position.set(w2,120);
	  		ui.title.text ="singleplayer stats";
	  		ui.title.scale.set(1,1);
	  	}

    	if(this.orientation == "portrait" && mobile){
			ui.highScore.position.set(w2,h2/2+100);
			ui.highScoretext.position.set(w2+50,h2/2 + 108);
		}
		else{
			ui.highScore.position.set(w2/2, h2);
    		ui.highScoretext.position.set(w2/2+50, h2+8);
		}

		ui.totalBalls.position.set(w2, h2);
		ui.totalBallsText.position.set(w2+50,h2+8);

		if(this.orientation == "portrait" && mobile){
    		ui.statsDeaths.position.set(w2,h2+h2/2-100);
    		ui.textDeaths.position.set(w2+50,h2+h2/2-100);
    	}
    	else{
    		ui.statsDeaths.position.set(w2+w2/2, h2);
			ui.textDeaths.position.set(w2+w2/2+50, h2+8);
    	}

		if(this.orientation == "portrait" && mobile){
			ui.backButton.position.set(w2/2,h2+430);
		}
		else{
			ui.backButton.position.set(w2/2,h2+230);
		}
  	}
}