var ipfsClusterAPI = require('ipfs-cluster-api')
var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})
var eventlog = require('../datastore/eventlog')

async function pin(rh, cids){
    var ml = []
    var pl = await getAlivePeerList().then(function(resolved){
        return shuffle(resolved)
    })
    
    for(var i = 0; i < cids.length; i ++){
        var p = pl.shift()
        ml.push(await allocate(rh, p, cids[i]))
        pl.push(p)
    }
    return ml
}

function getAlivePeerList(){
    return new Promise(function(resolve){
        ipfsCluster.peers.ls({}, function(err, peerList){
            pl = []
            peerList.forEach(p => {
                if (!p.error){
                    pl.push(p.id)
                }
            })
            resolve(pl)
        })
    })
}

async function allocate(rh, peerId, cid){
    var pm = eventlog.setAllocationMessage(rh, peerId, cid)

    await ipfsCluster.pin.add(cid, {
        "user-allocations": [peerId,],
        "replication": 1,
        "name": rh
    })

    return pm
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

module.exports = {
    pin:pin,
}
