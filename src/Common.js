function buttonDown () {
  this.tweenOut.onComplete.active = true
  this.tween.start()
}

function buttonUp () {
  this.tween.start()
}

function clickButton (button, callback, state, buttonArray) {
  var s = button.scale
  var tweenTime = 30

  var tweenIn = button.game.add.tween(s).to({ x: s.x * 0.9, y: s.y * 0.9 }, tweenTime, Phaser.Easing.Linear.None, false)
  var tweenOut = button.game.add.tween(s).to({ x: s.x, y: s.y }, tweenTime, Phaser.Easing.Linear.None, false)

  var tweenOver = button.game.add.tween(s).to({ x: s.x * 1.2, y: s.y * 1.2 }, tweenTime * 2, Phaser.Easing.Linear.None, false)
  var tweenOverOut = button.game.add.tween(s).to({ x: s.x, y: s.y }, tweenTime * 2, Phaser.Easing.Linear.None, false)

  tweenOut.onComplete.add(function () {
    if (!tweenOut.isRunning && !tweenIn.isRunning) {
      callback.call(this)
    }
  }
    , state)

  button.onInputOver.add(function () {
    tweenOut.onComplete.active = true
    tweenOver.start()
  })

  button.onInputOut.add(function () {
    tweenOut.onComplete.active = false
    tweenOverOut.start()
  })

  button.onInputDown.add(buttonDown, {
    tween: tweenIn,
    tweenOut: tweenOut
  })

  button.onInputUp.add(buttonUp, {
    tween: tweenOut
  })
}

// + Jonas Raoni Soares Silva
// @ http://jsfromhell.com/array/shuffle [v1.0]
function shuffleArray (o) { // v1.0
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
    return o
}

function ajustScreen (game) {
  var winW = window.innerWidth
  var winH = window.innerHeight
  var winRatio = winW / winH
  var height = Math.round(Math.sqrt(baseArea / winRatio))
  var width = Math.round(winRatio * height)

  game.width = width
  game.height = height
  game.canvas.width = width
  game.canvas.height = height
  game.renderer.resize(width, height)
  game.stage.width = width
  game.stage.height = height
  game.scale.width = width
  game.scale.height = height
  game.world.setBounds(0, 0, width, height)
  game.camera.setSize(width, height)
  game.camera.setBoundsToWorld()
  game.scale.refresh()

  w2 = width / 2
  h2 = height / 2
}

function setScreenFixed (w, h, game) {
  game.width = w
  game.height = h
  game.canvas.width = w
  game.canvas.height = h
  game.renderer.resize(w, h)
  game.stage.width = w
  game.stage.height = h
  game.scale.width = w
  game.scale.height = h
  game.world.setBounds(0, 0, w, h)
  game.camera.setSize(w, h)
  game.camera.setBoundsToWorld()
  game.scale.refresh()

  w2 = w / 2
  h2 = h / 2
}

function menuUpdate () {
  for (var i = 0; i < menuArray.length; i++) {
    var b = menuArray[i]
    if (i == selection && !b.selected) b.select()
    else if (i != selection && b.selected) b.deselect()
  }
}

function selectDown () {
  if (!pressingSelect) {
    var newS = (selection + 1) % menuArray.length
    // menuArray[newS].button.onInputOver.dispatch()
    selection = newS
  }

}

function selectUp () {
  if (!pressingSelect) {
    var n = menuArray.length
    var newS = (((selection - 1) % n) + n) % n
    // menuArray[newS].button.onInputOver.dispatch()
    selection = newS
  }
}

function selectPress () {
  pressingSelect = true
  menuArray[selection].button.onInputDown.dispatch()
}

function selectRelease () {
  pressingSelect = false
  menuArray[selection].button.onInputUp.dispatch()
}
