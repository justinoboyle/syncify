const darwinPortFinder = require('./util/darwinPortFinder')
const os = require('os')
module.exports = function (lastPort = 4300) {
    return new Promise((resolve, reject) => {
        switch (os.platform()) {
            case "darwin":
                return darwinPortFinder(lastPort).then(resolve).catch(reject)
            default:
                return resolve(lastPort) // start there, cause we have no idea
        }
    })
}