/* global ButtonList, w2, mute:true, menuMusic:true */
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
    this.title = this.game.add.text(w2, 100, 'single player', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    this.buttons.add('setkeys_button', 'controls', this.controls)
    if (localStorage.getItem('mute') === 'false') {
      this.audio = this.buttons.add('audio_button', 'audio: on ', this.toggleAudio)
    }
    else {
      this.audio = this.buttons.add('audio_button', 'audio: off ', this.toggleAudio)
    }
    this.fullscreen = this.buttons.add('fullscreen_button', 'fullscreen', this.toggleFullscreen)
    this.buttons.add('back_button', 'back', this.backPressed)

    this.buttons.create()
    this.buttons.select(this.selection)
  },

  controls: function () {
    this.state.start('SetKeys')
  },

  toggleAudio: function () {
    mute = !mute
    this.updateAudioButton()
  },

  updateAudioButton: function () {
    if (!mute) {
      localStorage.setItem('mute', false)
      this.audio.setIcon('audio_button')
      this.audio.setText('audio: on ')
      // this.game.sound.mute = false
      if (!menuMusic) {
        menuMusic = this.add.audio('dream')
      }
      menuMusic.loop = true
      menuMusic.volume = 1
      if (!menuMusic.isPlaying) {
        menuMusic.play()
      }
    } else {
      localStorage.setItem('mute', true)
      this.audio.setIcon('audiooff_button')
      this.audio.setText('audio: off')
      // this.game.sound.mute = true
      if (menuMusic && menuMusic.isPlaying) {
        menuMusic.stop()
      }
    }
  },

  toggleFullscreen: function () {
    var gui = require('nw.gui')
    var win = gui.Window.get()
    win.toggleFullscreen()
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
