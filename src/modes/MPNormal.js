var MPNormal = function(game) {

};

MPNormal.prototype = {

	init: function(numberPlayers) {

	},

	create: function() {

		spawnPowers = true;

		//Choose snake locations and create them
		for(var i=0; i <= numberPlayers; i++){
			players[i] = new Player(i,
			Math.cos((2*Math.PI/(numberPlayers+1))*i)*(w2-200)+w2, 
			Math.sin((2*Math.PI/(numberPlayers+1))*i)*(h2-100)+h2, 
			keys[i], this.game);

			players[i].create();
		}

	},

	update: function() {

	}

};