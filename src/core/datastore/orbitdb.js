
var DB = class{
    constructor(type, name, address, host, webSocket){
        this.type = type
        this.name = name
        this.address = address
        this.host = host
        this.webSocket = webSocket
    }
}

// var meta = new DreqB('keyvalue', 'meta', 'address', 'localhost', 'websocket' )
// console.log(meta)

module.exports = {
    DB : DB
}

