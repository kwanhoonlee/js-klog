var ipfsClusterAPI = require('ipfs-cluster-api')
var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})
var sender = require('../messenger')

// TODO: allocate peer to 
async function pin(cid){
    pl = []
    await ipfsCluster.peers.ls({},function(err, peerList){
        if (err){
            console.log(err)
        } else {
            peerList.forEach(function(peer){
                pl.push(peer.id)
                if (peer.id == 'QmSitWA48MAVmsmFtB2PcRueyQBqwS1pc8ZtmazfpkUE2s'){
                    allocate(peer.id, cid)
                }
            })
            // console.log(pl)
        }
    })
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
 
async function pinTest(cids){
    var m = []
    var pl = await getAlivePeerList().then(function(resolved){
        return shuffle(resolved)
    })
    cids.forEach(async function(cid){
        m.push(await allocate(pl[0], cid))
    })

}

// async function allocate(peerId, cids){
//     for (var i in cids){
//         var m = setAllocationMessage(peerId, cids[i])

//         await ipfsCluster.pin.add(cids[i], {
//             "replication":1,
//             "allocations":peerId
//         })
//         console.log(m)
//     }
// }

// pinTest(['QmZkKAbLhSy9t2QdZcgYkHtHwbNjXUy75ao42wwuRuN1zf'])

async function allocate(peerId, cid){
    var m = setAllocationMessage(peerId, cid)

    await ipfsCluster.pin.add(cid, {
        "replicateion": 1,
        "allocations":peerId
    })

    return m
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

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
// allocations('QmZrYJxrno69SXnwPRGH5oLZcufvPqkuJe1ayedFSX7JNP', ['QmYUqHFLLHpTRfRaZAjKbEDfjrw6SCyQuTrHmBcKt51VaK','QmXRSZ5PuHSJH2auQFy8enb7aWcRVZH9oZds3DkpndjGMw', 'QmSdrTgESwrwHbgiym6y2GByxuUWxkPmsdTc8AX3Zc7VoE', 'QmRyoj6bziCtFoB17hU4ZpnoWNVfHqs6WkHYnsAKenpWQ7'])

// for (var i=0; i<100; i++){
//     setPinnedMessage('QmZrYJxrno69SXnwPRGH5oLZcufvPqkuJe1ayedFSX7JNP', 'QmT4xRTR7LCXHeJJ87npTeRmiwy5ifZpWinW13Gtab2aZ9')
// }

module.exports = {
    pin:pin,
    allocate : allocate,
    setPinnedMessage : setPinnedMessage
    
}