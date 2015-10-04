/*eslint-disable*/
/* global Phaser, adjustScreen, w2, h2 */
/*eslint-enable*/
var preloadGame = function (game) {
  this.game = game
  this.mode = null
  this.level = null
}

preloadGame.prototype = {
  init: function (mode, level) {
    this.mode = mode
    this.level = level
  },

  preload: function () {
    adjustScreen(this.game)

    var loadingBar = this.add.sprite(w2, h2, 'loading')
    this.game.physics.enable(loadingBar, Phaser.Physics.ARCADE)
    loadingBar.anchor.setTo(0.5, 0.5)
    loadingBar.body.angularVelocity = 200
    this.game.physics.arcade.velocityFromAngle(loadingBar.angle, 300 * this.speed, loadingBar.body.velocity)

    if (this.state.preload) {
      this.state.preload()
    }

    if (this.level != null) {
      this.game.load.json('level', 'assets/levels/level' + this.level + '.json')
    }

    // Load all stuf from game
    this.game.load.image('score', 'assets/sprites/gui/stats/score-general.png')
    this.game.load.image('pauseButton', 'assets/sprites/gui/hud/pause.png')
    this.game.load.image('restart_button', 'assets/sprites/gui/hud/restart.png')
    this.game.load.image('resume_button', 'assets/sprites/gui/hud/resume.png')
    this.game.load.audio('move0', 'assets/sfx/move0.ogg')
    this.game.load.audio('move1', 'assets/sfx/move1.ogg')
    this.game.load.audio('move1', 'assets/sfx/move1.ogg')
    this.game.load.audio('kill', 'assets/sfx/kill.ogg')
    this.game.load.audio('sfx_collect0', 'assets/sfx/collect0.ogg')
    this.mode.preload()
  },

  create: function () {
    this.game.state.start('GameMananger', true, false, this.mode)
  }

}
