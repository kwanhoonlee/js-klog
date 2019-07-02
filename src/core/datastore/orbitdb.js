const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

async function newDB(){
    config = {
        host:"localhost",
        port:"5001",
        protocol:"http",
    }

    const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol})

    var dir = process.env['HOME'].concat('/.k-log/datastore/orbitdb')
    const orbitdbOptions = {
        directory: dir
    }
    
    const orbitdb = await OrbitDB.createInstance(ipfs, orbitdbOptions)
   
    return orbitdb
}

var DB = class{
    constructor(type, name, address, host, webSocket){
        this.type = type
        this.name = name
        this.address = address
        this.host = host
        this.webSocket = webSocket
    }
}

module.exports = {
    DB : DB,
    newDB : newDB
}

