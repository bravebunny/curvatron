/* global ButtonList, w2, h2, Adventure, Phaser */
var levelSelector = function (game) {
  this.title = null
  this.buttons = null
  this.containerScrollBar = null
  this.scrollMask = null
  this.containerX = 0
  this.containerY = 0
}

levelSelector.prototype = {
  create: function () {
    this.title = this.game.add.text(w2, 100, 'Level Selector', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.containerX = 1.5 * w2
    this.containerY = 300

    this.buttons = new ButtonList(this, this.game)

    this.buttons.add('back_button', 'back', this.backPressed)
    this.buttons.add('accept_button', 'play', this.play)
    this.buttons.add('accept_button', 'play', this.play)
    this.buttons.add('accept_button', 'play', this.play)
    this.buttons.add('accept_button', 'play', this.play)
    this.buttons.add('accept_button', 'play', this.play)
    this.buttons.add('accept_button', 'play', this.play)

    this.buttons.create()
    this.buttons.select(1)

    this.containerScrollBar = this.game.add.sprite(this.containerX, this.containerY - 50, 'scroll_button')
    this.containerScrollBar.scale.set(50, 100)
    this.containerScrollBar.anchor.set(1, 0.5)

    this.scrollMask = this.game.add.graphics(0, 0)
    this.scrollMask.beginFill(0xffffff)
    this.scrollMask.drawRect(w2 * 0.5, this.containerY - 100, w2 * 2, h2 * 1.2)
    this.scrollMask.endFill()

    this.containerScrollBar.mask = this.scrollMask
    this.containerScrollBar.inputEnabled = true
    this.containerScrollBar.input.useHandCursor = true
    this.containerScrollBar.input.enableDrag(false, true)
    this.containerScrollBar.input.allowHorizontalDrag = false
    this.containerScrollBar.input.boundsRect = new Phaser.Rectangle(this.containerX - this.containerScrollBar.width, this.containerY - 100, 5000, h2 * 1.2)
  },

  update: function () {
    this.buttons.setY(2 * this.containerY - this.containerScrollBar.y - 100)
    this.buttons.update()
  },

  play: function () {
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
