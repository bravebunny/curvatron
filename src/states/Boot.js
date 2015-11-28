/*eslint-disable*/
/* global playCounter:true, w2:true, h2:true, changeColor:true, muteMusic:true, muteSoundEffects:true
firstTime:true, bgColors:true, bgColorsDark:true, Phaser, colorPlayers:true,
colorHex:true, colorHexDark:true, baseArea:true, chosenColor:true
modesLB:true, localStorage, scale:true, changingKeys:true, showMouse:true */
/*eslint-enable*/
var boot = function (game) {
  playCounter = 0
  w2 = 0
  h2 = 0
  changeColor = false
  muteMusic = false
  muteSoundEffects = false
  showMouse = false
  firstTime = true
  scale = 1
  changingKeys = false
}

boot.prototype = {
  preload: function () {
    this.game.load.image('loading', 'assets/sprites/gui/loading.png')
  },

  create: function () {
    w2 = this.game.width / 2
    h2 = this.game.height / 2

    this.game.stage.disableVisibilityChange = true

    if (localStorage.getItem('muteMusic') === 'true') {
      muteMusic = true
    }

    if (localStorage.getItem('muteSoundEffects') === 'true') {
      muteSoundEffects = true
    }

    if (localStorage.getItem('showMouse') === 'true') {
      showMouse = true
    }

    // Background colors
    // [green, red, purple, blue]
    bgColors = ['#76b83d', '#cf5e4f', '#805296', '#4c99b9']
    bgColorsDark = ['#3b5c1e', '#672f27', '#40294b', '#264c5c']

    modesLB = ['CgkIr97_oIgHEAIQCQ', 'CgkIr97_oIgHEAIQCg', 'CgkIr97_oIgHEAIQCw']

    chosenColor = this.game.rnd.integerInRange(0, 3)
    colorHex = bgColors[chosenColor]
    colorHexDark = bgColorsDark[chosenColor]
    document.body.style.background = colorHex
    this.stage.backgroundColor = colorHex

    // Player colors
    // [red, blue, pink, green, brown, cyan, purple, yellow]
    colorPlayers = ['#eb1c1c', '#4368e0', '#f07dc1', '#44c83a', '#9e432e', '#3dd6e0', '#9339e0', '#ebd90f']

    // this.game.forcesSingleUpdate = true
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true
    // this.scale.setResizeCallback(this.resize, this)

    this.physics.startSystem(Phaser.Physics.ARCADE)

    this.stage.smoothed = true

    this.game.input.gamepad.start()

    this.state.start('PreloadMenu')
  }
}
