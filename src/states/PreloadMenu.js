/* global w2, h2, Phaser, pad1*/

var preloadMenu = function (game) {
  this.loadingBar = null
  this.text = null
  this.gamepadSet = false
}

preloadMenu.prototype = {
  preload: function () {
    this.loadingBar = this.add.sprite(w2, h2, 'loading')
    this.game.physics.enable(this.loadingBar, Phaser.Physics.ARCADE)
    this.loadingBar.anchor.setTo(0.5, 0.5)
    this.loadingBar.body.angularVelocity = 200
    this.game.physics.arcade.velocityFromAngle(this.loadingBar.angle, 300 * this.speed, this.loadingBar.body.velocity)
    // Load all stuf from menu
    this.game.load.image('stats_button', 'assets/sprites/gui/main/stats.png')
    this.game.load.image('multiplayer_button', 'assets/sprites/gui/main/multiplayer.png')
    this.game.load.image('singleplayer_button', 'assets/sprites/gui/main/singleplayer.png')
    this.game.load.image('settings_button', 'assets/sprites/gui/main/settings.png')
    this.game.load.image('editor_button', 'assets/sprites/gui/main/editor.png')

    this.game.load.image('endless_button', 'assets/sprites/gui/singleplayer/endless.png')
    this.game.load.image('oldSchool_button', 'assets/sprites/gui/singleplayer/oldSchool.png')
    this.game.load.image('collecting_button', 'assets/sprites/gui/singleplayer/collecting.png')
    this.game.load.image('adventure_button', 'assets/sprites/gui/singleplayer/adventure.png')
    this.game.load.image('creative_button', 'assets/sprites/gui/singleplayer/creative.png')

    this.game.load.image('audio_button', 'assets/sprites/gui/settings/audio.png')
    this.game.load.image('audiooff_button', 'assets/sprites/gui/settings/audiooff.png')
    this.game.load.image('music_button', 'assets/sprites/gui/settings/music.png')
    this.game.load.image('musicoff_button', 'assets/sprites/gui/settings/musicoff.png')
    this.game.load.image('setkeys_button', 'assets/sprites/gui/settings/setkeys.png')
    this.game.load.image('leaderboard_button', 'assets/sprites/gui/settings/leaderboard.png')
    this.game.load.image('fullscreen_button', 'assets/sprites/gui/settings/fullscreen.png')
    this.game.load.image('windowed_button', 'assets/sprites/gui/settings/windowed.png')
    this.game.load.image('key_button', 'assets/sprites/gui/settings/key.png')
    this.game.load.image('smallKey_button', 'assets/sprites/gui/settings/keybutton.png')
    this.game.load.image('resume_button', 'assets/sprites/gui/hud/resume.png')

    this.game.load.image('back_button', 'assets/sprites/gui/navigation/back.png')
    this.game.load.image('accept_button', 'assets/sprites/gui/navigation/accept.png')
    this.game.load.image('cancel_button', 'assets/sprites/gui/navigation/cancel.png')
    this.game.load.image('exit_button', 'assets/sprites/gui/navigation/exit.png')

    this.game.load.image('deaths-stats', 'assets/sprites/gui/stats/deaths-stats.png')
    this.game.load.image('old-stats', 'assets/sprites/gui/stats/old-stats.png')
    this.game.load.image('score-stat', 'assets/sprites/gui/stats/score-stat.png')
    this.game.load.image('total-stats', 'assets/sprites/gui/stats/total-stats.png')
    this.game.load.image('aux-stat', 'assets/sprites/gui/stats/aux-stat.png')
    this.game.load.image('survScore-stat', 'assets/sprites/gui/stats/endless-stat.png')

    this.game.load.image('overlay', 'assets/sprites/game/overlay.png')

    this.game.load.audio('dream', 'assets/music/dream.ogg')
  },

  create: function () {
    this.loadingBar.visible = false

    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.keys.down, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.keys.up, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.keys.left, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.keys.right, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.keys.selectPress, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onUp.add(this.keys.selectRelease, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.keys.backPressed, this)
    this.game.input.resetLocked = true

    this.text = this.add.text(w2, h2, 'press any key', {
      font: '100px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.text.anchor.setTo(0.5, 0.5)
    this.finished = true

    this.game.input.gamepad.onUpCallback = function () {
      if (this.game.input.gamepad.supported && this.game.input.gamepad.active && pad1.connected) {
        pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_UP).onDown.add(this.keys.up, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN).onDown.add(this.keys.down, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT).onDown.add(this.keys.left, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT).onDown.add(this.keys.right, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(this.keys.selectPress, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_A).onUp.add(this.keys.selectRelease, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_B).onUp.add(this.keys.backPressed, this)
        pad1.getButton(Phaser.Gamepad.XBOX360_START).onUp.add(this.keys.backPressed, this)
      }
      this.goToMenu()
    }.bind(this)

    this.game.input.keyboard.onUpCallback = function () {
      this.goToMenu()
    }.bind(this)

    this.game.input.mouse.mouseUpCallback = function () {
      this.goToMenu()
    }.bind(this)
  },

  goToMenu: function () {
    this.game.state.start('Menu')
    this.game.input.mouse.mouseUpCallback = null
    this.game.input.keyboard.onUpCallback = null
    this.game.input.gamepad.onUpCallback = null
  },

  keys: {
    backPressed: function () {
      if (this.state.states[this.game.state.current].backPressed) {
        this.state.states[this.game.state.current].backPressed()
      }
    },

    up: function () {
      if (this.state.states[this.game.state.current].up) {
        this.state.states[this.game.state.current].up()
      }
    },

    down: function () {
      if (this.state.states[this.game.state.current].down) {
        this.state.states[this.game.state.current].down()
      }
    },

    left: function () {
      if (this.state.states[this.game.state.current].left) {
        this.state.states[this.game.state.current].left()
      }
    },

    right: function () {
      if (this.state.states[this.game.state.current].right) {
        this.state.states[this.game.state.current].right()
      }
    },

    selectPress: function () {
      if (this.state.states[this.game.state.current].selectPress) {
        this.state.states[this.game.state.current].selectPress()
      }
    },

    selectRelease: function () {
      if (this.state.states[this.game.state.current].selectRelease) {
        this.state.states[this.game.state.current].selectRelease()
      }
    }
  }

}
