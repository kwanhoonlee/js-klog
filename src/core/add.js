const IPFS = require("ipfs")
const ipfs = new IPFS()

ipfs.on('ready', async() => {
    var hash = ipfs.add("add.js")
    console.log(hash)
})