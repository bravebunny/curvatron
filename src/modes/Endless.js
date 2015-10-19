var Endless = function (game) {
  this.sp = true
  this.game = game
  this.player = null
  this.name = 'endless'
}

Endless.prototype = {
  create: function () {
    this.player = players[0]
  },

  update: function () {},

  erasesTrail: function () {
    return !this.player.ready
  },

  getScore: function () {
    return this.player.trailArray.length
  },

  getHighScore: function () {
    var score = parseInt(localStorage.getItem('survivalScore'))
    if (isNaN(score)) {
      return 0
    } else {
      return score
    }
  },

  setHighScore: function (score) {
    localStorage.setItem('survivalScore', score)
  },

  submitScore: function () {
    var score = this.getScore()
    if (score > this.getHighScore()) {
      this.setHighScore(score)
    }
  }
}
