var ipfsClusterAPI = require('ipfs-cluster-api')
var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})
var eventlog = require('../datastore/eventlog')

async function pin(rh, cids){
    var m = []
    var pl = await getAlivePeerList().then(function(resolved){
        return shuffle(resolved)
    })
    
    for(var i = 0; i < cids.length; i ++){
        var p = pl.shift()
        m.push(await allocate(rh, p, cids[i]))
        pl.push(p)
    }
    return m
}

function getAlivePeerList(){
    return new Promise(function(resolve){
        ipfsCluster.peers.ls({}, function(err, peerList){
            pl = []
            peerList.forEach(e => {
                if (!e.error){
                    pl.push(e.id)
                }
            })
            resolve(pl)
        })
    })
}

async function allocate(rh, peerId, cid){
    var m = eventlog.setAllocationMessage(rh, peerId, cid)

    await ipfsCluster.pin.add(cid, {
        "replication": 1,
        "allocations": peerId
    })

    return m
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

module.exports = {
    pin:pin,
}