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
}

levelSelector.prototype = {
  init: function (type) {
    this.type = type
    // possible type values:
    // 'workshop levels'
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
    if (this.hardMode) this.mode = this.buttons.add('deaths-stats', 'hard mode', this.toggleMode)
    else this.mode = this.buttons.add('normal_button', 'normal mode', this.toggleMode)

    switch (this.type) {
      case 'workshop levels':
        this.getWorkshopLevels('Subscribed')
        break
      case 'adventure':
        this.getAdventureLevels()
        break
      case 'my levels':
        this.getWorkshopLevels('Published')
    }

    this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this)
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
            this.buttons.add('resume_button', items[i].title, function () {
              this.playWorkshopLevel(i)
            })
          }.bind(this))(i)
        }
        this.loadingText.visible = false
        if (this.items.length === 0) {
          if (this.type === 'my levels') this.buttons.add('editor_button', 'create new level', function () { this.game.state.start('Editor') })
          else this.buttons.add('steam_button', 'get new levels', this.workshopOverlay)
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
    var unlocks = localStorage.getItem('unlocks')
    if (unlocks === null) unlocks = 0
    else unlocks = parseInt(unlocks, 10)
    var fs = require('fs')
    var dir = this.hardMode ? 'assets/levels/hard' : 'assets/levels'
    this.items = fs.readdirSync(dir)
    for (var i = 0; i < this.items.length; i++) {
      var title = this.items[i].split('-')[1]
      if (!title) title = 'level ' + (i+1);
      (function (i) {
        var button = this.buttons.add('circle_button', title, function () {
          this.playLocalLevel(i)
        })
        button.number = i + 1
        if (unlocks < 0) button.disable()
        unlocks--
      }.bind(this))(i)
    }
    this.createButtons()
  },

  createButtons: function () {
    this.buttons.create()
    this.buttons.setScrolling(true)
    this.buttons.select(1)

    var barHeight = 2 * h2 - this.containerY + 100
    var draggyHeight = Math.min(barHeight * (7 / (this.buttons.length() + 1)), barHeight)

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
    var levelPath = 'assets/levels/' + this.items[i]
    var mode = new Adventure(this.game, false, this.items)
    mode.index = i
    mode.setScreen()
    this.game.state.start('PreloadGame', true, false, mode, levelPath)
  },

  backPressed: function () {
    switch (this.type) {
      case 'workshop levels':
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
    c.y -= this.game.input.mouse.wheelDelta * 10
    c.input.checkBoundsRect()
  },

  toggleMode: function () {
    this.hardMode = !this.hardMode
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
