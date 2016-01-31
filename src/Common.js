/* global baseArea, Phaser, nonSteam */

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
  if (game.input.gamepad.supported && game.input.gamepad.active && !controllersSet) {
    var preload = game.state.states['PreloadMenu']
    var keys = preload.keys
    for (var i = 1; i < 5; i++) {
      var pad = game.input.gamepad['pad' + i]
      if (pad.connected) {
        controllersSet = true
        var b = [
          pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP),
          pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN),
          pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT),
          pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT),
          pad.getButton(Phaser.Gamepad.XBOX360_A),
          pad.getButton(Phaser.Gamepad.XBOX360_A),
          pad.getButton(Phaser.Gamepad.XBOX360_B),
          pad.getButton(Phaser.Gamepad.XBOX360_START)]

        if (b[0]) b[0].onDown.add(keys.up, preload)
        if (b[1]) b[1].onDown.add(keys.down, preload)
        if (b[2]) b[2].onDown.add(keys.left, preload)
        if (b[3]) b[3].onDown.add(keys.right, preload)
        if (b[4]) b[4].onDown.add(keys.selectPress, preload)
        if (b[5]) b[5].onUp.add(keys.selectRelease, preload)
        if (b[6]) b[6].onDown.add(keys.backPressed, preload)
        if (b[7]) b[7].onDown.add(keys.backPressed, preload)
      }
    }
  }
}

// http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor (color, percent) {
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF
  return '#' + (0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)
}

function log (msg) {
  console.log(msg)
}

function openFile (cb) {
  var el = window.document.createElement('input')
  el.type = 'file'
  el.style.display = 'none'
  window.document.body.appendChild(el)
  el.addEventListener('change', function (evt) {
    window.document.body.removeChild(el)
    cb(this.value)
  })
  el.click()
}

function changeBGColor (game) {
  chosenColor = game.rnd.integerInRange(0, 3)
  colorHex = bgColors[chosenColor]
  colorHexDark = bgColorsDark[chosenColor]
  document.body.style.background = colorHex
  game.stage.backgroundColor = colorHex
  changeColor = false
}

function achievement (ach) {
  if(!nonSteam) {
    var greenworks = require('./greenworks')
    greenworks.activateAchievement(ach,
    function () {
      console.log('achievement ' + ach + ' success')
    },
    [function () {
      console.log('achievement ' + ach + ' error')
    }])
  }
}