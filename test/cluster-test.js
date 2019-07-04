var ipfsClusterAPI = require('ipfs-cluster-api')

var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})

async function test(){
    await ipfsCluster.pin.add('QmWBzm4RMbV5MWJQRJsqjpeTHeYw8DG1L23VURRwfY4tBM', {
        "replication":1,
        "allocations":"QmWYX4ry8x6EfFo384tf8oEY7tBgJ8VUtB2n6kn3BE9fLo"
    }, function(err, result){
        console.log(err)
    })
}
test()
async function getPeerList(bl){
    var pl = []

    ipfsCluster.peers.ls({}, async function(err, peerList){
        await peerList.forEach(function(e){
            if (e.error != 'dial backoff'){
               pl.push(e.id)
            }
            console.log(peerList.length % bl.length)
            for (var i=0; i < bl.length; i++){
                console.log(bl[i])
            }
        })
    })

    return pl
}
function roundRobin(bl){

}


module.exports = {
    getPeerList : getPeerList
}


