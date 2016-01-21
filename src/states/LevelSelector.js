/* global ButtonList, w2, h2, Adventure, Phaser, localStorage */
var levelSelector = function (game) {
  this.title = null
  this.buttons = null
  this.containerScrollBar = null
  this.scrollMask = null
  this.containerX = 0
  this.containerY = 0
  this.items = null
  this.type = false
  this.hardMode = false
  this.unlockType = 'unlocks'
}

levelSelector.prototype = {
  init: function (type) {
    this.type = type
    // possible type values:
    // 'community levels'
    // 'adventure'
    // 'my levels'
  },

  create: function () {
    this.title = this.game.add.text(w2, 100, this.type, {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.containerX = 1.5 * w2
    this.containerY = 300

    this.buttons = new ButtonList(this, this.game)
    /* for (var i = 0; i < 200; i++) */
    this.buttons.add('back_button', 'back', this.backPressed)
    var unlocks = parseInt(localStorage.getItem('unlocks'), 10)

    switch (this.type) {
      case 'community levels':
        this.buttons.add('steam_button', 'download new levels', this.workshopOverlay)
        this.getWorkshopLevels('Subscribed')
        break
      case 'adventure':
        if (unlocks >= 30) {
          if (this.hardMode || !this.changingModes) {
            this.mode = this.buttons.add('deaths-stats', 'mode: hard', this.toggleMode)
            this.unlockType = 'unlocksHard'
            this.hardMode = true
          } else {
            this.mode = this.buttons.add('normal_button', 'mode: normal', this.toggleMode)
            this.unlockType = 'unlocks'
          }
        }
        this.getAdventureLevels()
        break
      case 'my levels':
        this.getWorkshopLevels('Published')
    }
    this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this)

    var greenworks = require('./greenworks')
    greenworks.on('game-overlay-activated', function (is_active) {
      if (!is_active) this.state.restart(true, false, 'community levels')
    }.bind(this))
  },

  workshopOverlay: function () {
    var greenworks = require('./greenworks')
    // greenworks.ugcShowOverlay()
    greenworks.activateGameOverlayToWebPage('http://steamcommunity.com/workshop/browse/?appid=404700&browsesort=trend&section=readytouseitems')
  },

  getWorkshopLevels: function (listType) {
    // get subscribed levels from worskhop
    this.loadingText = this.add.text(w2, 400, 'fetching levels...', {
      font: '80px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.loadingText.anchor.set(0.5)

    var greenworks = require('./greenworks')
    greenworks.ugcGetUserItems(
      greenworks.UGCMatchingType.Items,
      greenworks.UserUGCListSortOrder.SubscriptionDateDesc,
      greenworks.UserUGCList[listType],
      function (items) {
        this.items = items
        for (var i = 0; i < items.length; i++) {
          (function (i) {
            var buttonType = 'starWhite_button'
            if (!localStorage.getItem(items[i].publishedFileId) || localStorage.getItem(items[i].publishedFileId) == 'false') {
              localStorage.setItem(items[i].publishedFileId, false)
              buttonType = 'starWhite_button'
            }
            else if (localStorage.getItem(items[i].publishedFileId)) {
              buttonType = 'starYellow_button'
            }
            var button = this.buttons.add(buttonType, items[i].title, function () {
              this.playWorkshopLevel(i)
            })
            button.w = 550
          }.bind(this))(i)
        }
        this.loadingText.visible = false
        if (this.items.length === 0) {
          if (this.type === 'my levels') this.buttons.add('editor_button', 'create new level', function () { this.game.state.start('Editor') })
        }
        this.createButtons()
      }.bind(this),
      function (error) {
        console.log('error getting workshop items: ' + error)
        this.loadingText.text = 'connection error'
        this.createButtons()
      })
  },

  getAdventureLevels: function () {
    var unlocks = localStorage.getItem(this.unlockType)
    if (unlocks === null) unlocks = 0
    else unlocks = parseInt(unlocks, 10)
    var fs = require('fs')
    var dir = this.hardMode ? 'assets/levels/hard' : 'assets/levels/normal'
    this.items = fs.readdirSync(dir)
    for (var i = 0; i < this.items.length; i++) {
      var title = this.items[i].split('-')[1]
      if (!title) title = 'level ' + (i + 1);
      (function (i) {
        var button = this.buttons.add('circle_button', title, function () {
          this.playLocalLevel(i)
        })
        button.number = i + 1
        button.w = 550
        if (unlocks < 0) button.disable()
        unlocks--
      }.bind(this))(i)
    }
    this.createButtons()
  },

  createButtons: function () {
    this.buttons.create()
    this.buttons.setScrolling(true)
    var auxUnlocks = parseInt(localStorage.getItem(this.unlockType), 10)
    if (parseInt(localStorage.getItem('unlocks'), 10) > 29) this.buttons.select(auxUnlocks + 2)
    else this.buttons.select(auxUnlocks + 1)

    var barHeight = 2 * h2 - this.containerY + 100
    var draggyHeight = Math.min(barHeight * (7 / (this.buttons.length() + 1)), barHeight)

    this.containerScrollBar = this.game.add.sprite(this.containerX + 100, this.containerY - 100, 'scroll_button')
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
    if (this.type === 'adventure' && !this.changingModes) {
      this.containerScrollBar.y = h2 * 2 - this.containerScrollBar.height
    }
    this.changingModes = false
  },

  update: function () {
    if (this.containerScrollBar) {
      this.buttons.setY(300 + (this.containerY - 100 - this.containerScrollBar.y) / ((2 * h2 - this.containerY + 100) / ((this.buttons.length() + 1) * 125)))
      this.buttons.update()
    }
  },

  workshopOverlay: function () {
    var greenworks = require('./greenworks')
    // greenworks.ugcShowOverlay()
    greenworks.activateGameOverlayToWebPage('http://steamcommunity.com/workshop/browse/?appid=404700&browsesort=trend&section=readytouseitems')
  },

  playWorkshopLevel: function (level) {
    var mode = new Adventure(this.game, false)
    var greenworks = require('./greenworks')
    var file = this.items[level].file
    mode.file = this.items[level].publishedFileId
    mode.title = this.items[level].title
    mode.workshopLevel = true
    greenworks.ugcDownloadItem(file, 'saves', function () {
      mode.setScreen()
      this.game.state.start('PreloadGame', true, false, mode, 'saves/customLevel')
    }.bind(this), function (error) {
      console.log('error downloading from workshop: ' + error)
      this.backPressed()
    }.bind(this))
  },

  playLocalLevel: function (i) {
    var dir = this.hardMode ? 'assets/levels/hard/' : 'assets/levels/normal/'
    var levelPath = dir + this.items[i]
    var mode = new Adventure(this.game, false, this.items)
    mode.index = i
    mode.unlockType = this.unlockType
    mode.setScreen()
    this.game.state.start('PreloadGame', true, false, mode, levelPath)
  },

  backPressed: function () {
    switch (this.type) {
      case 'community levels':
      case 'my levels':
        this.game.state.start('CustomLevels')
        break
      case 'adventure':
        this.game.state.start('SinglePlayer')
        break
    }
  },

  mouseWheel: function (event) {
    var min = 200, max = 900
    var c = this.containerScrollBar
    c.y -= this.game.input.mouse.wheelDelta * 20
    c.input.checkBoundsRect()
  },

  toggleMode: function () {
    this.hardMode = !this.hardMode
    this.changingModes = true
    this.state.restart(true, false, this.type)
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
