var ipfsClusterAPI = require('ipfs-cluster-api')
var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})
var sender = require('./messenger')

async function pin(cid){
    pl = []
    await ipfsCluster.peers.ls({},function(err, peerList){
        if (err){
            console.log(err)
        } else {
            peerList.forEach(function(e){
                pl.push(e.id)
                if (e.id == 'QmaRixmzbuZAShb6acL2N6gvRLD4GcrSzuvYYKHRWZ4Dsi'){
                    allocations(e.id, cid)
                }
            })
            // console.log(pl)
        }
    })
}

async function allocations(peerId, cid){
    for (var i in cid){
        var m = setAllocationMessage(peerId, cid[i])

        await ipfsCluster.pin.add(cid[i], {
            "replication":1,
            "allocations":peerId
        })
        // await sender.sendMessages('eventlog', m)
    }
}

function setAllocationMessage(peerId, cid){
    var prefix = '/pin/'
    var message = prefix.concat(peerId, "/", cid)

    return message
}

// TODO: change this part to recordEventlog
async function setPinnedMessage(peerId, cid){
    await ipfsCluster.pin.ls(cid, function(err, r){
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


// allocations('QmZrYJxrno69SXnwPRGH5oLZcufvPqkuJe1ayedFSX7JNP', ['QmYUqHFLLHpTRfRaZAjKbEDfjrw6SCyQuTrHmBcKt51VaK','QmXRSZ5PuHSJH2auQFy8enb7aWcRVZH9oZds3DkpndjGMw', 'QmSdrTgESwrwHbgiym6y2GByxuUWxkPmsdTc8AX3Zc7VoE', 'QmRyoj6bziCtFoB17hU4ZpnoWNVfHqs6WkHYnsAKenpWQ7'])

// for (var i=0; i<100; i++){
//     setPinnedMessage('QmZrYJxrno69SXnwPRGH5oLZcufvPqkuJe1ayedFSX7JNP', 'QmT4xRTR7LCXHeJJ87npTeRmiwy5ifZpWinW13Gtab2aZ9')
// }

module.exports = {
    pin:pin,
    allocations : allocations,
    setPinnedMessage : setPinnedMessage
    
}