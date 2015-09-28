var stats = function (game) {
  this.ui = {}
}

stats.prototype = {
  create: function () {
    var ui = this.ui

    ui.title = this.game.add.text(0, 0, 'stats', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    ui.title.anchor.setTo(0.5, 0.5)

    var hs = localStorage.getItem('highScore')
    if (!hs) {
      hs = 0
    }
    ui.highScore = this.game.add.sprite(0, 0, 'score-stat')
    ui.highScore.anchor.setTo(0.5, 0.5)
    ui.highScore.alpha = 0.7
    ui.highScoretext = this.game.add.text(0, 0, hs, {
      font: '60px dosis',
      fill: colorHex,
      align: 'center'
    })
    ui.highScoretext.anchor.setTo(0.5, 0.5)

    var ss = localStorage.getItem('survivalScore')
    if (!ss) {
      ss = 0
    }
    ui.survivalScore = this.game.add.sprite(0, 0, 'survScore-stat')
    ui.survivalScore.anchor.setTo(0.5, 0.5)
    ui.survivalScore.alpha = 0.7
    ui.survivalScoretext = this.game.add.text(0, 0, ss, {
      font: '60px dosis',
      fill: colorHex,
      align: 'center'
    })
    ui.survivalScoretext.anchor.setTo(0.5, 0.5)

    var bs = localStorage.getItem('ballsScore')
    if (!bs) {
      bs = 0
    }
    ui.totalBalls = this.game.add.sprite(0, 0, 'total-stats')
    ui.totalBalls.anchor.setTo(0.5, 0.5)
    ui.totalBalls.alpha = 0.7
    ui.totalBallsText = this.game.add.text(0, 0, bs, {
      font: '60px dosis',
      fill: colorHex,
      align: 'center'
    })
    ui.totalBallsText.anchor.setTo(0.5, 0.5)

    var ds = localStorage.getItem('deathScore')
    if (!ds) {
      ds = 0
    }
    ui.statsDeaths = this.game.add.sprite(0, 0, 'deaths-stats')
    ui.statsDeaths.anchor.setTo(0.5, 0.5)
    ui.statsDeaths.alpha = 0.7
    ui.textDeaths = this.game.add.text(0, 0, ds, {
      font: '60px dosis',
      fill: colorHex,
      align: 'center'
    })
    ui.textDeaths.anchor.setTo(0.5, 0.5)

    var os = localStorage.getItem('oldSchool')
    if (!os) {
      os = 0
    }
    ui.oldSchool = this.game.add.sprite(0, 0, 'old-stats')
    ui.oldSchool.anchor.setTo(0.5, 0.5)
    ui.oldSchool.alpha = 0.7
    ui.textOldSchool = this.game.add.text(0, 0, os, {
      font: '60px dosis',
      fill: colorHex,
      align: 'center'
    })
    ui.textOldSchool.anchor.setTo(0.5, 0.5)

    // back button
    ui.backButton = this.game.add.button(0, 0, 'back_button')
    ui.backButton.anchor.setTo(0.5, 0.5)
    ui.backButton.input.useHandCursor = true
    clickButton(ui.backButton, this.backPressed, this)

    // Place the menu buttons and labels on their correct positions
    this.setPositions()
  },

  backPressed: function () {
    this.game.state.start('Menu')
  },

  setPositions: function () {
    var ui = this.ui

    ui.title.position.set(w2, h2 * 0.3)

    ui.highScore.position.set(w2 - 300, h2 - 85)
    ui.highScoretext.position.set(w2 - 250, h2 - 85)

    ui.survivalScore.position.set(w2, h2 - 85)
    ui.survivalScoretext.position.set(w2 + 50, h2 - 85)

    ui.totalBalls.position.set(w2 - 150, h2 + 75)
    ui.totalBallsText.position.set(w2 - 100, h2 + 75)

    ui.statsDeaths.position.set(w2 + 150, h2 + 75)
    ui.textDeaths.position.set(w2 + 200, h2 + 75)

    ui.oldSchool.position.set(w2 + 300, h2 - 85)
    ui.textOldSchool.position.set(w2 + 350, h2 - 85)

    ui.highScore.scale.set(0.7, 0.7)
    ui.highScoretext.scale.set(0.7, 0.7)

    ui.survivalScore.scale.set(0.7, 0.7)
    ui.survivalScoretext.scale.set(0.7, 0.7)

    ui.totalBallsText.scale.set(0.7, 0.7)
    ui.totalBalls.scale.set(0.7, 0.7)

    ui.statsDeaths.scale.set(0.7, 0.7)
    ui.textDeaths.scale.set(0.7, 0.7)

    if (ui.oldSchool && ui.textOldSchool) {
      ui.oldSchool.scale.set(0.7, 0.7)
      ui.textOldSchool.scale.set(0.7, 0.7)
    }

    ui.backButton.position.set(w2 / 2, 1.6 * h2)
  }

}
