
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

    this.buttons.add('back_button', 'back', this.backPressed)
    var getLevels = this.buttons.add('steam_button', 'get new levels', this.workshopOverlay)
    var workshop = this.buttons.add('steam_button', 'play levels', this.workshop)
    this.buttons.add('editorOpen', 'open file', this.openFile)
    this.buttons.add('editor_button', 'create level', this.editor)
    var myLevels = this.buttons.add('editor_button', 'my levels', this.myLevels)
    this.buttons.create()

    if (nonSteam) {
      workshop.disable()
      getLevels.disable()
      myLevels.disable()
      this.buttons.select(2)
    } else this.buttons.select(1)
  },

  workshopOverlay: function () {
    var greenworks = require('./greenworks')
    // greenworks.ugcShowOverlay()
    greenworks.activateGameOverlayToWebPage('http://steamcommunity.com/workshop/browse/?appid=404700&browsesort=trend&section=readytouseitems')
  },

  workshop: function () {
    this.game.state.start('LevelSelector', true, false, 'workshop levels') // last argument makes the menu show workshop items
  },

  myLevels: function () {
    this.game.state.start('LevelSelector', true, false, 'my levels') // last argument makes the menu show workshop items
  },

  openFile: function () {
    var open = require('nw-open-file')
    open(function (fileName) {
      var fs = require('fs')
      fs.readFile(fileName, 'utf8', function (error, data) {
        if (error) console.log('error reading file: ' + error)
        var mode = new Adventure(this.game, false)
        this.game.state.start('PreloadGame', true, false, mode, fileName)
      }.bind(this))
    }.bind(this))
  },

  editor: function () {
    this.game.state.start('Editor')
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

  backPressed: function () {
    this.game.state.start('Menu')
  }
}
