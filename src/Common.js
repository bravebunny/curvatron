function buttonDown() {
  this.tweenOut.onComplete.active = true;
  this.tween.start();
}

function buttonUp() {
  this.tween.start();
}

function clickButton(button, callback, state) {
  var s = button.scale;
  var tweenIn = button.game.add.tween(s).to( { x: s.x*0.85, y: s.y*0.85 }, 80, Phaser.Easing.Linear.None, false);
  var tweenOut = button.game.add.tween(s).to( { x: s.x, y: s.y }, 80, Phaser.Easing.Linear.None, false);

  tweenOut.onComplete.add(function () {
    if (!tweenOut.isRunning && !tweenIn.isRunning) {
      callback.call(this);
    }
  }
  , state);

  button.onInputOver.add(function () {
    tweenOut.onComplete.active = true;
  });

  button.onInputOut.add(function () {
    tweenOut.onComplete.active = false;
  });

  button.onInputDown.add(buttonDown, { 
    tween: tweenIn,
    tweenOut: tweenOut
  });

  button.onInputUp.add(buttonUp, {
    tween: tweenOut
  });
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffleArray(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};