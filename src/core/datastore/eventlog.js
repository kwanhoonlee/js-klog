function setAllocationMessage(rh, peerId, cid){
    var prefix = '/pin/'
    var pm = prefix.concat(rh, "/", peerId, "/", cid)

    return pm
}

// TODO: change this part 
// async function setPinnedMessage(peerId, cid){
//     await ipfsCluster.pin.ls(cid, function(err, r){
//         if (err){
//             var prefix = '/error/'
//             var message = prefix.concat(peerId, '/', cid)

//             console.log('Not Pinned')
//             console.log(message)
//         }else {
//             var isExist = r.allocations.indexOf(peerId)!== -1
//             if (isExist){
//                 var prefix = '/pinned/'
//                 var message = prefix.concat(peerId, '/', cid)          

//                 console.log(message)            
//             }
//         }
//     })
// }

module.exports = {
    setAllocationMessage : setAllocationMessage
}