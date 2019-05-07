var ipfsClusterAPI = require('ipfs-cluster-api')

var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})

async function pin(){
    pl = []
    await ipfsCluster.peers.ls({},function(err, peerList){
        if (err){
            console.log(err)
        } else {
            peerList.forEach(function(e){
                pl.push(e.id)
            })
            console.log(pl)
        }
        
    })
}

async function allocations(peerId, cid){
    for (var i in cid){
        var m = setAllocationMessage(peerId, cid[i])
        // console.log(m)
        await ipfsCluster.pin.add(cid[i], {
            "replication":1,
            "allocations":peerId
        })
    }
    // TODO: add recordEventlog()
}

function setAllocationMessage(peerId, cid){
    var prefix = '/pin/'
    var message = prefix.concat(peerId, "/", cid)

    return message
}

// TODO: change this part to recordEventlog
async function setPinnedMessage(peerId, cid){
    var s = await ipfsCluster.pin.ls(cid, function(err, r){
        if (err){
            var prefix = '/error/'
            var message = prefix.concat(peerId, '/', cid)

            console.log('Not Pinned')
            console.log(message)
        }else {
            var isExist = r.allocations.indexOf(peerId)!== -1
            if (isExist){
                var prefix = '/pinned/'
                var message = prefix.concat(peerId, '/', cid)          

                console.log(message)            
            }
        }
    })
}


// allocations('QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX', ['QmYUqHFLLHpTRfRaZAjKbEDfjrw6SCyQuTrHmBcKt51VaK','QmXRSZ5PuHSJH2auQFy8enb7aWcRVZH9oZds3DkpndjGMw', 'QmSdrTgESwrwHbgiym6y2GByxuUWxkPmsdTc8AX3Zc7VoE', 'QmRyoj6bziCtFoB17hU4ZpnoWNVfHqs6WkHYnsAKenpWQ7'])


// setPinnedMessage('QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX', 'QmT4xRTR7LCXHeJJ87npTeRmiwy5ifZpWinW13Gtab2aZ9')

module.exports = {
    allocations : allocations
}