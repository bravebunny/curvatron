function shuffleArray (o) { // v1.0
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
  return o
}

function lerp (a, b, f) {
  return a + f * (b - a)
}

function adjustScreen (game) {
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

function checkGamepads (game) {
  if (game.input.gamepad.supported && game.input.gamepad.active) {
    var preload = game.state.states['PreloadMenu']
    var keys = preload.keys
    for (var i = 1; i < 5; i++) {
      var pad = game.input.gamepad['pad' + i]
      if (pad.connected) {
        pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP).onDown.add(keys.up, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN).onDown.add(keys.down, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT).onDown.add(keys.left, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT).onDown.add(keys.right, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(keys.selectPress, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_A).onUp.add(keys.selectRelease, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_B).onDown.add(keys.backPressed, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(keys.backPressed, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_B).onUp.add(keys.backReleased, preload)
        pad.getButton(Phaser.Gamepad.XBOX360_START).onUp.add(keys.backReleased, preload)
      }
    }
  }
}

// http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor (color, percent) {
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF
  return '#' + (0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)
}

function log(msg) {
  console.log(msg);
}
