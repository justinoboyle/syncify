const { child } = require('child_process')
module.exports = function(port = 4300) {
    return new Promise((resolve, reject) => {
        const { spawn } = require('child_process')
        const child = spawn('lsof', ['-i', '-n', '-P'])
        child.stdout.on('data', (data) => {
            for(let d of (data + "").split('\n'))
            if(d.includes("SpotifyWe"))
                port = parseInt(d.replace(/ +(?= )/g,'').split(' ')[8].split(':')[1])
          })
        child.on('error', (data) => {
            console.log(data)
        })
        child.on('exit', (code, signal) => {
            resolve(port)
        })
    })
}