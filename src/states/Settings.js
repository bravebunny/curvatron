/* global ButtonList, w2, muteMusic:true, muteSoundEffects:true, menuMusic:true,
localStorage, showMouse:true  */
var settings = function (game) {
  this.game = game
  this.title = null
  this.music = null
  this.soundEffects = null
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

    this.buttons.add('back_button', 'back', this.backPressed)
    this.music = this.buttons.add('audio_button', 'audio: on ', this.toggleMusic)
    this.soundEffects = this.buttons.add('audio_button', 'sound effects: on ', this.toggleSoundEffects)
    this.fullscreen = this.buttons.add('fullscreen_button', 'fullscreen', this.toggleFullscreen)
    this.showMouse = this.buttons.add('mouse_button', 'show cursor in game: on', this.toggleShowMouse)
    this.timeScale = this.buttons.add('time_button', 'time scale: 0.5', this.toggleTimeScale)
    this.buttons.add('setkeys_button', 'controls', this.controls)

    this.buttons.create()
    this.buttons.select(1)

    this.updateMusicButton()
    this.updateSoundEffectsButton()
    this.updateScreenButton()
    this.updateShowMouseButton()
    this.updateTimeScaleButton()
  },

  controls: function () {
    this.state.start('SetKeys', true, false, 'Settings')
  },

  toggleTimeScale: function () {
    this.game.time.slowMotion = this.game.time.slowMotion == 1 ? 2 : 1
    localStorage.setItem('timeScale', this.game.time.slowMotion)
    this.updateTimeScaleButton()
  },

  updateTimeScaleButton: function () {
    this.timeScale.setText('time scale: ' + 1 / this.game.time.slowMotion)
  },

  toggleMusic: function () {
    muteMusic = !muteMusic
    localStorage.setItem('muteMusic', muteMusic)
    this.updateMusicButton()
  },

  toggleSoundEffects: function () {
    muteSoundEffects = !muteSoundEffects
    localStorage.setItem('muteSoundEffects', muteSoundEffects)
    this.updateSoundEffectsButton()
  },

  updateMusicButton: function () {
    if (!muteMusic) {
      this.music.setIcon('audio_button')
      this.music.setText('music: on ')
      menuMusic.loop = true
      menuMusic.volume = 1
      if (!menuMusic.isPlaying) {
        menuMusic.play()
      }
    } else {
      this.music.setIcon('audiooff_button')
      this.music.setText('music: off')
      if (menuMusic.isPlaying) {
        menuMusic.stop()
      }
    }
  },

  updateSoundEffectsButton: function () {
    if (!muteSoundEffects) {
      this.soundEffects.setIcon('audio_button')
      this.soundEffects.setText('sound effects: on ')
    } else {
      this.soundEffects.setIcon('audiooff_button')
      this.soundEffects.setText('sound effects: off')
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

  toggleShowMouse: function () {
    showMouse = !showMouse
    localStorage.setItem('showMouse', showMouse)
    this.updateShowMouseButton()
  },

  updateShowMouseButton: function () {
    if (showMouse) {
      this.showMouse.setIcon('mouse_button')
      this.showMouse.setText('show cursor in game: on')
    } else {
      this.showMouse.setIcon('mouseoff_button')
      this.showMouse.setText('show cursor in game: off')
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
