function buttonDown() {
  this.tweenOut.onComplete.active = true;
  this.tween.start();
}

function buttonUp() {
  this.tween.start();
}

function clickButton(button, callback, state) {
  var s = button.scale;
  var tweenTime = 30;

  var tweenIn = button.game.add.tween(s).to( { x: s.x*0.9, y: s.y*0.9 }, tweenTime, Phaser.Easing.Linear.None, false);
  var tweenOut = button.game.add.tween(s).to( { x: s.x, y: s.y }, tweenTime, Phaser.Easing.Linear.None, false);

  var tweenOver = button.game.add.tween(s).to( { x: s.x*1.2, y: s.y*1.2 }, tweenTime*2, Phaser.Easing.Linear.None, false);
  var tweenOverOut = button.game.add.tween(s).to( { x: s.x, y: s.y }, tweenTime*2, Phaser.Easing.Linear.None, false);

  tweenOut.onComplete.add(function () {
    if (!tweenOut.isRunning && !tweenIn.isRunning) {
      callback.call(this);
    }
  }
  , state);

  button.onInputOver.add(function () {
    tweenOut.onComplete.active = true;
    tweenOver.start();
  });

  button.onInputOut.add(function () {
    tweenOut.onComplete.active = false;
    tweenOverOut.start();
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
}

function ajustScreen(game) {
  var winW = window.innerWidth;
  var winH = window.innerHeight;
  var winRatio = winW/winH;
  var height = Math.round(Math.sqrt(baseArea/winRatio));
  var width =  Math.round(winRatio*height);

  game.width = width;
  game.height = height;
  game.canvas.width = width;
  game.canvas.height = height;
  game.renderer.resize(width, height);
  game.stage.width = width;
  game.stage.height = height;
  game.scale.width = width;
  game.scale.height = height;
  game.world.setBounds(0, 0, width, height);
  game.camera.setSize(width, height);
  game.camera.setBoundsToWorld();
  game.scale.refresh();

  w2 = game.world.width/2;
  h2 = game.world.height/2;
}

function setScreenFixed(game) {
  game.width = baseH;
  game.height = baseH;
  game.canvas.width = baseH;
  game.canvas.height = baseH;
  game.renderer.resize(baseH, baseH);
  game.stage.width = baseH;
  game.stage.height = baseH;
  game.scale.width = baseH;
  game.scale.height = baseH;
  game.world.setBounds(0, 0, baseH, baseH);
  game.camera.setSize(baseH, baseH);
  game.camera.setBoundsToWorld();
  game.scale.refresh();

  w2 = game.world.width/2;
  h2 = game.world.height/2;
}
