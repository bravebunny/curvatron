/* global Phaser, changingKeys*/

var preloadMenu = function (game) {}

preloadMenu.prototype = {
  preload: function () {
    // Load all stuf from menu
    this.game.load.image('stats_button', 'assets/sprites/gui/main/stats.png')
    this.game.load.image('multiplayer_button', 'assets/sprites/gui/main/multiplayer.png')
    this.game.load.image('singleplayer_button', 'assets/sprites/gui/main/singleplayer.png')
    this.game.load.image('settings_button', 'assets/sprites/gui/main/settings.png')
    this.game.load.image('editor_button', 'assets/sprites/gui/main/editor.png')
    this.game.load.image('credits_button', 'assets/sprites/gui/main/credits.png')

    this.game.load.image('endless_button', 'assets/sprites/gui/singleplayer/endless.png')
    this.game.load.image('collecting_button', 'assets/sprites/gui/singleplayer/collecting.png')
    this.game.load.image('adventure_button', 'assets/sprites/gui/singleplayer/adventure.png')
    this.game.load.image('creative_button', 'assets/sprites/gui/singleplayer/creative.png')
    this.game.load.image('normal_button', 'assets/sprites/gui/singleplayer/normal.png')

    this.game.load.image('audio_button', 'assets/sprites/gui/settings/audio.png')
    this.game.load.image('audiooff_button', 'assets/sprites/gui/settings/audiooff.png')
    this.game.load.image('music_button', 'assets/sprites/gui/settings/music.png')
    this.game.load.image('musicoff_button', 'assets/sprites/gui/settings/musicoff.png')
    this.game.load.image('setkeys_button', 'assets/sprites/gui/settings/setkeys.png')
    this.game.load.image('mouse_button', 'assets/sprites/gui/settings/mouse.png')
    this.game.load.image('mouseoff_button', 'assets/sprites/gui/settings/mouseoff.png')
    this.game.load.image('leaderboard_button', 'assets/sprites/gui/settings/leaderboard.png')
    this.game.load.image('fullscreen_button', 'assets/sprites/gui/settings/fullscreen.png')
    this.game.load.image('windowed_button', 'assets/sprites/gui/settings/windowed.png')
    this.game.load.image('key_button', 'assets/sprites/gui/settings/key.png')
    this.game.load.image('gp_button', 'assets/sprites/gui/settings/gpbutton.png')
    this.game.load.image('smallKey_button', 'assets/sprites/gui/settings/keybutton.png')
    this.game.load.image('resume_button', 'assets/sprites/gui/hud/resume.png')
    this.game.load.image('circle_button', 'assets/sprites/gui/navigation/circle.png')

    this.game.load.image('back_button', 'assets/sprites/gui/navigation/back.png')
    this.game.load.image('accept_button', 'assets/sprites/gui/navigation/accept.png')
    this.game.load.image('cancel_button', 'assets/sprites/gui/navigation/cancel.png')
    this.game.load.image('exit_button', 'assets/sprites/gui/navigation/exit.png')
    this.game.load.image('restart_button', 'assets/sprites/gui/hud/restart.png')
    this.game.load.image('screenshot_button', 'assets/sprites/gui/hud/screenshot.png')
    this.game.load.image('scroll_button', 'assets/sprites/gui/navigation/scrollButton.png')

    this.game.load.image('deaths-stats', 'assets/sprites/gui/stats/deaths-stats.png')
    this.game.load.image('score-stat', 'assets/sprites/gui/stats/score-stat.png')
    this.game.load.image('total-stats', 'assets/sprites/gui/stats/total-stats.png')
    this.game.load.image('aux-stat', 'assets/sprites/gui/stats/aux-stat.png')
    this.game.load.image('survScore-stat', 'assets/sprites/gui/stats/endless-stat.png')
    this.game.load.image('total-clicks', 'assets/sprites/gui/stats/total-clicks.png')

    this.game.load.image('score', 'assets/sprites/gui/stats/score-general.png')
    this.game.load.image('pauseButton', 'assets/sprites/gui/hud/pause.png')
    this.game.load.image('twitter_button', 'assets/sprites/gui/hud/twitter.png')

    this.game.load.audio('move0', 'assets/sfx/move0.ogg')
    this.game.load.audio('move1', 'assets/sfx/move1.ogg')
    this.game.load.audio('sfx_finish', 'assets/sfx/finish.ogg')
    this.game.load.audio('sfx_start', 'assets/sfx/start.ogg')
    this.game.load.audio('sfx_press', 'assets/sfx/press.ogg')
    this.game.load.audio('kill', 'assets/sfx/kill.ogg')
    this.game.load.audio('shrink', 'assets/sfx/shrink.ogg')
    this.game.load.audio('sfx_collect0', 'assets/sfx/collect.ogg')
    this.game.load.audio('sfx_checkpoint', 'assets/sfx/checkpoint.ogg')

    this.game.load.image('player', 'assets/sprites/game/singleplayer/player.png')
    this.game.load.image('obstacle', 'assets/sprites/game/singleplayer/obstacle.png')
    this.game.load.image('pointSuper', 'assets/sprites/game/singleplayer/powerHS.png')
    this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png')
    this.game.load.image('checkpoint', 'assets/sprites/game/singleplayer/checkpoint.png')
    this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100)
    this.game.load.image('block', 'assets/sprites/game/block.png')

    this.game.load.image('overlay', 'assets/sprites/game/overlay.png')

    this.game.load.audio('dream', 'assets/music/dream.ogg')

    // multiplayer
    this.game.load.image('pointMP', 'assets/sprites/game/multiplayer/pointMP.png')
    this.game.load.image('tie', 'assets/sprites/gui/hud/tie.png')
    this.game.load.image('winner', 'assets/sprites/gui/hud/winner.png')
    for (var i = 0; i < 8; i++) {
      this.game.load.image('player' + i, 'assets/sprites/game/multiplayer/player' + i + '.png')
      this.game.load.image('crown' + i, 'assets/sprites/game/multiplayer/crown' + i + '.png')
    }

    // editor
    this.game.load.image('editorPoint', 'assets/sprites/gui/editor/point.png')
    this.game.load.image('editorDraw', 'assets/sprites/gui/editor/draw.png')
    this.game.load.image('editorErase', 'assets/sprites/gui/editor/erase.png')
    this.game.load.image('editorArrow', 'assets/sprites/gui/editor/arrow.png')
    this.game.load.image('editorStart', 'assets/sprites/gui/editor/start.png')
    this.game.load.image('editorCheckpoint', 'assets/sprites/gui/editor/checkpoint.png')
    this.game.load.image('editorsave', 'assets/sprites/gui/editor/save.png')
    this.game.load.image('editorNewPage', 'assets/sprites/gui/editor/newPage.png')
    this.game.load.image('editorExit', 'assets/sprites/gui/editor/exit.png')
    this.game.load.image('menu_button', 'assets/sprites/gui/editor/menu.png')
    this.game.load.image('editorOpen', 'assets/sprites/gui/editor/open.png')
    this.game.load.image('upload_button', 'assets/sprites/gui/editor/upload.png')
    this.game.load.image('steam_button', 'assets/sprites/gui/editor/steam.png')
    this.game.load.image('horizontal_button', 'assets/sprites/gui/editor/horizontal.png')
    this.game.load.image('vertical_button', 'assets/sprites/gui/editor/vertical.png')
    this.game.load.image('rotator_button', 'assets/sprites/gui/editor/rotator.png')
    this.game.load.image('horizontalDoor_button', 'assets/sprites/gui/editor/horizontalDoor.png')
    this.game.load.image('verticalDoor_button', 'assets/sprites/gui/editor/verticalDoor.png')

    this.game.add.text(0, 0, 'fix', {font: '1px dosis'}) // hack to remove problems of load css fonts
  },

  create: function () {
    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.keys.down, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(this.keys.down, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.keys.up, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(this.keys.up, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.keys.left, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(this.keys.left, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.keys.right, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.keys.right, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.keys.selectPress, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onUp.add(this.keys.selectRelease, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.keys.selectPress, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onUp.add(this.keys.selectRelease, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.keys.backPressed, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE).onDown.add(this.keys.backPressed, this)
    this.game.input.resetLocked = true


    var bunny = this.game.add.sprite(w2, h2, 'bunny')
    bunny.anchor.set(0.5)
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
      this.game.state.start('Menu')
    }, this)
    
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
