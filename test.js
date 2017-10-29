const SpotifyListener = require("./helpers/SpotifyListener")
const darwinPortFinder = require('./util/darwinPortFinder')

const spotify = new SpotifyListener()

spotify.init().then(() => {
    console.log("INIT")
}).catch(console.error)
