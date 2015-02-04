var boot = function(game){};
  
boot.prototype = {
	preload: function(){
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

   	this.game.load.image("loading","assets/sprites/menu/loading.png");
  	this.game.renderer.roundPixels = false;
    this.game.stage.smoothed = true;

	},
  	create: function(){
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.game.scale.pageAlignHorizontally = true;
	    this.game.scale.refresh();

	    this.game.physics.startSystem(Phaser.Physics.ARCADE);

	    w2 = this.game.world.width/2;
		h2 = this.game.world.height/2;

		this.game.state.start("PreloadMenu");


	}
}