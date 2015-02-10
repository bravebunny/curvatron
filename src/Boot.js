var boot = function(game){
	orientated: false
};
  
boot.prototype = {
	init: function () {
	this.stage.disableVisibilityChange = true;

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  	this.scale.pageAlignHorizontally = true;
   	this.scale.pageAlignVertically = true;
   	this.scale.forceOrientation(true, false);
   	this.scale.setResizeCallback(this.resize, this);
   	//this.scale.onSizeChange.add(this.resize, this);
    //this.scale.refresh();

    this.physics.startSystem(Phaser.Physics.ARCADE);

  	w2 = this.world.width/2;
	h2 = this.world.height/2;

	auxOrientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
	auxWinW = window.innerWidth;
	auxWinH = window.innerHeight;

	},

	preload: function(){

		bgColors = ['#76b83d', '#cf5e4f', '#805296', '#4c99b9'];
		bgColorsDark = ['#3b5c1e', '#672f27', '#40294b', '#264c5c'];
		colorPlayers = ['#eb1c1c','#4368e0','#f07dc1','#44c83a','#9e432e','#3dd6e0','#9339e0','#ebd90f'];
	    chosenColor = this.game.rnd.integerInRange(0, 3);
	    colorHex = bgColors[chosenColor];
	    colorHexDark = bgColorsDark[chosenColor];
	    document.body.style.background = colorHex;
	    this.stage.backgroundColor = colorHex;
	    changeColor = false;
	    mute = false;

	   	this.game.load.image("loading","assets/sprites/menu/loading.png");
	  	this.game.renderer.roundPixels = false;
	    this.stage.smoothed = true;

	    if (mobile) {
	    	Cocoon.App.exitCallback(
	    	function() {
		    	if (this.state.states[this.game.state.current].backPressed) {
		    		this.state.states[this.game.state.current].backPressed();
		    	}
		    	if (this.state.current == "Menu") {
		    		return true;
		    	} else {
		        return false;
		    	}
		    }.bind(this)
    		);
  		}

	},

  	create: function(){
		this.state.start("PreloadMenu");
	},

	resize: function() {
		if(this.game.state.current != 'GameMananger' && mobile){
		    var winW = window.innerWidth;
		    var winH = window.innerHeight;
		    var winRatio = winW/winH;
		    var orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";

		    var height = Math.round(Math.sqrt(baseArea/winRatio));
		    var width =  Math.round(winRatio*height);

		    this.game.width = width;
		    this.game.height = height;
		    this.stage.width = width;
		    this.stage.height = height;
		    this.scale.width = width;
		    this.scale.height = height;
			this.game.canvas.width = width;
			this.game.canvas.height = height;
			this.game.world.setBounds(0, 0, width, height);
			this.game.renderer.resize(width, height);
			this.game.camera.setSize(width, height);
			this.game.camera.setBoundsToWorld();
			this.scale.refresh();

			w2 = this.game.world.width/2;
			h2 = this.game.world.height/2;

			if (this.state.states[this.game.state.current].setPositions) {
				if((auxWinW != winW) || (auxWinH != winH) || (auxOrientation != orientation)){
					auxOrientation = orientation;
					auxWinW = winW;
					auxWinH = winH;
					this.state.states[this.game.state.current].setPositions();
				}
			}
		}
  	},

}