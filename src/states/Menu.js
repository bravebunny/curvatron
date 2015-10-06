/*eslint-disable*/
/* global Phaser, maxPlayers:true, keys:true, menuMusic:true, setScreenFixed,
baseH, changeColor:true, chosenColor:true, colorHex:true, bgColors,
colorHexDark:true, bgColorsDark, bgColor:true, mute, w2, ButtonList */
/*eslint-enable*/
var menu = function (game) {
  maxPlayers = 7
  keys = [
    Phaser.Keyboard.W,
    Phaser.Keyboard.P,
    Phaser.Keyboard.B,
    Phaser.Keyboard.Z,
    Phaser.Keyboard.M,
    Phaser.Keyboard.C,
    Phaser.Keyboard.R,
    Phaser.Keyboard.U]
  menuMusic = null
  this.ui = {}

  this.buttons = null; // eslint-disable-line
}

menu.prototype = {
  create: function () {
    setScreenFixed(baseH, baseH, this.game)

    this.world.pivot.set(0, 0)
    this.world.angle = 0

    if (changeColor) {
      chosenColor = this.game.rnd.integerInRange(0, 3)
      colorHex = bgColors[chosenColor]
      colorHexDark = bgColorsDark[chosenColor]
      document.body.style.background = colorHex
      this.stage.backgroundColor = colorHex
      changeColor = false
    }

    bgColor = Phaser.Color.hexToColor(colorHex)
    this.stage.backgroundColor = colorHex
    document.body.style.background = colorHex

    if (menuMusic === null) {
      menuMusic = this.add.audio('dream')
    }
    if (!menuMusic.isPlaying && !mute) {
      menuMusic.loop = true
      menuMusic.play()
      menuMusic.volume = 1
    }
    var ui = this.ui

    // Game Title
    ui.title = this.add.text(w2, 100, 'curvatron', {
      font: '175px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    ui.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    this.buttons.add('singleplayer_button', 'single player', this.singlePlayer)
    this.buttons.add('multiplayer_button', 'multiplayer', this.multiplayer)
    this.buttons.add('stats_button', 'statistics', this.stats)
    this.buttons.add('editor_button', 'editor', this.editor)
    this.buttons.add('settings_button', 'settings', this.settings)
    this.buttons.add('exit_button', 'exit', this.backPressed)

    this.buttons.create()
    this.buttons.select(0)
  },

  update: function () {
    this.buttons.update()
  },

  editor: function () {
    this.state.start('Editor')
  },

  singlePlayer: function () {
    this.state.start('SinglePlayer', true, false)
  },

  settings: function () {
    this.state.start('Settings', true, false)
  },

  multiplayer: function () {
    this.state.start('Multiplayer')
  },

  leaderboard: function () {
    this.state.start('Leaderboards')
  },

  stats: function () {
    this.state.start('Stats')
  },

  up: function () {
    this.buttons.selectUp()
  },

  down: function () {
    this.buttons.selectDown()
  },

  selectPress: function () {
    this.buttons.selectPress()
  },

  selectRelease: function () {
    this.buttons.selectRelease()
  },

  backPressed: function () {
    window.close()
  }

}
