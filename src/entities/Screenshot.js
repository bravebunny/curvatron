/* global saveAs */
var Screenshot = function (game) {
  this.game = game
  this.popup = null
  this.png = null
  this.blob = null
  this.twitter = null
  this.tweetMessage = '#Curvatron'
  this.tweetSuccess = 0
  this.tweeting = false
}

Screenshot.prototype = {
  update: function () {
    if (this.popup !== null && this.popup.location.href &&
      this.popup.location.href.split('oauth_verifier=')[1] !== undefined) {
      this.tweetUpdate()
    }
  },

  snap: function () {
    // redraw screen
    this.game.renderer.render(this.game.stage)

    // png to share on twitter
    var png = this.game.canvas.toDataURL()
    this.png = png.replace(/^data:image\/png;base64,/, '')

    // png to save locally
    this.game.canvas.toBlob(function (blob) {
      this.blob = blob
    }.bind(this))
  },

  save: function () {
    saveAs(this.blob, 'curvatron.png')
  },

  share: function () {
    this.tweeting = true
    var TwitterAPI = require('node-twitter-api')
    this.twitter = new TwitterAPI({
      consumerKey: 'NwssUgdW5A1dKhtzExUFc5AtQ',
      consumerSecret: 'S4yhhvUDPKAEI4Wqwx9TCqLaQgsdcB8FjhPG6GyMLVK1xzgqeV',
      callback: 'http://bravebunny.co/'
    })

    this.twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
      if (error) {
        this.tweetSuccess = -1
      } else {
        this.rToken = requestToken
        this.rTokenSecret = requestTokenSecret
        this.popup = window.open(this.twitter.getAuthUrl(this.rToken))
      }
    }.bind(this))
  },

  tweetUpdate: function () {
    var oauthVerifier = this.popup.location.href.split('oauth_verifier=')[1]
    this.popup.close()
    this.popup = null

    var aToken, aTokenSecret

    this.twitter.getAccessToken(this.rToken, this.rTokenSecret, oauthVerifier, function (error, accessToken, accessTokenSecret, results) {
      if (error) {
        this.tweetSuccess = -1
      } else {
        aToken = accessToken
        aTokenSecret = accessTokenSecret

        var params = {
          media: this.png,
          isBase64: true
        }

        this.twitter.uploadMedia(params, aToken, aTokenSecret, function (error, response) {
          if (error) this.tweetSuccess = -1
          else {
            this.twitter.statuses('update', {
              status: this.tweetMessage,
              media_ids: response.media_id_string
            },
              aToken,
              aTokenSecret,
              function (error, data, response) {
                if (error) this.tweetSuccess = -1
                this.tweetSuccess = 1
              }.bind(this)
            )
          }
        }.bind(this))
      }
    }.bind(this))
  }

}
