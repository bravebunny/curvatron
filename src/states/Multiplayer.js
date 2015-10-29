/* global ButtonList, w2, MPNormal */
var multiplayer = function (game) {
  this.title = null
  this.maxPlayers = 7
  this.nPlayers = 1
  this.playersButton = null
  this.buttons = null
}

multiplayer.prototype = {
  create: function () {
    this.title = this.game.add.text(w2, 100, 'multiplayer', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    this.playersButton = this.buttons.add(null, '<    ' + (this.nPlayers + 1) + ' players    >', this.left, this.right)
    this.buttons.add('accept_button', 'play', this.play)
    this.buttons.add('setkeys_button', 'controls', this.controls)
    this.buttons.add('back_button', 'back', this.backPressed)

    this.buttons.create()

    this.buttons.select(1)
  },

  update: function () {
    this.buttons.update()
  },

  play: function () {
    var mode = new MPNormal(this.nPlayers, this.game)
    mode.setScreen()
    this.game.state.start('PreloadGame', true, false, mode)
  },

  controls: function () {
    this.state.start('SetKeys', true, false, 'Multiplayer')
  },

  backPressed: function () {
    this.game.state.start('Menu')
  },

  left: function () {
    if (this.nPlayers === 1) {
      this.nPlayers = this.maxPlayers
    } else {
      this.nPlayers--
    }
    this.playersButton.setText('<    ' + (this.nPlayers + 1) + ' players    >')
  },

  right: function () {
    if (this.nPlayers === this.maxPlayers) {
      this.nPlayers = 1
    } else {
      this.nPlayers++
    }
    this.playersButton.setText('<    ' + (this.nPlayers + 1) + ' players    >')
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
  }

}
