/*eslint-disable*/
/* global keys:true, colorHex, clickButton, maxPlayers, w2, h2, localStorage,
ButtonList, colorHexDark, changingKeys:true, Phaser, defaultKeys */
/*eslint-enable*/
var setKeys = function (game) {
  this.ui = {}
  this.selectedPlayer = 0
  this.buttons = null
  this.playersButton = null
  this.maxPlayers = 7
  this.dialogText = null
  this.previousState = null
  this.gamepadMap = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT',
                     'BACK', 'START', 'L3', 'R3', 'UP', 'DOWN', 'LEFT', 'RIGHT']
}

setKeys.prototype = {
  init: function (previousState) {
    this.previousState = previousState
  },

  create: function () {
    var ui = this.ui

    ui.title = this.game.add.text(w2, 100, 'configure keys', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    ui.title.anchor.setTo(0.5, 0.5)

    this.buttons = new ButtonList(this, this.game)
    this.playersButton = this.buttons.add(null, '<    player ' + (this.selectedPlayer + 1) + '     >', this.left, this.right)
    this.buttons.add('smallKey_button', 'change', this.change)
    this.buttons.add('restart_button', 'reset', this.reset)
    this.buttons.add('accept_button', 'confirm', this.backPressed)
    this.buttons.create()

    ui.keyButton = this.game.add.sprite(w2, h2 + 320, 'key_button')
    ui.keyButton.anchor.setTo(0.5, 0.5)
    ui.keyText = this.game.add.text(w2, h2 + 290, '', {
      font: '150px dosis',
      fill: colorHex,
      align: 'center'
    })
    ui.keyText.anchor.setTo(0.5, 0.5)

    ui.gpText = this.game.add.text(w2, h2 + 425, 'controller 1', {
      font: '40px dosis',
      fill: 'white',
      align: 'center'
    })
    ui.gpText.anchor.setTo(0.5, 0.5)
    ui.gpText.visible = false

    this.updateIcon()

    this.overlay = this.add.sprite(0, 0, 'overlay')
    this.overlay.width = w2 * 2
    this.overlay.height = h2 * 2
    this.overlay.alpha = 0.7
    this.overlay.visible = false

    this.dialogText = this.add.text(w2, h2, '', {
      font: '80px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.dialogText.anchor.setTo(0.5, 0.5)
    this.dialogText.visible = false

    this.game.input.keyboard.addCallbacks(this, this.onPressed)
    this.game.input.gamepad.onUpCallback = this.onPressedGamepad.bind(this)
  },

  update: function () {
    if (!changingKeys) {
      this.buttons.update()
    }
  },

  left: function () {
    if (this.selectedPlayer === 0) {
      this.selectedPlayer = this.maxPlayers
    } else {
      this.selectedPlayer--
    }
    this.playersButton.setText('<    player ' + (this.selectedPlayer + 1) + '     >')
    this.updateIcon()
  },

  right: function () {
    if (this.selectedPlayer === this.maxPlayers) {
      this.selectedPlayer = 0
    } else {
      this.selectedPlayer++
    }
    this.playersButton.setText('<    player ' + (this.selectedPlayer + 1) + '     >')
    this.updateIcon()
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
    if (changingKeys) this.hideDialog()
    else {
      localStorage['keys'] = JSON.stringify(keys)
      this.game.state.start(this.previousState)
    }
  },

  onPressed: function () {
    if (changingKeys &&
      this.game.input.keyboard.lastKey.keyCode >= 48 &&
      this.game.input.keyboard.lastKey.keyCode <= 90) {
      keys[this.selectedPlayer] = this.game.input.keyboard.lastKey.keyCode + ''
      this.setKeyboardIcon()
      this.hideDialog()
    }
  },

  onPressedGamepad: function (button, gamepad) {
    console.log(arguments)
    if (changingKeys && button !== Phaser.Gamepad.XBOX360_START) {
      keys[this.selectedPlayer] = (gamepad + 1) + ',' + button
      this.setGamepadIcon()
      this.hideDialog()
    }
  },

  updateIcon: function () {
    if (keys[this.selectedPlayer].indexOf(',') === -1) {
      this.setKeyboardIcon()
    } else {
      this.setGamepadIcon()
    }
  },

  setGamepadIcon: function () {
    this.ui.keyButton.loadTexture('gp_button')
    var player = keys[this.selectedPlayer].split(',')[0]
    var button = keys[this.selectedPlayer].split(',')[1]
    var buttonName = this.gamepadMap[button]
    this.ui.keyText.setText(buttonName)
    this.ui.keyText.scale.set(1 / (buttonName.length))
    this.ui.gpText.visible = true
    this.ui.gpText.text = 'gamepad ' + player
  },

  setKeyboardIcon: function () {
    this.ui.keyButton.loadTexture('key_button')
    this.ui.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]))
    this.ui.keyText.scale.set(1)
    this.ui.gpText.visible = false
  },

  change: function () {
    this.showDialog('press the desired key for player ' + (this.selectedPlayer + 1))
  },

  reset: function () {
    keys = defaultKeys.slice() // copy array
    this.ui.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]))
  },

  showDialog: function (text) {
    this.game.input.mouse.enabled = false
    this.dialogText.text = text
    this.dialogText.visible = true
    this.overlay.visible = true
    changingKeys = true
  },

  hideDialog: function () {
    this.game.input.mouse.enabled = true
    this.dialogText.visible = false
    this.overlay.visible = false
    changingKeys = false
  }
}
