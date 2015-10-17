/* global ButtonList, w2, mute:true, menuMusic:true, localStorage  */
var settings = function (game) {
  this.game = game
  this.title = null
  this.selection = 0
  this.audio = null
  this.fullscreen = null
  this.buttons = null
}

settings.prototype = {
  create: function () {
    this.title = this.game.add.text(w2, 100, 'settings', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    this.buttons.add('setkeys_button', 'controls', this.controls)
    this.audio = this.buttons.add('audio_button', 'audio: on ', this.toggleAudio)
    this.fullscreen = this.buttons.add('fullscreen_button', 'fullscreen', this.toggleFullscreen)
    this.buttons.add('back_button', 'back', this.backPressed)

    this.buttons.create()
    this.buttons.select(this.selection)

    this.updateAudioButton()
    this.updateScreenButton()
  },

  controls: function () {
    this.state.start('SetKeys', true, false, 'Settings')
  },

  toggleAudio: function () {
    mute = !mute
    localStorage.setItem('mute', mute)
    this.updateAudioButton()
  },

  updateAudioButton: function () {
    if (!mute) {
      this.audio.setIcon('audio_button')
      this.audio.setText('audio: on ')
      // this.game.sound.mute = false
      menuMusic.loop = true
      menuMusic.volume = 1
      if (!menuMusic.isPlaying) {
        menuMusic.play()
      }
    } else {
      this.audio.setIcon('audiooff_button')
      this.audio.setText('audio: off')
      // this.game.sound.mute = true
      if (menuMusic.isPlaying) {
        menuMusic.stop()
      }
    }
  },

  toggleFullscreen: function () {
    var gui = require('nw.gui')
    var win = gui.Window.get()
    win.toggleFullscreen()
    localStorage.setItem('fullscreen', win.isFullscreen)
    this.updateScreenButton()
  },

  updateScreenButton: function () {
    var gui = require('nw.gui')
    var win = gui.Window.get()
    if (win.isFullscreen) {
      this.fullscreen.setText('windowed')
      this.fullscreen.setIcon('windowed_button')
    } else {
      this.fullscreen.setText('fullscreen')
      this.fullscreen.setIcon('fullscreen_button')
    }
  },

  update: function () {
    this.buttons.update()
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
    this.game.state.start('Menu')
  }

}
