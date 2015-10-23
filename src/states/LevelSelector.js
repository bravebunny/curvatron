/* global ButtonList, w2, h2, Adventure, numberPlayers */
var levelSelector = function (game) {
  this.title = null
  this.buttons = null
  this.containerScrollBar = null
  this.scrollMask = null
}

levelSelector.prototype = {
  create: function () {
    this.title = this.game.add.text(w2, 100, 'Level Selector', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)

    this.buttons.add('back_button', 'back', this.backPressed)
    this.buttons.add('accept_button', 'play', this.play)

    this.buttons.create()

    this.buttons.select(1)

    this.containerScrollBar = this.game.add.sprite(w2 * 0.5, h2 * 0.8, 'back_button')

  /*  this.scrollMask = this.game.add.graphics(0, 0)
    this.scrollMask.beginFill(0xffffff)
    this.scrollMask.drawRect(w2 * 0.5, h2 * 0.8, 5000, 500)
    this.scrollMask.endFill()*/

    //this.containerScrollBar.mask = this.scrollMask
    this.containerScrollBar.inputEnabled = true
    this.containerScrollBar.input.enableDrag(false, true)
    this.containerScrollBar.input.allowHorizontalDrag = false
    this.containerScrollBar.input.boundsRect = (w2 * 0.5, h2 * 0.8, 5000, 500)
    this.containerScrollBar.input.useHandCursor = true

    //this.containerScrollBar.addChild( levels )
  },

  play: function () {
    numberPlayers = 0
    var mode = new Adventure(this.game, false)
    this.game.state.start('PreloadGame', true, false, mode, 'assets/levels/level1')
  },

  backPressed: function () {
    this.game.state.start('Menu')
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
  }

}
