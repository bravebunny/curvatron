/*eslint-disable*/
/* global setScreenFixed, baseW, baseH, Phaser, colorHexDark, Blob, saveAs,
ButtonList, h2, w2, Adventure, numberPlayers:true, CanvasInput, nonSteam,
openFile, Rotator, Vertical, Horizontal */
/*eslint-enable*/
var editor = function (game) {
  this.game = game
  this.layer = null
  this.marker = null
  this.map = null
  this.tb = {}
  this.prevCursorX = -1
  this.prevCursorY = -1
  this.lastStartPosition = null
  this.confirmButtons = null
  this.open = false
  this.newPage = false
  this.exit = false
  this.dialogText = null
  this.returning = false
  this.fileName = null
  this.levelArray = []
  this.maxPoints = 26
  this.maxObs = 10000
  this.textInput = null
  this.fileHandle = null
  this.justUploaded = false
  this.cursorObj = null
  this.edited = false
  this.defaults = {
    mapW: 60,
    mapH: 34,
    length: 60 * 34
  }

  // reserved values in the level file
  // the remaining ones can be used for the points
  this.values = {
    start: 35,
    rotator: 34,
    horizontal: 33,
    vertical: 32,
    horizontalDoor: 31,
    verticalDoor: 30,
    checkpoint: 29,
    wall: 1,
    empty: 0
  }
}

editor.prototype = {
  init: function (returning, scale) {
    this.returning = returning
    if (scale) this.scale = scale
    else this.scale = 1
  },

  create: function () {
    setScreenFixed(baseW, baseH + 200, this.game)
    savedCheckpoint = {}
    // variables that need to be reset
    this.tool = 'draw' // draw, erase, point, start
    this.selectedPoint = 1
    this.selectedObs = 1
    this.selectedCheck = 1
    this.points = []
    this.obstacles = []
    this.checkpoints = []
    this.pointPositions = []
    this.obsPositions = []
    this.checkPositions = []
    this.tileSize = 32
    this.mapW = this.defaults.mapW * this.scale
    this.mapH = this.defaults.mapH * this.scale
    this.mouseWasDown = false
    this.changeScale = false
    this.obsType = this.values.vertical
    this.placedPoint = false
    this.placedObs = false
    this.placedCheck = false
    if (!this.returning) this.edited = false

    // change outer background color
    document.body.style.background = colorHexDark

    this.obstacleGroup = this.game.add.group()
    this.lastPoint = null

    this.map = this.game.add.tilemap()
    this.map.addTilesetImage('block')
    this.layer = this.map.create('obstacles', this.mapW, this.mapH, this.tileSize, this.tileSize)
    this.layer.scale.set(1 / this.scale)
    this.layer.resize(baseW * this.scale, baseW * this.scale)
    this.layer.resizeWorld()

    // the square that shows under the mouse to show what's selected
    this.marker = this.game.add.graphics()
    this.marker.lineStyle(2, 0xFFFFFF, 1)
    this.marker.drawRect(0, 0, this.tileSize, this.tileSize)
    this.marker.lineStyle(2, 0x000000, 1)
    this.marker.drawRect(0, 0, this.tileSize - 2, this.tileSize - 2)
    this.marker.scale.set(1 / this.scale)

    // grid overlay
    var gridBMD = this.game.add.bitmapData(this.game.width, this.game.height)
    this.gridImage = gridBMD.addToWorld()
    this.gridImage.alpha = 0.3
    var gridSize = this.tileSize * 3 / this.scale
    this.gridImage.inputEnabled = true
    this.gridImage.events.onInputOver.add(function (button) { this.showTooltip('', button) }.bind(this))

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

    this.start = this.game.add.sprite(w2, h2, 'editorStart')
    this.start.scale.set(1 / this.scale)
    this.start.anchor.set(0.5, 0.1)
    this.start.visible = false
    // this.start.scale.set(0.9)

    // toolbar background
    this.tb.bg = this.game.add.sprite(0, baseH, 'overlay')
    this.tb.bg.width = baseW
    this.tb.bg.height = 2 * h2
    this.tb.bg.alpha = 0.5

    // toolbar icons
    this.tb.draw = this.game.add.button(100, baseH + 100, 'editorDraw', this.drawTool, this)
    this.tb.draw.anchor.set(0.5, 0.5)
    this.tb.draw.scale.set(0.4)
    this.tb.draw.events.onInputOver.add(function (button) { this.showTooltip('draw blocks', button) }.bind(this))

    this.tb.erase = this.game.add.button(250, baseH + 100, 'editorErase', this.eraseTool, this)
    this.tb.erase.anchor.set(0.5, 0.5)
    this.tb.erase.scale.set(0.4)
    this.tb.erase.events.onInputOver.add(function (button) { this.showTooltip('eraser', button) }.bind(this))

    this.tb.left = this.game.add.button(370, baseH + 100, 'editorArrow', this.pointDec, this)
    this.tb.left.anchor.set(0.5, 0.5)
    this.tb.left.scale.set(-0.4, 0.4)

    this.tb.point = this.game.add.button(460, baseH + 100, 'editorPoint', this.pointTool, this)
    this.tb.point.anchor.set(0.5)
    this.tb.point.scale.set(0.4)
    this.tb.point.events.onInputOver.add(function (button) { this.showTooltip('point', button) }.bind(this))

    this.tb.pointText = this.game.add.text(this.tb.point.x, this.tb.point.y, this.selectedPoint, {
      font: '60px dosis',
      fill: colorHexDark,
      align: 'center'
    })
    this.tb.pointText.anchor.set(0.5)

    this.tb.right = this.game.add.button(550, baseH + 100, 'editorArrow', this.pointInc, this)
    this.tb.right.anchor.set(0.5, 0.5)
    this.tb.right.scale.set(0.4)

    this.tb.leftCheck = this.game.add.button(650, baseH + 100, 'editorArrow', this.checkDec, this)
    this.tb.leftCheck.anchor.set(0.5, 0.5)
    this.tb.leftCheck.scale.set(-0.4, 0.4)

    this.tb.checkpoint = this.game.add.button(740, baseH + 100, 'editorStart', this.checkpointTool, this)
    this.tb.checkpoint.anchor.set(0.5, 0.5)
    this.tb.checkpoint.scale.set(0.6)
    this.tb.checkpoint.events.onInputOver.add(function (button) { this.showTooltip('checkpoints', button) }.bind(this))

    this.tb.checkText = this.game.add.text(this.tb.checkpoint.x - 90, this.tb.checkpoint.y + 70, this.selectedCheck, {
      font: '60px dosis',
      fill: '#FFFFFF',
      align: 'center'
    })
    this.tb.checkText.anchor.set(0.5)

    this.tb.rightCheck = this.game.add.button(830, baseH + 100, 'editorArrow', this.checkInc, this)
    this.tb.rightCheck.anchor.set(0.5, 0.5)
    this.tb.rightCheck.scale.set(0.4)

    this.tb.leftObs = this.game.add.button(930, baseH + 100, 'editorArrow', this.obsDec, this)
    this.tb.leftObs.anchor.set(0.5, 0.5)
    this.tb.leftObs.scale.set(-0.4, 0.4)

    this.tb.obstacle = this.game.add.button(1020, baseH + 100, 'vertical_button', this.obstacleTool, this)
    this.tb.obstacle.anchor.set(0.5)
    this.tb.obstacle.events.onInputOver.add(this.showObstacles, this)
    this.tb.obstacle.events.onInputOver.add(function (button) { this.showTooltip('moving obstacles', button) }.bind(this))

    this.tb.obsText = this.game.add.text(this.tb.obstacle.x - 90, this.tb.obstacle.y + 70, this.selectedObs, {
      font: '60px dosis',
      fill: '#FFFFFF',
      align: 'center'
    })
    this.tb.obsText.anchor.set(0.5)

    this.tb.obsMenu = this.game.add.sprite(this.tb.obstacle.x, baseH, 'overlay')
    this.tb.obsMenu.width = 200
    this.tb.obsMenu.height = 800
    this.tb.obsMenu.alpha = 0.5
    this.tb.obsMenu.visible = false
    this.tb.obsMenu.anchor.set(0.5, 1)
    this.tb.obsMenu.inputEnabled = true

    this.tb.obs = {}

    this.tb.obs.vertical = this.game.add.button(1020, baseH - 100, 'vertical_button', this.verticalTool, this)
    this.tb.obs.vertical.anchor.set(0.5)
    this.tb.obs.vertical.visible = false
    this.tb.obs.vertical.events.onInputOver.add(function (button) { this.showTooltip('vertical wall', button) }.bind(this))

    this.tb.obs.horizontal = this.game.add.button(1020, baseH - 250, 'horizontal_button', this.horizontalTool, this)
    this.tb.obs.horizontal.anchor.set(0.5)
    this.tb.obs.horizontal.visible = false
    this.tb.obs.horizontal.events.onInputOver.add(function (button) { this.showTooltip('horizontal wall', button) }.bind(this))

    this.tb.obs.rotator = this.game.add.button(1020, baseH - 400, 'rotator_button', this.rotatorTool, this)
    this.tb.obs.rotator.anchor.set(0.5)
    this.tb.obs.rotator.visible = false
    this.tb.obs.rotator.events.onInputOver.add(function (button) { this.showTooltip('rotating block', button) }.bind(this))

    this.tb.obs.verticalDoor = this.game.add.button(1020, baseH - 550, 'verticalDoor_button', this.verticalDoorTool, this)
    this.tb.obs.verticalDoor.anchor.set(0.5)
    this.tb.obs.verticalDoor.visible = false
    this.tb.obs.verticalDoor.events.onInputOver.add(function (button) { this.showTooltip('vertical door', button) }.bind(this))

    this.tb.obs.horizontalDoor = this.game.add.button(1020, baseH - 700, 'horizontalDoor_button', this.horizontalDoorTool, this)
    this.tb.obs.horizontalDoor.anchor.set(0.5)
    this.tb.obs.horizontalDoor.visible = false
    this.tb.obs.horizontalDoor.events.onInputOver.add(function (button) { this.showTooltip('horizontal door', button) }.bind(this))

    this.tb.rightObs = this.game.add.button(1110, baseH + 100, 'editorArrow', this.obsInc, this)
    this.tb.rightObs.anchor.set(0.5, 0.5)
    this.tb.rightObs.scale.set(0.4)

    this.tb.test = this.game.add.button(1500, baseH + 100, 'resume_button', this.test, this)
    this.tb.test.anchor.setTo(0.5, 0.5)
    this.tb.test.scale.set(0.8)
    this.tb.test.events.onInputOver.add(function (button) { this.showTooltip('test level', button) }.bind(this))

    this.tb.scale = this.game.add.button(1650, baseH + 100, 'fullscreen_button', this.auxChangeScale, this)
    this.tb.scale.anchor.setTo(0.5, 0.5)
    this.tb.scale.scale.set(0.8)
    this.tb.scale.events.onInputOver.add(function (button) { this.showTooltip('change level scale', button) }.bind(this))

    this.tb.scaleText = this.game.add.text(this.tb.scale.x, this.tb.scale.y, (this.scale - 1) * 2 + 1, {
      font: '40px dosis',
      fill: '#FFFFFF',
      align: 'center'
    })
    this.tb.scaleText.anchor.set(0.5)

    this.tb.menu = this.game.add.button(1800, baseH + 100, 'menu_button', this.menu, this)
    this.tb.menu.anchor.setTo(0.5, 0.5)
    this.tb.menu.scale.set(0.8)
    this.tb.menu.events.onInputOver.add(function (button) { this.showTooltip('open menu', button) }.bind(this))

    // square that shows the selected tool
    this.selector = this.game.add.graphics()
    this.selector.lineStyle(5, 0xFFFFFF, 1)
    this.selector.drawRect(-60, -60, 120, 120)
    this.selector.alpha = 0.9

    this.cursorPoint = this.game.add.sprite(0, 0, 'point')
    this.cursorPoint.alpha = 0.5
    this.cursorPoint.anchor.set(0.5)
    this.cursorPoint.scale.set(0.7 / this.scale)
    this.cursorPoint.visible = false

    var cursorVertDoor = new Vertical(this.game, 0, 0)
    cursorVertDoor.isDoor = true
    var cursorHorDoor = new Horizontal(this.game, 0, 0)
    cursorHorDoor.isDoor = true
    var cursorVert = new Vertical(this.game, 0, 0)
    var cursorHor = new Horizontal(this.game, 0, 0)
    var cursorRot = new Rotator(this.game, 0, 0)
    this.cursorObs = {
      30: cursorVertDoor,
      31: cursorHorDoor,
      32: cursorVert,
      33: cursorHor,
      34: cursorRot
    }
    for (i = 30; i < 35; i++) {
      this.cursorObs[i].create()
      this.cursorObs[i].stop()
      this.cursorObs[i].hide()
      this.cursorObs[i].setScale(1 / this.scale)
      this.cursorObs[i].setAlpha(0.3)
    }

    this.cursorCheck = this.game.add.sprite(0, 0, 'editorStart')
    this.cursorCheck.scale.set(1 / this.scale)
    this.cursorCheck.anchor.set(0.5, 0.1)
    this.cursorCheck.alpha = 0.5
    this.cursorCheck.visible = false

    this.menuButtons = new ButtonList(this, this.game)
    this.menuButtons.add('back_button', 'cancel', this.backPressed)
    this.menuButtons.add('editorOpen', 'import level', this.auxOpen)
    this.menuButtons.add('editorsave', 'save to computer', this.save)
    var uploadButton = this.menuButtons.add('upload_button', 'upload to workshop', this.upload)
    if (nonSteam) uploadButton.disable()
    this.menuButtons.add('editorNewPage', 'clear level', this.auxNewPage)
    this.menuButtons.add('editorExit', 'exit to menu', this.auxExit)
    this.menuButtons.setY(150)
    this.menuButtons.textColor = colorHexDark
    this.menuButtons.create()
    this.menuButtons.hide()

    this.uploadButtons = new ButtonList(this, this.game)
    this.confirmUploadButton = this.uploadButtons.add('upload_button', 'upload', this.confirmUpload)
    this.cancelUploadButton = this.uploadButtons.add('cancel_button', 'cancel', this.cancel)
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
      padding: 10
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

    this.uploadText = this.add.text(w2, 550, '', {
      font: '80px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.uploadText.anchor.setTo(0.5, 0.5)
    this.uploadText.visible = false

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

    this.game.input.onUp.add(this.releaseMouse, this)

    this.game.input.onDown.add(function (e) {
      if (this.game.input.activePointer.button === Phaser.Mouse.RIGHT_BUTTON) {
        var x = this.layer.getTileX(this.game.input.activePointer.worldX * this.scale)
        var y = this.layer.getTileY(this.game.input.activePointer.worldY * this.scale)
        this.selectByTile(x, y)
      }
    }.bind(this))

    // Select last objects in all tools
    this.pointDec()
    this.obsDec()
    this.checkDec()

    // bugs out
    /*var startX = this.mapW/2
    var startY = this.mapH/2 - 4
    this.levelArray[startX * this.mapH + startY] = this.values.start
    this.createStart(startX, startY)*/
  },

  update: function () {
    var pointerX = this.game.input.activePointer.worldX
    var pointerY = this.game.input.activePointer.worldY

    var obs = this.tb.obsMenu

    if (this.tb.obsMenu.visible && (pointerX < obs.x - obs.width / 2 ||
    pointerX > obs.x + obs.width / 2 ||
    pointerY < baseH - obs.height)) {
      this.hideObstacles()
    }

    if (this.selectedCheck > 1 && !this.tb.checkpoint.cp) {
      this.tb.checkpoint.loadTexture('editorCheckpoint')
      this.cursorCheck.loadTexture('editorCheckpoint')
      this.tb.checkpoint.cp = true
    } else if (this.selectedCheck === 1 && this.tb.checkpoint.cp) {
      this.tb.checkpoint.loadTexture('editorStart')
      this.cursorCheck.loadTexture('editorStart')
      this.tb.checkpoint.cp = false
    }

    for (var i = 0; i < this.points.length; i++) {
      var point = this.points[i]
      if (point) {
        if (i === this.selectedPoint) {
          point.alpha = 0.5
          point.scale.set(0.7 / this.scale)
        } else {
          point.alpha = 1
          point.scale.set(0.5 / this.scale)
        }
      }
    }

    for (var e = 1; e < this.obstacles.length; e++) {
      var obstacle = this.obstacles[e]
      if (obstacle) {
        if (e === this.selectedObs) obstacle.setAlpha(0.3)
        else obstacle.setAlpha(1)
      }
    }

    if (this.selectedCheck === 1) this.start.alpha = 0.5
    else this.start.alpha = 1

    for (e = 2; e < this.checkpoints.length; e++) {
      var c = this.checkpoints[e]
      if (c) {
        if (e === this.selectedCheck) c.alpha = 0.5
        else c.alpha = 1
      }
    }

    // reset visibility of cursor objects
    this.cursorCheck.visible = false
    this.cursorPoint.visible = false
    this.marker.visible = false
    this.cursorObs[this.values.vertical].hide()
    this.cursorObs[this.values.horizontal].hide()
    this.cursorObs[this.values.rotator].hide()
    this.cursorObs[this.values.horizontalDoor].hide()
    this.cursorObs[this.values.verticalDoor].hide()

    // square around selected tool in toolbar
    var tool = this.tool
    this.selector.x = this.tb[tool].x
    this.selector.y = this.tb[tool].y

    if (pointerY < this.tb.bg.y && !this.tb.obsMenu.visible) {
      // cursor square to mark drawing position
      this.marker.x = this.layer.getTileX(pointerX * this.scale) * this.tileSize / this.scale
      this.marker.y = this.layer.getTileY(pointerY * this.scale) * this.tileSize / this.scale

      var x = this.marker.x * this.scale + this.tileSize / 2
      var y = this.marker.y * this.scale + this.tileSize / 2
      var tileX = this.layer.getTileX(x)
      var tileY = this.layer.getTileY(y)

      var shiftDown = this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)

      if (!this.mouseWasDown && !shiftDown) {
        this.prevCursorX = tileX
        this.prevCursorY = tileY
      }

      if (this.game.input.mousePointer.isDown && this.game.input.activePointer.button === Phaser.Mouse.LEFT_BUTTON) {
        this.mouseWasDown = true
        var line = new Phaser.Line(this.prevCursorX, this.prevCursorY, tileX, tileY)
        if (shiftDown && this.prevCursorX === -1) {
          line = new Phaser.Line(tileX, tileY, tileX, tileY)
        } 
        var linePoints = line.coordinatesOnLine()

        if (!shiftDown || this.prevCursorX === -1) {
          this.prevCursorX = tileX
          this.prevCursorY = tileY
        }

        for (i = 0; i < linePoints.length; i++) {
          var lineX = linePoints[i][0]
          var lineY = linePoints[i][1]
          var index = lineX * this.mapH + lineY

          switch (this.tool) {
            case 'draw':
              this.edited = true
              this.marker.visible = true
              if (this.levelArray[index] === this.values.empty) {
                this.map.putTile(0, lineX, lineY)
                this.levelArray[index] = this.values.wall
              }
              break

            case 'erase':
              var val = this.levelArray[index]
              this.marker.visible = true
              if (this.map.getTile(lineX, lineY) != null) {
                this.map.removeTile(lineX, lineY)
              }

              if (val === 2) { // point
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
              } else if (val === this.values.checkpoint) { // checkpoint
                var checkN = this.checkPositions.indexOf(index)
                this.checkpoints[checkN].destroy()
                for (var c = checkN; c < this.checkpoints.length - 1; c++) {
                  this.checkPositions[c] = this.checkPositions[c + 1]
                  this.checkpoints[c] = this.checkpoints[c + 1]
                }
                this.checkpoints = this.checkpoints.slice(0, -1)
                this.checkPositions = this.checkPositions.slice(0, -1)
                if (this.selectedCheck >= checkN) {
                  this.checkDec()
                }
              } else if (val === this.values.start) {

              } else if (val > 29) { // obstacle
                var obsN = this.obsPositions.indexOf(index)
                this.obstacles[obsN].destroy()
                for (var o = obsN; o < this.obstacles.length - 1; o++) {
                  this.obsPositions[o] = this.obsPositions[o + 1]
                  this.obstacles[o] = this.obstacles[o + 1]
                }
                this.obstacles = this.obstacles.slice(0, -1)
                this.obsPositions = this.obsPositions.slice(0, -1)
                if (this.selectedObs >= obsN) {
                  this.obsDec()
                }
              }

              if (this.levelArray[index] !== this.values.start) {
                this.levelArray[index] = this.values.empty
              }
              break

            case 'point':
              this.edited = true
              if (this.levelArray[index] === this.values.empty) {
                this.createPoint(tileX, tileY, this.selectedPoint)
                // value is set as 2 temporarily, will be replaced later
                this.levelArray[index] = 2
                this.pointPositions[this.selectedPoint] = index
              }
              break

            case 'obstacle':
              this.edited = true
              if (this.levelArray[index] === this.values.empty) {
                this.createObstacle(tileX, tileY, this.obsType, this.selectedObs)
                this.levelArray[index] = this.obsType
                this.obsPositions[this.selectedObs] = index
              }
              break

            case 'checkpoint':
              this.edited = true
              if (this.levelArray[index] === this.values.empty) {
                if (this.selectedCheck > 1) {
                  this.createCheckpoint(tileX, tileY, this.selectedCheck)
                  this.levelArray[index] = this.values.checkpoint
                  this.checkPositions[this.selectedCheck] = index
                } else {
                  this.levelArray[tileX * this.mapH + tileY] = this.values.start
                  this.createStart(tileX, tileY)
                }
              }
          }
        }
      } else {
        if (!shiftDown) {
          this.prevCursorX = -1
          this.prevCursorY = -1
          this.mouseWasDown = false
        }
        if (shiftDown && this.mouseWasDown) {
          this.prevCursorX = tileX
          this.prevCursorY = tileY
          this.mouseWasDown = false
        }

        var curX = this.marker.x + (this.tileSize / 2) / this.scale
        var curY = this.marker.y + (this.tileSize / 2) / this.scale
        switch (this.tool) {
          case 'checkpoint':
            this.cursorCheck.visible = true
            this.cursorCheck.position.set(curX, curY)
            break
          case 'draw':
          case 'erase':
            this.marker.visible = true
            break
          case 'point':
            this.cursorPoint.visible = true
            this.cursorPoint.position.set(curX, curY)
            break
          case 'obstacle':
            this.cursorObs[this.obsType].setPosition(curX, curY)
            this.cursorObs[this.obsType].show()
        }
      }
    }

    this.confirmButtons.update()
    this.uploadButtons.update()
    this.menuButtons.update()
  },

  showTooltip: function (name, button) {
    // tool titles
    this.tooltip.position.set(button.x, baseH + 20)
    this.tooltip.setText(name)
    this.tooltip.visible = true
  },

  createPoint: function (tileX, tileY, i) {
    var x = (tileX * this.tileSize + this.tileSize / 2) / this.scale
    var y = (tileY * this.tileSize + this.tileSize / 2) / this.scale
    if (this.points[i] == null) {
      this.placedPoint = true
      this.points[i] = this.game.add.sprite(x, y, 'point')
      this.game.world.sendToBack(this.points[i])
      this.points[i].anchor.set(0.5)
    } else {
      this.levelArray[this.pointPositions[i]] = 0
      this.points[i].position.set(x, y)
    }
  },

  createObstacle: function (tileX, tileY, type, i) {
    var x = (tileX * this.tileSize + this.tileSize / 2) / this.scale
    var y = (tileY * this.tileSize + this.tileSize / 2) / this.scale
    var obs = this.obstacles[i]
    if (i > this.obstacles.length - 1) {
      this.placedObs = true
      obs = this.createObstacleObj(type, x, y)
      obs.sendToBack()
      obs.type = type
      this.obstacles[i] = obs
    } else {
      this.levelArray[this.obsPositions[i]] = 0
      if (obs.type !== type) {
        obs.destroy()
        obs = this.createObstacleObj(type, x, y)
        obs.sendToBack()
        obs.type = type
        this.obstacles[i] = obs
      }
      obs.setPosition(x, y)
    }
  },

  createObstacleObj: function (val, x, y) {
    var obs = null
    var isDoor = false
    switch (val) {
      case this.values.verticalDoor:
        isDoor = true
      case this.values.vertical:
        obs = new Vertical(this.game, x, y)
        break
      case this.values.horizontalDoor:
        isDoor = true
      case this.values.horizontal:
        obs = new Horizontal(this.game, x, y)
        break
      case this.values.rotator:
        obs = new Rotator(this.game, x, y)
        break
    }
    obs.isDoor = isDoor
    obs.create()
    obs.stop()
    obs.setScale(1 / this.scale)
    return obs
  },

  createStart: function (x, y) {
    if (this.checkpoints.length < 2) this.placedCheck = true
    var tileX = (x * this.tileSize + this.tileSize / 2) / this.scale
    var tileY = (y * this.tileSize + this.tileSize / 2) / this.scale
    if (!this.start.visible) this.start.visible = true
    this.start.position.set(tileX, tileY)
    var lp = this.lastStartPosition
    var index = x * this.mapH + y
    if (lp !== null && lp !== index) this.levelArray[lp] = 0
    this.lastStartPosition = x * this.mapH + y
    this.checkpoints[1] = this.start
  },

  createCheckpoint: function (tileX, tileY, i) {
    var x = (tileX * this.tileSize + this.tileSize / 2) / this.scale
    var y = (tileY * this.tileSize + this.tileSize / 2) / this.scale
    var check = this.checkpoints[i]
    if (check == null) {
      this.placedCheck = true
      check = this.game.add.sprite(x, y, 'editorCheckpoint')
      check.scale.set(1 / this.scale)
      check.anchor.set(0.5, 0.1)
      this.game.world.sendToBack(check)
      this.checkpoints[i] = check
    } else {
      this.levelArray[this.checkPositions[i]] = 0
      check.position.set(x, y)
    }
  },

  checkpointTool: function () {
    this.tool = 'checkpoint'
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

  obstacleTool: function () {
    this.tool = 'obstacle'
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

  selectPoint: function (index) {
    this.selectedPoint = index
    this.tb.pointText.text = this.selectedPoint
  },

  checkDec: function () {
    if (this.selectedCheck > 1) {
      this.selectedCheck--
    } else if (this.checkpoints.length > 0) {
      this.selectedCheck = this.checkpoints.length
    }
    this.tb.checkText.text = this.selectedCheck
  },

  checkInc: function () {
    if (this.selectedCheck < this.checkpoints.length) {
      this.selectedCheck++
    } else {
      this.selectedCheck = 1
    }
    this.tb.checkText.text = this.selectedCheck
  },

  selectObs: function (index) {
    this.selectedObs = index
    this.tb.obsText.text = this.selectedObs
  },

  selectCheck: function (index) {
    this.selectedCheck = index
    this.tb.checkText.text = this.selectedCheck
  },

  obsDec: function () {
    if (this.selectedObs > 1) {
      this.selectedObs--
    } else if (this.obstacles.length > 0) {
      this.selectedObs = this.obstacles.length
    }
    this.tb.obsText.text = this.selectedObs
  },

  obsInc: function () {
    if (this.selectedObs < this.obstacles.length) {
      this.selectedObs++
    } else {
      this.selectedObs = 1
    }
    this.tb.obsText.text = this.selectedObs
  },

  showObstacles: function () {
    if (!this.menuButtons.visible) {
      this.tb.obsMenu.visible = true
      this.tb.obs.vertical.visible = true
      this.tb.obs.horizontal.visible = true
      this.tb.obs.rotator.visible = true
      this.tb.obs.verticalDoor.visible = true
      this.tb.obs.horizontalDoor.visible = true
    }
  },

  hideObstacles: function () {
    this.tb.obsMenu.visible = false
    this.tb.obs.vertical.visible = false
    this.tb.obs.horizontal.visible = false
    this.tb.obs.rotator.visible = false
    this.tb.obs.verticalDoor.visible = false
    this.tb.obs.horizontalDoor.visible = false
  },

  verticalTool: function () {
    this.obstacleTool()
    this.obsType = this.values.vertical
    this.tb.obstacle.loadTexture('vertical_button')
  },

  horizontalTool: function () {
    this.obstacleTool()
    this.obsType = this.values.horizontal
    this.tb.obstacle.loadTexture('horizontal_button')
  },

  verticalDoorTool: function () {
    this.obstacleTool()
    this.obsType = this.values.verticalDoor
    this.tb.obstacle.loadTexture('vertical_button')
  },

  horizontalDoorTool: function () {
    this.obstacleTool()
    this.obsType = this.values.horizontalDoor
    this.tb.obstacle.loadTexture('horizontal_button')
  },

  rotatorTool: function () {
    this.obstacleTool()
    this.obsType = this.values.rotator
    this.tb.obstacle.loadTexture('rotator_button')
  },

  backPressed: function () {
    if (this.tb.bg.y === 0) { // true if confirmation menu is open
      this.cancel()
    } else {
      this.menu()
    }
  },

  left: function () {
    if (this.tool === 'point') this.pointDec()
    else if (this.tool === 'obstacle') this.obsDec()
    else if (this.tool === 'checkpoint') this.checkDec()
  },

  right: function () {
    if (this.tool === 'point') this.pointInc()
    else if (this.tool === 'obstacle') this.obsInc()
    else if (this.tool === 'checkpoint') this.checkInc()
  },

  up: function () {
    this.confirmButtons.selectUp()
    this.menuButtons.selectUp()
  },

  down: function () {
    this.confirmButtons.selectDown()
    this.menuButtons.selectDown()
  },

  selectPress: function () {
    this.confirmButtons.selectPress()
    this.menuButtons.selectPress()
  },

  selectRelease: function () {
    this.confirmButtons.selectRelease()
    this.menuButtons.selectRelease()
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

  auxChangeScale: function () {
    if (this.uploadText.text !== 'uploading...') {
      this.changeScale = true
      this.newPage = true
      if (this.edited) this.showDialog('current level will be deleted. change scale?')
      else this.confirm()
    }
  },

  auxNewPage: function () {
    if (this.uploadText.text !== 'uploading...') {
      this.newPage = true
      this.showDialog('all unsaved progress will be lost. clear screen?')
    }
  },

  auxExit: function () {
    if (this.uploadText.text !== 'uploading...') {
      this.exit = true
      if (this.edited) this.showDialog('all unsaved progress will be lost. exit?')
      else this.confirm()
    }
  },

  auxOpen: function () {
    if (this.uploadText.text !== 'uploading...') {
      this.open = true
      if (this.edited) this.showDialog('all unsaved progress will be lost. clear screen?')
      else this.confirm()
    }
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

  menu: function () {
    this.tb.bg.y = 0
    this.menuButtons.show()
    this.menuButtons.select(0)
  },

  showDialog: function (text) {
    this.menuButtons.hide()
    this.dialogText.text = text
    this.dialogText.visible = true
    this.tb.bg.y = 0
    this.confirmButtons.show()
    this.confirmButtons.select(1)
  },

  cancel: function () {
    this.game.input.keyboard.enabled = true
    if (this.uploadText.text !== 'uploading...') {
      this.open = false
      this.newPage = false
      this.changeScale = false
      this.uploadText.visible = false
      this.confirmButtons.hide()
      this.uploadButtons.hide()
      this.dialogText.visible = false
      this.tb.bg.y = baseH
      this.inputImage.visible = false
      this.textInput.selectText()
      this.textInput.blur()
      this.confirmUploadButton.setText('upload')
      this.cancelUploadButton.setText('cancel')
      this.justUploaded = false
      this.menuButtons.hide()
    }
  },

  upload: function () {
    if (!this.uploadButtons.visible) {
      this.menuButtons.hide()
      this.game.input.keyboard.enabled = false
      this.game.canvas.toBlob(function (blob) {
        var fs = require('fs')

        setScreenFixed(baseW, baseH, this.game)
        this.gridImage.visible = false
        this.marker.visible = false
        this.tb.bg.visible = false
        this.game.updateRender()

        var png = this.game.canvas.toDataURL()

        setScreenFixed(baseW, baseH + 200, this.game)
        this.gridImage.visible = true
        this.marker.visible = true
        this.uploadButtons.show()
        this.uploadButtons.disable()
        this.tb.bg.visible = true

        png = png.replace(/^data:image\/png;base64,/, '')

        var path = require('path')
        var process = require('process')
        var nwPath = process.execPath
        var nwDir = path.dirname(nwPath) + '\\saves\\tempScreenshot.png'

        fs.writeFile('saves/tempScreenshot.png', png, 'base64', function (error) {
          if (error) {
            this.uploadText.text = 'connection error!'
            console.log('error writing file: ' + error)
          }
          console.log('screenshot save success')
          var greenworks = require('./greenworks')
          greenworks.saveFilesToCloud([nwDir], function (error) {
            if (error) {
              this.uploadText.text = 'connection error!'
              this.uploadText.visible = true
            }
            console.log('success saving screenshot to cloud')
            this.uploadButtons.enable()
            this.tb.bg.y = 0
            this.uploadButtons.select(1)
            this.textInput.focus()
            this.inputImage.visible = true
            this.textInput.selectText()
          }.bind(this), function (error) { console.log('error saving to cloud: ' + error) })
        }.bind(this))
      }.bind(this))
    }
  },

  confirmUpload: function () {
    this.game.input.keyboard.enabled = true
    var greenworks = require('./greenworks')
    if (this.justUploaded) {
      greenworks.ugcShowOverlay(this.fileHandle)
      this.backPressed()
    } else {
      this.uploadButtons.disable()
      this.uploadText.text = 'uploading...'
      this.uploadText.visible = true
       // Steam only alows files with titles up to 128 chars to be uploaded to the workshop
      this.textInput.value(this.textInput.value().substring(0, 128))
      greenworks.saveTextToFile('customLevel', this.generateFile(), function () {
        console.log('success save')
        greenworks.fileShare('customLevel', function () {
          console.log('success share')
          var path = require('path')
          var process = require('process')
          var nwPath = process.execPath
          var nwDir = path.dirname(nwPath)
          console.log(nwDir + '\\tempScreenshot.png')
          greenworks.publishWorkshopFile('customLevel', 'tempScreenshot.png', this.textInput.value(), '', function (fileHandle) {
            this.uploadButtons.enable()
            this.uploadText.text = 'uploaded!'
            this.fileHandle = fileHandle
            this.justUploaded = true
            this.confirmUploadButton.setText('open in workshop')
            this.cancelUploadButton.setText('back')
            console.log('success publish: ' + fileHandle)
          }.bind(this), function (error) {
            console.log('error publishing: ' + error)
            this.uploadButtons.enable()
            this.uploadText.text = 'connection error!'
          }.bind(this))
        }.bind(this), function (error) {
          console.log('error sharing: ' + error)
          this.uploadButtons.enable()
          this.uploadText.text = 'connection error!'
        }.bind(this))
      }.bind(this), function (error) {
        console.log('error saving: ' + error)
        this.uploadButtons.enable()
        this.uploadText.text = 'connection error!'
      }.bind(this))
    }
  },

  confirm: function () {
    if (this.open) {
      this.open = false
      this.newPage = true
      this.confirm()
      openFile(function (fileName) {
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
          var scale = Math.round(Math.sqrt(this.levelArray.length / this.defaults.length) * 10) / 10
          this.state.restart(true, false, true, scale)
        }.bind(this))
      }.bind(this))
    } else if (this.newPage) {
      if (this.changeScale) {
        if (this.scale < 3) this.scale += 0.5
        else this.scale = 1
      }
      this.newPage = false
      this.state.restart(true, false, false, this.scale)
    } else if (this.exit) {
      this.exit = false
      this.state.start('Menu')
    }
    this.cancel()
  },

  loadFromArray: function () {
    var obsCounter = 1
    var checkCounter = 2
    this.obsPositions.push(-1)
    this.checkPositions.push(-1)
    this.checkPositions.push(-1)
    for (var x = 0; x < this.mapW; x++) {
      for (var y = 0; y < this.mapH; y++) {
        var index = x * this.mapH + y
        var val = this.levelArray[index]
        if (val === this.values.wall) this.map.putTile(0, x, y)
        else if (val === this.values.start) this.createStart(x, y)
        else if (val === this.values.checkpoint) {
          this.createCheckpoint(x, y, checkCounter++)
          this.checkPositions.push(index)
        } else if (val === this.values.vertical) {
          this.createObstacle(x, y, val, obsCounter++)
          this.obsPositions.push(index)
        } else if (val === this.values.horizontal) {
          this.createObstacle(x, y, val, obsCounter++)
          this.obsPositions.push(index)
        } else if (val === this.values.verticalDoor) {
          this.createObstacle(x, y, val, obsCounter++)
          this.obsPositions.push(index)
        } else if (val === this.values.horizontalDoor) {
          this.createObstacle(x, y, val, obsCounter++)
          this.obsPositions.push(index)
        } else if (val === this.values.rotator) {
          this.createObstacle(x, y, val, obsCounter++)
          this.obsPositions.push(index)
        } else if (val > this.values.wall) { // load points
          this.pointPositions[val - 1] = index
          this.levelArray[index] = 2
          this.createPoint(x, y, val - 1)
        }
      }
    }
    this.placedPoint = false
    this.placedObs = false
    this.placedCheck = false
  },

  setScreen: function () {
    var game = this.game
    var w = baseW
    var h = baseH
    game.width = w
    game.height = h
    game.canvas.width = w
    game.canvas.height = h
    game.renderer.resize(w, h)
    game.scale.width = w
    game.scale.height = h
    game.camera.setSize(w, h)
    game.scale.refresh()
  },

  releaseMouse: function () {
    if (this.placedPoint) {
      this.pointInc()
      this.placedPoint = false
    } else if (this.placedObs) {
      this.obsInc()
      this.placedObs = false
    } else if (this.placedCheck) {
      this.checkInc()
      this.placedCheck = false
    }
  },

  selectByTile: function (x, y) {
    var index = x * this.mapH + y

    var val = this.levelArray[index]
    if (val === this.values.empty) this.eraseTool()
    else if (val === this.values.wall) this.drawTool()
    else if (val === this.values.horizontal) {
      this.obstacleTool()
      this.horizontalTool()
      this.selectObs(this.obsPositions.indexOf(index))
    } else if (val === this.values.vertical) {
      this.obstacleTool()
      this.verticalTool()
      this.selectObs(this.obsPositions.indexOf(index))
    } else if (val === this.values.horizontalDoor) {
      this.obstacleTool()
      this.horizontalDoorTool()
      this.selectObs(this.obsPositions.indexOf(index))
    } else if (val === this.values.verticalDoor) {
      this.obstacleTool()
      this.verticalDoorTool()
      this.selectObs(this.obsPositions.indexOf(index))
    } else if (val === this.values.rotator) {
      this.obstacleTool()
      this.rotatorTool()
      this.selectObs(this.obsPositions.indexOf(index))
    } else if (val === this.values.checkpoint) {
      this.checkpointTool()
      this.selectCheck(this.checkPositions.indexOf(index))
    } else if (val === this.values.start) {
      this.checkpointTool()
      this.selectCheck(1)
    } else {
      this.pointTool()
      this.selectPoint(this.pointPositions.indexOf(index))
    }
  }
}
