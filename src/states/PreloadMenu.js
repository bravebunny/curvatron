/* global Phaser, changingKeys*/

var preloadMenu = function (game) {
  this.loadingBar = null
}

preloadMenu.prototype = {
  preload: function () {
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
    this.game.load.image('gp_button', 'assets/sprites/gui/settings/gpbutton.png')
    this.game.load.image('smallKey_button', 'assets/sprites/gui/settings/keybutton.png')
    this.game.load.image('resume_button', 'assets/sprites/gui/hud/resume.png')

    this.game.load.image('back_button', 'assets/sprites/gui/navigation/back.png')
    this.game.load.image('accept_button', 'assets/sprites/gui/navigation/accept.png')
    this.game.load.image('cancel_button', 'assets/sprites/gui/navigation/cancel.png')
    this.game.load.image('exit_button', 'assets/sprites/gui/navigation/exit.png')
    this.game.load.image('restart_button', 'assets/sprites/gui/hud/restart.png')
    this.game.load.image('screenshot_button', 'assets/sprites/gui/hud/screenshot.png')

    this.game.load.image('deaths-stats', 'assets/sprites/gui/stats/deaths-stats.png')
    this.game.load.image('old-stats', 'assets/sprites/gui/stats/old-stats.png')
    this.game.load.image('score-stat', 'assets/sprites/gui/stats/score-stat.png')
    this.game.load.image('total-stats', 'assets/sprites/gui/stats/total-stats.png')
    this.game.load.image('aux-stat', 'assets/sprites/gui/stats/aux-stat.png')
    this.game.load.image('survScore-stat', 'assets/sprites/gui/stats/endless-stat.png')

    this.game.load.image('score', 'assets/sprites/gui/stats/score-general.png')
    this.game.load.image('pauseButton', 'assets/sprites/gui/hud/pause.png')
    this.game.load.image('twitter_button', 'assets/sprites/gui/hud/twitter.png')
    this.game.load.audio('move0', 'assets/sfx/move0.ogg')
    this.game.load.audio('move1', 'assets/sfx/move1.ogg')
    this.game.load.audio('move1', 'assets/sfx/move1.ogg')
    this.game.load.audio('kill', 'assets/sfx/kill.ogg')
    this.game.load.audio('sfx_collect0', 'assets/sfx/collect0.ogg')

    this.game.load.image('player', 'assets/sprites/game/singleplayer/player.png')
    this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png')
    this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png')
    this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100)
    this.game.load.image('Pastel', 'assets/levels/Pastel.png') // loading the tileset image
    this.game.load.tilemap('blank', 'assets/levels/blank.json', null, Phaser.Tilemap.TILED_JSON) // loading the tilemap file

    this.game.load.image('overlay', 'assets/sprites/game/overlay.png')

    this.game.load.audio('dream', 'assets/music/dream.ogg')

    // oldSchool
    this.game.load.image('old_point', 'assets/sprites/game/oldschool/point.png')
    this.game.load.image('old_player', 'assets/sprites/game/oldschool/player.png')
    this.game.load.image('old_superPower', 'assets/sprites/game/oldschool/power.png')
    this.game.load.image('old_trail', 'assets/sprites/game/oldschool/trail.png')
    this.game.load.audio('sfx_collectOld', 'assets/sfx/collectOld.ogg')
    this.game.load.audio('sfx_killOld', 'assets/sfx/killOld.ogg')

    // multiplayer
    this.game.load.image('pointMP', 'assets/sprites/game/multiplayer/pointMP.png')
    this.game.load.image('tie', 'assets/sprites/gui/hud/tie.png')
    this.game.load.image('winner', 'assets/sprites/gui/hud/winner.png')
    for (var i = 0; i < 8; i++) {
      this.game.load.image('player' + i, 'assets/sprites/game/multiplayer/player' + i + '.png')
      this.game.load.image('crown' + i, 'assets/sprites/game/multiplayer/crown' + i + '.png')
    }
  },

  create: function () {
    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.keys.down, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.keys.up, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.keys.left, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.keys.right, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.keys.selectPress, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onUp.add(this.keys.selectRelease, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.keys.backPressed, this)
    this.game.input.resetLocked = true

    this.game.state.start('Menu')
  },

  keys: {
    backPressed: function () {
      if (this.state.states[this.game.state.current].backPressed) {
        this.state.states[this.game.state.current].backPressed()
      }
    },

    up: function () {
      if (this.state.states[this.game.state.current].up && !changingKeys) {
        this.state.states[this.game.state.current].up()
      }
    },

    down: function () {
      if (this.state.states[this.game.state.current].down && !changingKeys) {
        this.state.states[this.game.state.current].down()
      }
    },

    left: function () {
      if (this.state.states[this.game.state.current].left && !changingKeys) {
        this.state.states[this.game.state.current].left()
      }
    },

    right: function () {
      if (this.state.states[this.game.state.current].right && !changingKeys) {
        this.state.states[this.game.state.current].right()
      }
    },

    selectPress: function () {
      if (this.state.states[this.game.state.current].selectPress && !changingKeys) {
        this.state.states[this.game.state.current].selectPress()
      }
    },

    selectRelease: function () {
      if (this.state.states[this.game.state.current].selectRelease && !changingKeys) {
        this.state.states[this.game.state.current].selectRelease()
      }
    }
  }

}
