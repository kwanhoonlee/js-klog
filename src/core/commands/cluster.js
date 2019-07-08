var ipfsClusterAPI = require('ipfs-cluster-api')
var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})

async function id(){
    id = await ipfsCluster.id()
    return id.id
}

async function pinState(cid){
    pinls = await ipfsCluster.pin.ls(cid)
    return pinls
}

async function setPinnedMessage(cid){
    var pinls = await pinState(cid)
    var prefix = '/pinned/'
    var pm = prefix.concat(pinls.name, "/", pinls.allocations, "/", cid)

    return pm
}

function daemon(eventlog ){
    var spawn = require('child_process').spawn

    var cmd = spawn('ipfs-cluster-service', ['daemon'])

    cmd.stderr.on('data', async function(data){
        var log = "IPFS Pin request succeeded:"
        if(data.toString().includes(log)){
            var parsed = data.toString().split(' ')
            var cid = parsed[parsed.length - 2]
            var pm = await setPinnedMessage(cid)
            await eventlog.add(pm)
            console.log(pm)
        }
    })
}
// clusterDaemon()
// console.log(setPinnedMessage('QmaUYzdtb5rSeXboeDX3EbP7n1kMpBm9KBnrHNjxqhrBWG'))

module.exports = {
    setPinnedMessage : setPinnedMessage,
    id : id,
    daemon : daemon
}