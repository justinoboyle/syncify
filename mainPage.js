"use strict"
console.log(0)
async function f() {
    console.log("f")
  const SpotifyListener = require('./helpers/SpotifyListener')
  console.log("g")
  const spotify = await new SpotifyListener().init()
  console.log("h")
  console.log(1)
  // await wait(30)
  let yourID = ""
  let listeningToSelf = true
  let otherCode = ""
  let socket = new WebSocket("ws://ssh.justinoboyle.com:3083")
  console.log(2)
  socket.addEventListener("open", () => {
    console.log(3)
    global.spotify = spotify
    updateNowPlaying()
    updateButtons(listeningToSelf)
    spotify.addListener((d) => {
      if(listeningToSelf)
      socket.send(JSON.stringify(d))
      updateNowPlaying()
    })
  })
  socket.addEventListener("message", msg => {
    console.log(msg.data)
    let json = JSON.parse(msg.data)
    if(json.yourID)
      return updateYourID(json.yourID)
    if(!listeningToSelf)
    spotify.apply(json)
  })
  function updateYourID(id) {
    yourID = id
    if(listeningToSelf)
    document.getElementsByTagName("listencode")[0].innerText = "Your Code: " + yourID
  }
  window.changeListening = () => {
    listeningToSelf = false
    otherCode = document.getElementsByTagName("input")[0].value
    socket.send(JSON.stringify({changeChannel: otherCode}))
    updateButtons(listeningToSelf)
    updateNowPlaying(listeningToSelf)
  }
  window.stopListening = () => {
    listeningToSelf = true
    otherCode = ""
    socket.send(JSON.stringify({changeChannel: yourID}))
    updateButtons(listeningToSelf)
    updateNowPlaying(listeningToSelf) 
  }
}

f()


function updateButtons(listeningToSelf) {
  let cd = document.getElementsByTagName("cd")[0]
  if(listeningToSelf)
    cd.innerHTML = "Listen in: <input></input> <button onclick='window.changeListening()'>Go</button>"
  else
    cd.innerHTML = "<button onclick='window.stopListening()'>Stop listening</button>"
}

function updateNowPlaying(listeningToSelf) {
  let trackname = "None"
  try {
    trackname = spotify.helper.status.track.artist_resource.name + " - " + spotify.helper.status.track.album_resource.name 
  }catch(e) {}
  if(listeningToSelf)
    trackname = "You're streaming: " + trackname
  else
    trackname = "You're listening to: " + trackname
  document.getElementsByTagName("songname")[0].innerText = trackname
}


