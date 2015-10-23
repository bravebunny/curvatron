/* global w2, Button, colorHex */
var ButtonList = function (context, game) {
  this.context = context
  this.game = game
  this.buttons = []

  this.x = w2
  this.y = 300
  this.selection = 0
  this.pressingSelect = false
  this.pressingUp = false
  this.pressingDown = false
  this.visible = true

  this.textColor = colorHex
}

ButtonList.prototype = {
  create: function () {
    for (var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i]
      b.textColor = this.textColor
      b.setPosition(this.x, this.y + i * 125)
      b.setIndex(i)
      b.create()
    }
  },

  update: function () {
    if (this.visible) {
      for (var i = 0; i < this.buttons.length; i++) {
        var b = this.buttons[i]
        if (i === this.selection && !b.selected) b.select()
        else if (i !== this.selection && b.selected) b.deselect()
      }
    }
  },

  setX: function (x) {
    this.x = x
    for (var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i]
      b.setPosition(this.x, this.y + i * 125)
    }
  },

  setY: function (y) {
    this.y = y
    for (var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i]
      b.setPosition(this.x, this.y + i * 125)
    }
  },

  setMask: function (mask) {
    for (var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i]
      b.button.mask = mask
    }
  },

  setGroup: function (group) {
    for (var i = 0; i < this.buttons.length; i++) {
      group.addChild(this.buttons[i])
    }
  },

  add: function (icon, text, callback) {
    var button = new Button(icon, text, callback, this, this.context, this.game)
    this.buttons.push(button)
    return button
  },

  selectDown: function () {
    if (!this.pressingSelect) {
      var newS = (this.selection + 1) % this.buttons.length
      // menuArray[newS].button.onInputOver.dispatch()
      this.selection = newS
    }
  },

  selectUp: function () {
    if (!this.pressingSelect) {
      var n = this.buttons.length
      var newS = (((this.selection - 1) % n) + n) % n
      // menuArray[newS].button.onInputOver.dispatch()
      this.selection = newS
    }
  },

  selectPress: function () {
    this.pressingSelect = true
    this.buttons[this.selection].button.onInputDown.dispatch()
  },

  selectRelease: function () {
    this.pressingSelect = false
    this.buttons[this.selection].button.onInputUp.dispatch()
  },

  select: function (selection) {
    this.selection = selection
  },

  hide: function () {
    this.visible = false
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].hide()
    }
  },

  show: function () {
    this.visible = true
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show()
    }
  },

  length: function () {
    return this.buttons.length
  },

  getButton: function (i) {
    return this.buttons[i]
  }
}
