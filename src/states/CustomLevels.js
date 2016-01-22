
/* global ButtonList, nonSteam, w2 */

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
    var workshop = this.buttons.add('resume_button', 'community levels', this.workshop)
    this.buttons.add('editor_button', 'level editor', this.editor)
    var myLevels = this.buttons.add('singleplayer_button', 'my published levels', this.myLevels)
    this.buttons.create()

    if (nonSteam) {
      workshop.disable()
      getLevels.disable()
      myLevels.disable()
      this.buttons.select(2)
    } else this.buttons.select(1)
  },

  workshop: function () {
    this.game.state.start('LevelSelector', true, false, 'community levels') // last argument makes the menu show workshop items
  },

  myLevels: function () {
    this.game.state.start('LevelSelector', true, false, 'my levels') // last argument makes the menu show workshop items
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
