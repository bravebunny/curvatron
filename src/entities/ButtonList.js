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
  this.visible = false

  this.textColor = colorHex
}

ButtonList.prototype = {
  create: function () {
    this.visible = true
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
    if (this.visible) {
      for (var i = 0; i < this.buttons.length; i++) {
        var b = this.buttons[i]
        b.setPosition(this.x, this.y + i * 125)
      }
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

  moveSelection: function (offset) {
    if (!this.pressingSelect) {
      var initialSelection = this.selection // used to check for endless loop
      var helper = true
      var newS, n
      while (helper) {
        n = this.buttons.length
        newS = (((this.selection + offset) % n) + n) % n
        this.selection = newS
        if (this.buttons[this.selection].enabled || this.selection === initialSelection) {
          helper = false
        }
      }
    }
  },

  selectDown: function () {
    this.moveSelection(1)
  },

  selectUp: function () {
    this.moveSelection(-1)
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
    this.setX(this.x)
    this.setY(this.y)
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show()
    }
  },

  length: function () {
    return this.buttons.length
  },

  getButton: function (i) {
    return this.buttons[i]
  },

  setTextSize: function (size) {
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].setTextSize(size)
    }
  }
}
