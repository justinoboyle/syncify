const SpotifyWebHelper = require("spotify-web-helper")

module.exports = class SpotifyListener {

  constructor() {
    this.helper = SpotifyWebHelper()
    this.ready = false
  }

  onError(d) {
    helper.player.on("error", d || (() => {}))
    return this;
  }

  init() {
    return new Promise(resolve => this.helper.player.on("ready", r => { resolve(this); this.ready = true }))
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
        this.helper.player.seekTo(data)
      case "status-will-change": {
        if(this.helper.status.track.track_resource.uri !== data.track.track_resource.uri) {
          this.helper.player.play(data.track.track_resource.uri)
          this.helper.player.seekTo(data.playing_position)
        }

        if(this.helper.status.playing !== data.playing) {
          if(data.playing)
            this.helper.play()
          else
            this.helper.pause()
          this.helper.player.seekTo(data.playing_position)
        }
      }
        
    }
  }
}