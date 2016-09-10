/*eslint-disable*/
/* global players, scale:true, adjustScreen */
/*eslint-enable*/
var Creative = function (game) {
  this.sp = true
  this.game = game
  this.player = null
  this.leaderboardID = null
  this.noCollisions = true
  this.popup = null
  this.twitter = null
  this.rToken = null
  this.rTokenSecret = null
  this.name = 'creative'
}

Creative.prototype = {
  create: function () {
    this.player = players[0]
    scale = 0.3
  },

  setScreen: function () {
    adjustScreen(this.game)
  },

  erasesTrail: function () {
    return !this.player.ready
  }
}
