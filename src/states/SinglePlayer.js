/*eslint-disable*/
/* global ButtonList, w2, numberPlayers:true, menuMusic, Normal, Endless,
OldSchool, Adventure, Creative */
/*eslint-enable*/
var singlePlayer = function (game) {
  this.ui = {}
  this.bestScore = 0
  this.bestSurvScore = 0
  this.game = game
  this.buttons = null
}

singlePlayer.prototype = {
  create: function () {
    var ui = this.ui

    ui.title = this.game.add.text(w2, 100, 'single player', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    ui.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    this.buttons.add('back_button', 'back', this.backPressed)
    this.buttons.add('adventure_button', 'adventure', this.adventure)
    this.buttons.add('collecting_button', 'normal', this.playNormalGame)
    this.buttons.add('endless_button', 'endless', this.playEndlessGame)
    this.buttons.add('oldSchool_button', 'old school', this.playOldSchoolGame)
    this.buttons.add('creative_button', 'creative', this.creative)

    this.buttons.create()
    this.buttons.select(1)
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

  playNormalGame: function () {
    var mode = new Normal(this.game)
    this.play(mode)
  },

  playEndlessGame: function () {
    var mode = new Endless(this.game)
    this.play(mode)
  },

  playOldSchoolGame: function () {
    var mode = new OldSchool(this.game)
    this.play(mode)
  },

  adventure: function () {
    this.state.start('LevelSelector', true, false, 'adventure')
  },

  creative: function () {
    var mode = new Creative(this.game)
    this.play(mode)
  },

  play: function (mode) {
    if (mode.setScreen) {
      mode.setScreen()
    }
    numberPlayers = 0
    this.game.state.start('PreloadGame', true, false, mode)
  },

  backPressed: function () {
    this.game.state.start('Menu')
  }
}
