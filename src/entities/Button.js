//wf and hx are fractions of the width and hight of the screen, respectively
//if wf = 0.5 and hf = 0.5, the button will stay in the center of the screen.
//xo and yo are the x and y offsets
var Button = function (x, y, iconName, text, index, callback, context, game) {
	this.x = x;
	this.y = y;
	this.text = text;
	this.iconName = iconName;
	this.callback = callback;
	this.context = context;
	this.game = game;
	this.index = index;

  this.graphics = null;
	this.label = null;
	this.icon = null;
	this.button = null;
	this.tween = {};

	this.w = 520;
	this.h = 130;
	this.selected = false;
};

Button.prototype = {
	create: function () {
		var x = this.x;
		var y = this.y;
		var w = this.w;
		var h = this.h;

		//Button background rectangle
    this.graphics = this.game.add.graphics(-w/2, -h/2);
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0xFFFFFF, 1);
    this.graphics.drawRoundedRect(0, 0, w, h, h/2);
    this.graphics.endFill();
		//this.graphics.anchor.setTo(0.5,0.5);

		//Button label
		this.label = this.game.add.text(50, 0, this.text, {
			font: "60px dosis",
			fill: colorHex
		});
		this.label.anchor.setTo(0.5,0.5);

		//Button icon
		this.icon = this.game.add.sprite(-w/2 + 80, 0, this.iconName);
		this.icon.scale.set(0.7, 0.7);
		this.icon.tint = parseInt(colorHex.substring(1), 16);
		//this.icon.hitArea = new Phaser.Rectangle(-80, -80, w, h);
		this.icon.anchor.setTo(0.5,0.5);


		//Button group
		this.button = this.game.add.button(x, y);
		//this.icon.hitArea = new Phaser.Rectangle(-80, -80, w, h);
		this.button.input.useHandCursor = true;

		//clickButton(this.button, this.callback, this.context, menuArray, this.index);
		this.button.addChild(this.graphics);
		this.button.addChild(this.icon);
		this.button.addChild(this.label);
		this.button.anchor.setTo(0.5,0.5);

		var s = this.button.scale;
	  var tweenTime = 30;

		this.tween = {
			press: this.game.add.tween(s).to( { x: s.x*0.9, y: s.y*0.9 }, tweenTime, Phaser.Easing.Linear.None, false),
			release: this.game.add.tween(s).to( { x: s.x, y: s.y }, tweenTime, Phaser.Easing.Linear.None, false),
			over: this.game.add.tween(s).to( { x: s.x*1.2, y: s.y*1.2 }, tweenTime*2, Phaser.Easing.Linear.None, false),
			out: this.game.add.tween(s).to( { x: s.x, y: s.y }, tweenTime*2, Phaser.Easing.Linear.None, false)
		}

		//tween stuff
		this.button.onInputOver.add(function() {
			menuArray[selection].tween.out.start();
			this.tween.over.start();
			//menuArray[selection].button.onInputOut.dispatch();
	    selection = this.index;
	  }, this);

		this.tween.release.onComplete.add(function() {
			if (!this.tween.release.isRunning && !this.tween.press.isRunning) {
				this.callback.call(this.context);
			}
		}, this);

		this.button.onInputOver.add(function() {
			this.tween.release.onComplete.active = true;
			//tweenOver.start();
		}, this);

		this.button.onInputOut.add(function() {
			this.tween.release.onComplete.active = false;
			//tweenOverOut.start();
		}, this);

		this.button.onInputDown.add(this.buttonDown, {
			tween: this.tween.press,
			tweenOut: this.tween.release
		}, this);

		this.button.onInputUp.add(this.buttonUp, {
			tween: this.tween.release
		}, this);
	},

	buttonDown: function() {
		this.tweenOut.onComplete.active = true;
		this.tween.start();
	},

	buttonUp: function() {
		this.tween.start();
	},

	select: function() {
		this.button.onInputOver.dispatch();
	}

};
