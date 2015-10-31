/*eslint-disable*/
/* global setScreenFixed, baseW, baseH, Phaser, colorHexDark, Blob, saveAs,
ButtonList, h2, w2, Adventure, numberPlayers:true, CanvasInput, nonSteam */
/*eslint-enable*/
var editor = function (game) {
  this.game = game
  this.layer = null
  this.marker = null
  this.map = null
  this.tb = {}
  this.prevCursorX = 0
  this.prevCursorY = 0
  this.lastStartPosition = null
  this.confirmButtons = null
  this.open = false
  this.newPage = false
  this.exit = false
  this.dialogText = null
  this.returning = false
  this.fileName = null
  this.levelArray = []
  this.maxPoints = 32
  this.textInput = null

  // reserved values in the level file
  // the remaining ones can be used for the points
  this.values = {
    start: 35,
    wall: 1,
    empty: 0
  }
}

editor.prototype = {
  init: function (returning) {
    this.returning = returning
  },

  create: function () {
    setScreenFixed(baseW, baseH + 200, this.game)
    // variables that need to be reset
    this.tool = 'draw' // draw, erase, point, start
    this.selectedPoint = 1
    this.points = []
    this.pointPositions = []
    this.mapW = 60
    this.mapH = 34
    this.tileSize = 32
    this.mouseWasDown = false

    // change outer background color
    document.body.style.background = colorHexDark

    this.obstacleGroup = this.game.add.group()
    this.lastPoint = null

    this.map = this.game.add.tilemap()
    this.map.addTilesetImage('block')
    this.layer = this.map.create('obstacles', this.mapW, this.mapH, this.tileSize, this.tileSize)
    this.layer.resizeWorld()
    this.map.setCollisionByExclusion([], true, this.layer)

    this.game.canvas.oncontextmenu = function (e) { e.preventDefault() }

    // the square that shows under the mouse to show what's selected
    this.marker = this.game.add.graphics()
    this.marker.lineStyle(2, 0xFFFFFF, 1)
    this.marker.drawRect(0, 0, this.tileSize, this.tileSize)
    this.marker.lineStyle(2, 0x000000, 1)
    this.marker.drawRect(0, 0, this.tileSize - 2, this.tileSize - 2)

    // grid overlay
    var gridBMD = this.game.add.bitmapData(this.game.width, this.game.height)
    var gridImage = gridBMD.addToWorld()
    gridImage.alpha = 0.3
    var gridSize = this.tileSize * 3
    gridImage.inputEnabled = true
    gridImage.events.onInputOver.add(function (button) { this.showTooltip('', button) }.bind(this))

    this.overlay = gridBMD.ctx
    this.overlay.strokeStyle = '#FFFFFF'
    this.overlay.lineWidth = 1
    this.overlay.beginPath()
    this.overlay.moveTo(0, 0)
    for (var i = 1; i < this.mapW / 3; i++) {
      this.overlay.moveTo(i * gridSize, 0)
      this.overlay.lineTo(i * gridSize, baseH)
      this.overlay.moveTo((i + 1) * gridSize, baseH)
      this.overlay.lineTo((i + 1) * gridSize, 0)
    }
    this.overlay.moveTo(0, 0)
    for (var e = 1; e < this.mapH / 3 - 1; e++) {
      this.overlay.moveTo(0, e * gridSize)
      this.overlay.lineTo(this.game.width, e * gridSize)
      this.overlay.moveTo(this.game.width, (e + 1) * gridSize)
      this.overlay.lineTo(0, (e + 1) * gridSize)
    }
    this.overlay.stroke()

    // toolbar background
    this.tb.bg = this.game.add.sprite(0, baseH, 'overlay')
    this.tb.bg.width = baseW
    this.tb.bg.height = 2 * h2
    this.tb.bg.alpha = 0.5

    // toolbar icons
    this.tb.left = this.game.add.button(100, baseH + 100, 'editorArrow', this.pointDec, this)
    this.tb.left.anchor.set(0.5, 0.5)
    this.tb.left.scale.set(-0.4, 0.4)

    this.tb.point = this.game.add.button(200, baseH + 100, 'editorPoint', this.pointTool, this)
    this.tb.point.anchor.set(0.5)
    this.tb.point.scale.set(0.4)
    this.tb.point.events.onInputOver.add(function (button) { this.showTooltip('point', button) }.bind(this))

    this.tb.pointText = this.game.add.text(this.tb.point.x, this.tb.point.y, this.selectedPoint, {
      font: '60px dosis',
      fill: colorHexDark,
      align: 'center'
    })
    this.tb.pointText.anchor.set(0.5)

    this.start = this.game.add.sprite(w2, h2, 'editorStart')
    this.start.anchor.set(0.5, 0.05)
    this.start.visible = false
    // this.start.scale.set(0.9)

    // toolbar icons
    this.tb.right = this.game.add.button(300, baseH + 100, 'editorArrow', this.pointInc, this)
    this.tb.right.anchor.set(0.5, 0.5)
    this.tb.right.scale.set(0.4)

    this.tb.draw = this.game.add.button(450, baseH + 100, 'editorDraw', this.drawTool, this)
    this.tb.draw.anchor.set(0.5, 0.5)
    this.tb.draw.scale.set(0.4)
    this.tb.draw.events.onInputOver.add(function (button) { this.showTooltip('draw blocks', button) }.bind(this))

    this.tb.erase = this.game.add.button(600, baseH + 100, 'editorErase', this.eraseTool, this)
    this.tb.erase.anchor.set(0.5, 0.5)
    this.tb.erase.scale.set(0.4)
    this.tb.erase.events.onInputOver.add(function (button) { this.showTooltip('erase blocks', button) }.bind(this))

    this.tb.start = this.game.add.button(750, baseH + 100, 'editorStart', this.startTool, this)
    this.tb.start.anchor.set(0.5, 0.5)
    this.tb.start.scale.set(0.6)
    this.tb.start.events.onInputOver.add(function (button) { this.showTooltip('change start position', button) }.bind(this))

    this.tb.test = this.game.add.button(1050, baseH + 100, 'resume_button', this.test, this)
    this.tb.test.anchor.setTo(0.5, 0.5)
    this.tb.test.scale.set(0.8)
    this.tb.test.events.onInputOver.add(function (button) { this.showTooltip('test level', button) }.bind(this))

    this.tb.open = this.game.add.button(1200, baseH + 100, 'editorOpen', this.auxOpen, this)
    this.tb.open.anchor.set(0.5, 0.5)
    this.tb.open.scale.set(0.8)
    this.tb.open.events.onInputOver.add(function (button) { this.showTooltip('import level', button) }.bind(this))

    this.tb.save = this.game.add.button(1350, baseH + 100, 'editorsave', this.save, this)
    this.tb.save.anchor.set(0.5, 0.5)
    this.tb.save.scale.set(0.4)
    this.tb.save.events.onInputOver.add(function (button) { this.showTooltip('save to computer', button) }.bind(this))

    this.tb.upload = this.game.add.button(1500, baseH + 100, 'upload_button', null, this)
    this.tb.upload.anchor.set(0.5, 0.5)
    this.tb.upload.scale.set(0.9)
    var uploadTooltip = ''
    if (nonSteam) {
      uploadTooltip = 'upload disabled: steam needs to be open'
      this.tb.upload.alpha = 0.5
    } else {
      uploadTooltip = 'upload to workshop'
      this.tb.upload.onInputUp.add(this.upload, this)
    }
    this.tb.upload.events.onInputOver.add(function (button) { this.showTooltip(uploadTooltip, button) }.bind(this))

    this.tb.newPage = this.game.add.button(1650, baseH + 100, 'editorNewPage', this.auxNewPage, this)
    this.tb.newPage.anchor.setTo(0.5, 0.5)
    this.tb.newPage.scale.set(0.4)
    this.tb.newPage.events.onInputOver.add(function (button) { this.showTooltip('clear page', button) }.bind(this))

    this.tb.exit = this.game.add.button(1800, baseH + 100, 'editorExit', this.auxExit, this)
    this.tb.exit.anchor.setTo(0.5, 0.5)
    this.tb.exit.scale.set(0.8)
    this.tb.exit.events.onInputOver.add(function (button) { this.showTooltip('exit to menu', button) }.bind(this))

    // square that shows the selected tool
    this.selector = this.game.add.graphics()
    this.selector.lineStyle(10, 0xFFFFFF, 1)
    this.selector.drawRect(-60, -60, 120, 120)

    this.uploadButtons = new ButtonList(this, this.game)
    this.uploadButtons.add('upload_button', 'upload', this.confirmUpload)
    this.uploadButtons.add('cancel_button', 'cancel', this.cancel)
    this.uploadButtons.textColor = colorHexDark
    this.uploadButtons.create()
    this.uploadButtons.hide()

    this.inputBMD = this.add.bitmapData(600, 100)
    this.inputImage = this.inputBMD.addToWorld()
    this.inputImage.position.set(w2, 150)
    this.inputImage.anchor.set(0.5)
    this.inputImage.inputEnabled = true
    this.inputImage.visible = false
    this.inputImage.events.onInputUp.add(function () {
      this.textInput.focus()
    }, this)

    this.textInput = new CanvasInput({
      canvas: this.inputBMD.canvas,
      fontSize: 60,
      fontFamily: 'dosis',
      fontColor: colorHexDark,
      width: this.inputBMD.width - 10,
      height: this.inputBMD.height - 10,
      placeHolder: 'level name',
      borderRadius: 0,
      borderWidth: 0,
      innerShadow: '0px',
      padding: 10,
      onsubmit: this.confirmUpload
    })

    this.confirmButtons = new ButtonList(this, this.game)
    this.confirmButtons.add('accept_button', 'yes', this.confirm)
    this.confirmButtons.add('cancel_button', 'cancel', this.cancel)
    this.confirmButtons.textColor = colorHexDark
    this.confirmButtons.create()
    this.confirmButtons.hide()

    this.dialogText = this.add.text(w2, 150, '', {
      font: '80px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.dialogText.anchor.setTo(0.5, 0.5)
    this.dialogText.visible = false

    if (this.returning) {
      this.loadFromArray()
    } else {
      this.levelArray = Array.apply(null, Array(this.mapW * this.mapH)).map(Number.prototype.valueOf, 0)
    }

    this.tooltip = this.add.text(0, 0, '', {
      font: '35px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.tooltip.anchor.setTo(0.5, 0.5)
    this.tooltip.visible = false
  },

  update: function () {
    var pointerX = this.game.input.activePointer.worldX
    var pointerY = this.game.input.activePointer.worldY

    for (var i = 0; i < this.points.length; i++) {
      var point = this.points[i]
      if (point) {
        if (i === this.selectedPoint) {
          point.alpha = 1
          point.scale.set(0.7)
        } else {
          point.alpha = 0.3
          point.scale.set(0.5)
        }
      }
    }

    // save around selected tool in toolbar
    this.selector.x = this.tb[this.tool].x
    this.selector.y = this.tb[this.tool].y

    if (pointerY < this.tb.bg.y) {
      // cursor square to mark drawing position
      this.marker.x = this.layer.getTileX(pointerX) * this.tileSize
      this.marker.y = this.layer.getTileY(pointerY) * this.tileSize

      var x = this.marker.x + this.tileSize / 2
      var y = this.marker.y + this.tileSize / 2
      var tileX = this.layer.getTileX(x)
      var tileY = this.layer.getTileY(y)

      if (!this.mouseWasDown) {
        this.prevCursorX = tileX
        this.prevCursorY = tileY
      }

      if (this.game.input.mousePointer.isDown) {
        this.mouseWasDown = true
        var line = new Phaser.Line(this.prevCursorX, this.prevCursorY, tileX, tileY)
        var linePoints = line.coordinatesOnLine()
        this.prevCursorX = tileX
        this.prevCursorY = tileY

        for (i = 0; i < linePoints.length; i++) {
          var lineX = linePoints[i][0]
          var lineY = linePoints[i][1]
          var index = lineX * this.mapH + lineY

          switch (this.tool) {
            case 'draw':
              if (this.levelArray[index] === this.values.empty) {
                this.map.putTile(0, lineX, lineY)
                this.levelArray[index] = this.values.wall
              }
              break

            case 'erase':
              if (this.map.getTile(lineX, lineY) != null) {
                this.map.removeTile(lineX, lineY)
              }

              if (this.levelArray[index] === 2) { // true if is a point
                var pointN = this.pointPositions.indexOf(index)
                this.points[pointN].destroy()
                for (var e = pointN; e < this.points.length - 1; e++) {
                  this.pointPositions[e] = this.pointPositions[e + 1]
                  this.points[e] = this.points[e + 1]
                }
                this.points = this.points.slice(0, -1)
                this.pointPositions = this.pointPositions.slice(0, -1)
                if (this.selectedPoint >= pointN) {
                  this.pointDec()
                }
              }

              if (this.levelArray[index] !== this.values.start) {
                this.levelArray[index] = this.values.empty
              }
              break

            case 'point':
              if (this.levelArray[tileX * this.mapH + tileY] === this.values.empty) {
                this.createPoint(tileX, tileY, this.selectedPoint)
                // value is set as 2 temporarily, will be replaced later
                this.levelArray[tileX * this.mapH + tileY] = 2
                this.pointPositions[this.selectedPoint] = tileX * this.mapH + tileY
                // this.pointsGrid[this.selectedPoint] = [tileX, this.layer.getTileX(y)]
              }
              break

            case 'start':
              if (this.levelArray[tileX * this.mapH + tileY] === this.values.empty) {
                this.levelArray[tileX * this.mapH + tileY] = this.values.start
                this.createStart(tileX, tileY)
              }
              break
          }
        }
      } else {
        this.mouseWasDown = false
      }
    }

    this.confirmButtons.update()
    this.uploadButtons.update()
  },

  showTooltip: function (name, button) {
    // tool titles
    this.tooltip.position.set(button.x, baseH + 20)
    this.tooltip.setText(name)
    this.tooltip.visible = true
  },

  createPoint: function (tileX, tileY, i) {
    var x = tileX * this.tileSize + this.tileSize / 2
    var y = tileY * this.tileSize + this.tileSize / 2
    if (this.points[i] == null) {
      this.points[i] = this.game.add.sprite(x, y, 'point')
      this.game.world.sendToBack(this.points[i])
      this.points[i].anchor.set(0.5)
      this.points[i].inputEnabled = true
    } else {
      this.levelArray[this.pointPositions[i]] = 0
      this.points[i].position.set(x, y)
    }
  },

  createStart: function (x, y) {
    if (!this.start.visible) this.start.visible = true
    this.start.position.set(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2)
    var lp = this.lastStartPosition
    var index = x * this.mapH + y
    if (lp !== null && lp !== index) this.levelArray[lp] = 0
    this.lastStartPosition = x * this.mapH + y
  },

  startTool: function () {
    this.tool = 'start'
  },

  drawTool: function () {
    this.tool = 'draw'
  },

  eraseTool: function () {
    this.tool = 'erase'
  },

  pointTool: function () {
    this.tool = 'point'
  },

  pointDec: function () {
    if (this.selectedPoint > 1) {
      this.selectedPoint--
    } else if (this.points.length > 0) {
      if (this.points.length < this.maxPoints) this.selectedPoint = this.points.length
      else this.selectedPoint = this.maxPoints
    }
    this.tb.pointText.text = this.selectedPoint
  },

  pointInc: function () {
    if (this.selectedPoint < this.points.length && this.selectedPoint < this.maxPoints) {
      this.selectedPoint++
    } else {
      this.selectedPoint = 1
    }
    this.tb.pointText.text = this.selectedPoint
  },

  backPressed: function () {
    if (this.tb.bg.y === 0) { // true if confirmation menu is open
      this.cancel()
    } else {
      this.auxExit()
    }
  },

  left: function () {
    this.pointDec()
  },

  right: function () {
    this.pointInc()
  },

  up: function () {
    if (this.confirmButtons.visible) this.confirmButtons.selectUp()
  },

  down: function () {
    if (this.confirmButtons.visible) this.confirmButtons.selectDown()
  },

  selectPress: function () {
    if (this.confirmButtons.visible) this.confirmButtons.selectPress()
  },

  selectRelease: function () {
    if (this.confirmButtons.visible) this.confirmButtons.selectRelease()
  },

  generateFile: function () {
    for (var i = 0; i < this.pointPositions.length; i++) {
      this.levelArray[this.pointPositions[i]] = i + 1
    }
    // using base 36 lets us use all the letters up to Z as numbers
    var strings = this.levelArray.map(function (val) { return val.toString(36) })
    return strings.join('')
  },

  save: function () {
    var blob = new Blob([this.generateFile()], {type: 'text/plain'})
    saveAs(blob, 'curvatron_level')
  },

  auxNewPage: function () {
    this.newPage = true
    this.showDialog('all unsaved progress will be lost. clear screen?')
  },

  auxExit: function () {
    this.exit = true
    this.showDialog('all unsaved progress will be lost. exit?')
  },

  auxOpen: function () {
    this.open = true
    this.showDialog('all unsaved progress will be lost. chose another project?')
  },

  test: function () {
    var fs = require('fs')
    fs.writeFile('tempLevel', this.generateFile(), function (error) {
      if (error) console.log('error writing file: ' + error)
      numberPlayers = 0
      var mode = new Adventure(this.game, true)
      mode.setScreen()
      this.game.state.start('PreloadGame', true, false, mode, 'tempLevel')
    }.bind(this))
  },

  showDialog: function (text) {
    this.dialogText.text = text
    this.dialogText.visible = true
    this.tb.bg.y = 0
    this.confirmButtons.show()
    this.confirmButtons.select(1)
  },

  cancel: function () {
    this.confirmButtons.hide()
    this.uploadButtons.hide()
    this.dialogText.visible = false
    this.tb.bg.y = baseH
    this.inputImage.visible = false
    this.textInput.selectText()
    this.textInput.blur()
  },

  upload: function () {
    this.game.canvas.toBlob(function (blob) {
      var fs = require('fs')
      var png = this.game.canvas.toDataURL()
      png = png.replace(/^data:image\/png;base64,/, '')

      var path = require('path')
      var process = require('process')
      var nwPath = process.execPath
      var nwDir = path.dirname(nwPath) + '\\saves\\tempScreenshot.png'

      fs.writeFile('saves/tempScreenshot.png', png, 'base64', function (error) {
        if (error) console.log('error writing file: ' + error)
        console.log('screenshot save success')
        var greenworks = require('./greenworks')
        greenworks.saveFilesToCloud([nwDir], function () {
          console.log('success saving to cloud')
        }, function (error) { console.log('error saving to cloud: ' + error) })
      })
    }.bind(this))
    this.tb.bg.y = 0
    this.uploadButtons.show()
    this.uploadButtons.select(1)
    this.textInput.focus()
    this.inputImage.visible = true
    this.textInput.selectText()
  },

  confirmUpload: function () {
     // Steam only alows files with titles up to 128 chars to be uploaded to the workshop
    this.textInput.value(this.textInput.value().substring(0, 128))
    var greenworks = require('./greenworks')
    greenworks.saveTextToFile('customLevel', this.generateFile(), function () {
      console.log('success save')
      greenworks.fileShare('customLevel', function () {
        console.log('success share')
        var path = require('path')
        var process = require('process')
        var nwPath = process.execPath
        var nwDir = path.dirname(nwPath)
        console.log(nwDir + '\\tempScreenshot.png')
        greenworks.publishWorkshopFile('customLevel', 'tempScreenshot.png', this.textInput.value(), '', function () {
          console.log('success publish')
        }, function (error) { console.log('error publishing: ' + error) })
      }.bind(this), function (error) { console.log('error sharing: ' + error) })
    }.bind(this), function (error) { console.log('error saving: ' + error) })
  },

  confirm: function () {
    if (this.open) {
      this.open = false
      this.newPage = true
      this.confirm()
      var open = require('nw-open-file')
      open(function (fileName) {
        var fs = require('fs')
        fs.readFile(fileName, 'utf8', function (error, data) {
          if (error) console.log('error reading file: ' + error)
          this.levelArray = data.split('').map(function (val) {
            var retVal = parseInt(val, 36)
            if (isNaN(retVal)) {
              retVal = val
            }
            return retVal
          })
          this.loadFromArray()
        }.bind(this))
      }.bind(this))
    } else if (this.newPage) {
      this.newPage = false
      this.state.restart(true, false, this.mode)
    } else if (this.exit) {
      this.exit = false
      this.state.start('Menu')
    }
    this.cancel()
  },

  loadFromArray: function () {
    for (var x = 0; x < this.mapW; x++) {
      for (var y = 0; y < this.mapH; y++) {
        var index = x * this.mapH + y
        var val = this.levelArray[index]
        if (val === this.values.wall) this.map.putTile(0, x, y) // load walls
        else if (val === this.values.start) this.createStart(x, y)
        else if (val > this.values.wall) { // load points
          this.pointPositions[val - 1] = index
          this.levelArray[index] = 2
          this.createPoint(x, y, val - 1)
        }
      }
    }
  }
}
