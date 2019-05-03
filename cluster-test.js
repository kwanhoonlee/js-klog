var ipfsClusterAPI = require('ipfs-cluster-api')

var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})

async function test(){
    // await ipfsCluster.peers.ls({
    // }, function(err, result){
    //     // console.log(err)
    //     console.log(result.length)
    // })
    // const pl = await getPeerList()   
    // // a = await ipfsCluster.peers.ls()
    // console.log(pl)
    await ipfsCluster.pin.add('QmWBzm4RMbV5MWJQRJsqjpeTHeYw8DG1L23VURRwfY4tBM', {
        "replication":1,
        "allocations":"QmWYX4ry8x6EfFo384tf8oEY7tBgJ8VUtB2n6kn3BE9fLo"
    }, function(err, result){
        console.log(err)
    })
    // c = await ipfsCluster.status('QmWBzm4RMbV5MWJQRJsqjpeTHeYw8DG1L23VURRwfY4tBM')
    // // d = function(){
    // //     {"replication_factor":1,}
    // // }
    // console.log(c)
    // console.log(typeof d)
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

            // ipfsCluster.pin.add()
        })
        // console.log(pl)
    })

    // console.log(pl)
    return pl
}
function roundRobin(bl){

}
// test()

// async function helloworld(){
//     var pl = await getPeerList()
//     console.log(pl)
// }

// helloworld()

module.exports = {
    getPeerList : getPeerList
}


