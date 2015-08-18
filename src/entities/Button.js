//wf and hx are fractions of the width and hight of the screen, respectively
//if wf = 0.5 and hf = 0.5, the button will stay in the center of the screen.
//xo and yo are the x and y offsets
var Button = function (xo, yo, wf, hf, radius, icon, callback, context, game) {
	this.wf = wf;
	this.hf = hf;
	this.xo = xo;
	this.yo = yo;
	this.icon = icon;
	this.context = context;
	this.callback = callback;
	this.game = game;
  this.graphics = null;
	this.shape = null;
	this.radius = radius;
	this.mouseMove = false;
};

Button.prototype = {
	create: function () {
    this.graphics = this.game.add.graphics(0, 0);
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0xFFFFFF, 1);
    this.graphics.drawCircle(0, 0, 2*this.radius);
    this.graphics.endFill();
		//this.graphics.anchor.setTo(0.5,0.5);

		this.shape = this.game.add.button(0, 0, this.icon);
		this.shape.anchor.setTo(0.5,0.5);
		this.shape.tint = parseInt(colorHex.substring(1), 16);
		this.shape.hitArea = new Phaser.Circle(0, 0,2*this.radius);

		this.shape.input.useHandCursor = true;
		clickButton(this.shape, this.callback, this.context);
	},

	//needs to be called on window resize
	reposition: function() {
		var wf = this.wf;
		var hf = this.hf;
		var xo = this.xo;
		var yo = this.yo;

		if (this.mouseMove) {
			xo -= this.game.input.mousePointer.x-w2
		}

		this.graphics.position.set(w2*2*wf + xo, h2*2*hf + yo);
		this.shape.position.set(w2*2*wf + xo, h2*2*hf + yo);
	},

	setMouseMove: function() {
		this.mouseMove = true;
	}

};
