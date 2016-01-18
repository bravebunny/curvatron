/* global ButtonList, w2, h2, Phaser, musicList */
var credits = function (game) {
  this.title = null
  this.buttons = null
  this.containerScrollBar = null
  this.scrollMask = null
  this.containerX = 0
  this.containerY = 0
  this.items = null
  this.type = false
}

credits.prototype = {
  init: function (type) {
    this.type = type
  },

  create: function () {
    this.title = this.game.add.text(w2, 100, 'credits', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.containerX = 1.7 * w2
    this.containerY = 300

    this.buttons = new ButtonList(this, this.game)
    this.buttons.add('back_button', 'back', this.backPressed)
 
    this.getCreditsText()

    this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this)
  },

  getCreditsText: function () {
    for (var i = 0; i < musicList.length; i++) {
      var title = musicList[i].title + " : " + musicList[i].author
      if (!title) title = 'level ' + (i + 1);
      (function (i) {
        var button = this.buttons.add('circle_button', title, function () {
          // link for the musicians pages
          var greenworks = require('./greenworks')
          greenworks.activateGameOverlayToWebPage(musicList[i].site)
        })
        button.w = 550
        button.graphics = null
      }.bind(this))(i)
    }
    this.createButtons()
  },

  createButtons: function () {
    this.buttons.create()
    this.buttons.setScrolling(true)
    this.buttons.select(1)

    var barHeight = 2 * h2 - this.containerY + 100
    var draggyHeight = Math.min(barHeight * (7 / (musicList.length + 1)), barHeight)

    this.containerScrollBar = this.game.add.sprite(this.containerX, this.containerY - 100, 'scroll_button')
    this.containerScrollBar.scale.set(50, draggyHeight)
    this.containerScrollBar.anchor.set(1, 0)
    if (draggyHeight === barHeight) this.containerScrollBar.visible = false

    this.scrollMask = this.game.add.graphics(0, 0)
    this.scrollMask.beginFill(0xffffff)
    this.scrollMask.drawRect(w2 * 0.5, this.containerY - 100, w2 * 2, h2 * 2)
    this.scrollMask.endFill()

    this.buttons.setMask(this.scrollMask)

    this.containerScrollBar.inputEnabled = true
    this.containerScrollBar.input.useHandCursor = true
    this.containerScrollBar.input.enableDrag(false, true)
    this.containerScrollBar.input.allowHorizontalDrag = false
    this.containerScrollBar.input.boundsRect = new Phaser.Rectangle(
      0,
      this.containerY - 100,
      2 * w2,
      barHeight)
  },

  update: function () {
    if (this.containerScrollBar) {
      this.buttons.setY(300 + (this.containerY - 100 - this.containerScrollBar.y) / ((2 * h2 - this.containerY + 100) / ((this.buttons.length() + 1) * 125)))
      this.buttons.update()
    }
  },

  backPressed: function () {
    this.game.state.start('Menu')
  },

  mouseWheel: function (event) {
    var min = 200, max = 900
    var c = this.containerScrollBar
    c.y -= this.game.input.mouse.wheelDelta * 10
    c.input.checkBoundsRect()
  },

  up: function () {
    this.buttons.selectUp()
    if (this.buttons.length() > 6) {
      if (this.buttons.selection < this.buttons.length() - 1) {
        if (this.containerScrollBar.y > this.containerY - 100) {
          this.buttons.setY(this.buttons.y + 125)
          this.containerScrollBar.y = -(this.buttons.y - 300) * ((2 * h2 - this.containerY + 100) / ((this.buttons.length() + 1) * 125)) + this.containerY - 100
        }
      } else {
        this.buttons.setY(this.buttons.y + 125 * this.buttons.length)
        this.containerScrollBar.y = h2 * 2 - this.containerScrollBar.height
      }
    }
  },

  down: function () {
    if (this.buttons.length() > 6) {
      if (this.buttons.selection < this.buttons.length() - 1) {
        if (this.containerScrollBar.y < h2 * 2 - this.containerScrollBar.height) {
          this.buttons.setY(this.buttons.y - 125)
          this.containerScrollBar.y = -(this.buttons.y - 300) * ((2 * h2 - this.containerY + 100) / ((this.buttons.length() + 1) * 125)) + this.containerY - 100
        }
      } else {
        this.buttons.setY(this.buttons.y - 125 * this.buttons.length)
        this.containerScrollBar.y = this.containerY - 100
      }
    }
    this.buttons.selectDown()
  },

  selectPress: function () {
    this.buttons.selectPress()
  },

  selectRelease: function () {
    this.buttons.selectRelease()
  }

}
