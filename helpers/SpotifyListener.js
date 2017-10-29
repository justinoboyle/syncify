const SpotifyWebHelper = require("spotify-web-helper")
const findPort = require('../findPort')

module.exports = class SpotifyListener {

  constructor() {

  }

  onError(d) {
    helper.player.on("error", d || (() => {}))
    return this;
  }

  init() {
    console.log("fkjdhfk")
    return new Promise((resolve, reject) => {
      findPort().then(port => {
        port += 1
        this.helper = new SpotifyWebHelper({ port })
        console.log(port)
        this.ready = false
        this.helper.player.on("error", r => { reject(r) })
        this.helper.player.on("ready", r => { resolve(this); this.ready = true })
      })

    })
  }

  addListener(listener = (() => {})) {
    ['play', 'pause', 'seek', 'end', 'track-will-change', 'status-will-change']
      .forEach(event => this.helper.player.on(event, (data) => {
        if(data) listener({event, data})
      }
    ))
  }
  
  apply(streamData) {
    const { data, event } = streamData
    switch(event) {
      case "seek": 
        setTimeout(() => {
          this.helper.player.seekTo(data.playing_position)
        }, 20)
      case "status-will-change": {
        if(this.helper.status.track.track_resource.uri !== data.track.track_resource.uri) {
          this.helper.player.play(data.track.track_resource.uri)
          setTimeout(() => {
            this.helper.player.seekTo(data.playing_position)
          }, 50)
          
        }

        if(this.helper.status.playing !== data.playing) {
          if(data.playing)
            this.helper.play()
          else
            this.helper.pause()
            setTimeout(() => {
              this.helper.player.seekTo(data.playing_position)
            }, 10)
        }
      }
        
    }
  }
}