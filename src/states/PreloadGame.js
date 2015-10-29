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
    //adjustScreen(this.game)
    if (this.level != null) {
      // this.game.load.text('level', 'assets/levels/level' + this.level)
      this.game.load.text('level', this.level)
    }
  },

  create: function () {
    this.game.state.start('GameMananger', true, false, this.mode)
  }

}
