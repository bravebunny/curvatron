var boot = function(game){};
  
boot.prototype = {

	init: function() {

   	this.input.maxPointers = 1;
  	//this.stage.disableVisibilityChange = true;
		this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

		//Detect if currently on mobile device
		mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		//mobile = true;

		bgColors = ['#76b83d', '#cf5e4f', '#805296', '#4c99b9'];
		bgColorsDark = ['#3b5c1e', '#672f27', '#40294b', '#264c5c'];
		colorPlayers = ['#eb1c1c','#4368e0','#f07dc1','#44c83a','#9e432e','#3dd6e0','#9339e0','#ebd90f'];
    chosenColor = this.game.rnd.integerInRange(0, 3);
    colorHex = bgColors[chosenColor];
    colorHexDark = bgColorsDark[chosenColor];
    document.body.style.background = colorHex;
    this.game.stage.backgroundColor = colorHex;
    changeColor = false;
    mute = false;

    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();

    w2 = 1366/2;
		h2 = 768/2;
    gameScale = 1;
    scale = 1;

    if (mobile) {
	    Cocoon.App.EmulatedWebView.style.backgroundColor = colorHex;
	    Cocoon.App.exitCallback(
	    	function() {
		    	if (this.state.states[this.game.state.current].backPressed) {
		    		this.state.states[this.game.state.current].backPressed();
		    	}
		    	if (this.game.state.current == "Menu") {
		    		return true;
		    	} else {
		        return false;
		    	}
		    }.bind(this)
	    );
    }

	},

	preload: function(){
   	this.game.load.image("loading","assets/sprites/menu/loading.png");
  	this.game.renderer.roundPixels = false;
    this.game.stage.smoothed = true;
	},

  resize: function (width, height) {
    var newScale;
    var wRatio = width/1366;
    var hRatio = height/768;
    if (wRatio >= hRatio) {
      //console.log("landscape")
      newScale = hRatio;
    } else {
      //console.log("portrait")
      newScale = wRatio;
    }

    /*var wScale = wRatio/scale;
    var hScale = hRatio/scale;*/
    var scaleRatio = newScale/scale;

    var wIncOld = w2 - (1366*scale)/2
    var hIncOld = h2 - (768*scale)/2

    scale = newScale;
    w2 = width/2;
    h2 = height/2;

    this.world.forEachExists(this.scaleSprite, this, newScale, scaleRatio, wIncOld, hIncOld);

  },

  scaleSprite: function (sprite, newScale, scaleRatio, wIncOld, hIncOld) {
    sprite.scale.set(newScale*gameScale);

    var wInc = w2 - (1366*newScale)/2
    var hInc = h2 - (768*newScale)/2
    var x = sprite.x;
    var y = sprite.y;
    sprite.position.set((x-wIncOld)*scaleRatio + wInc, (y-hIncOld)*scaleRatio + hInc);
  },

  create: function(){
		this.state.start("PreloadMenu");
	}
}