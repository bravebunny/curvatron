var leaderboards = function (game) {
	this.ui = {};
};
  
leaderboards.prototype = {
	create: function () {
		var ui = this.ui;

		ui.title = this.game.add.text(0,0, "leaderboards", {
		    font: "150px dosis",
		    fill: "#ffffff",
		    align: "center"});
	  	ui.title.anchor.setTo(0.5,0.5);

		ui.normalButton = this.game.add.button(0,0,"collecting_button",this.normalScores,this);
		ui.normalButton.anchor.setTo(0.5,0.5);
		ui.normalButton.input.useHandCursor=true;

		ui.endlessButton = this.game.add.button(0,0,"endless_button",this.endlessScores,this);
		ui.endlessButton.anchor.setTo(0.5,0.5);
		ui.endlessButton.input.useHandCursor=true;

		//Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button",this.backPressed,this);
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;

		this.setPositions();

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	leaderboard: function (board) {
    if (mobile) {
      var params = Cocoon.Social.ScoreParams;
      params.leaderboardID = board;
      if (!socialService) {
        var gp = Cocoon.Social.GooglePlayGames;
        gp.init({});
        socialService = gp.getSocialInterface();

        if (!socialService.isLoggedIn()) {
        socialService.login(function(loggedIn, error) {
          if (error) {
              console.error("login error: " + error.message);
            } else if (loggedIn) {
              socialService.showLeaderboard(null, params);
            }
          }.bind(this));
        }
      } else if (socialService.isLoggedIn()){
        socialService.showLeaderboard(null, params);
      }     
    }
	},

	normalScores: function () {
		this.leaderboard(modesLB[0]);
	},

	endlessScores: function () {
		this.leaderboard(modesLB[1]);
	},

	backPressed: function () {
		this.game.state.start("Menu");
	},

	setPositions: function () {
		var ui = this.ui;
  	ui.title.position.set(w2,h2*0.3);

    var wOrientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
    if (wOrientation == "portrait" && mobile) {
      ui.title.scale.set(0.7,0.7);
    } else {
      ui.title.scale.set(1,1);
    }

		ui.normalButton.position.set(w2-170,h2);
		ui.endlessButton.position.set(w2+170,h2);
		ui.backButton.position.set(w2/2,h2*1.6);
    }
    
};