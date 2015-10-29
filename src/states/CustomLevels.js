
/* global ButtonList, nonSteam, w2, Adventure */

var customLevels = function (game) {
  this.game = game
  this.buttons = null
}

customLevels.prototype = {
  create: function () {
    this.title = this.game.add.text(w2, 100, 'custom levels', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    var workshop = this.buttons.add('steam_button', 'workshop', this.workshop)
    this.buttons.add('editorOpen', 'open file', this.openFile)
    this.buttons.add('editor_button', 'level editor', this.editor)
    this.buttons.add('back_button', 'back', this.backPressed)

    this.buttons.create()

    if (nonSteam) {
      workshop.disable()
      this.buttons.select(1)
    } else this.buttons.select(0)
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

  workshop: function () {
    this.game.state.start('LevelSelector', true, false, true) // last argument makes the menu show workshop items
  },

  openFile: function () {
    var open = require('nw-open-file')
    open(function (fileName) {
      var fs = require('fs')
      fs.readFile(fileName, 'utf8', function (error, data) {
        if (error) throw error
        var mode = new Adventure(this.game, false)
        this.game.state.start('PreloadGame', true, false, mode, fileName)
      }.bind(this))
    }.bind(this))
  },

  editor: function () {
    this.game.state.start('Editor')
  },

  backPressed: function () {
    this.game.state.start('Menu')
  }
}
