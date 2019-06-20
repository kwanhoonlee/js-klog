const ipfsClient = require('ipfs-http-client')
const ipfsAPI = require('ipfs-api')
const fs = require('fs')
const dht = require('./dht')
const decoder = require('./decoder')
var exec = require('child_process').exec,child;

// config = {
//     host:"127.0.0.1",
//     port:"5001",
//     protocol:"http",
//     dht:true,
// }

// const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol,dht:true}, )

function get(cids, fname) {
    cmd = concatCMD(cids, fname)

    child = exec(cmd, function(err, stdOut, stdErr){
        if (err){
            console.log(err)
        }
    })
}

function concatCMD(cids, fname){
    var cmd = 'ipfs cat '

    cids.forEach(function(cid) {
        cmd = cmd.concat(cid, " ")
    })
    cmd = cmd.concat("> ", fname )

    return cmd
}

async function findProvidersUsingMetaInfo(mi){
    var checkList = [[mi.Roothash], mi.DataBlockList, mi.ParityBlockList]
    const promise = checkList.map(list => dht.findProvidersUsingCIDs(list))

    await Promise.all(promise).then(function(resolved){
        var checkerResult = []
        var indices = []
        resolved.forEach(function(array){
            checkerResult.push(checker(array))
            indices.push(findIndex(array))
        })
        console.log(indices)
        console.log(checkerResult)
        if (checkerResult[0] == true){
            decoder.createMetaFile(mi)
            get([mi.Roothash], mi.FileName)
        }else if (checkerResult[0] == false && checkerResult[1] == true){
            get(mi.DataBlockList, mi.FileName)
        }else {
            
        }

    })
}

function checker(array){
    var count = 0
    for(const i of array){
        count = count + i
    }

    if (array.length == count){
        return true
    }else {
        return false
    }
}

function findIndex(array){
    var idx = array.indexOf(1)
    var indices = []

    while (idx != -1){
        indices.push(idx)
        idx = array.indexOf(1, idx + 1)
    }

    return indices
}
function getAliveBlockList(array, mi){
    if (array.length != 0){
        array.forEach(function(idx){
            
        })
    }
}
// test()
// get_test(['QmRv4bXYMS9dCxcK7dySTvWqohrhACWaas9sUsFPrVDwmf', 'Qmf9Z15w8zcBjrVXhDT4XwNVUhAdxZTMaHPQCLPUSLMWod', 'QmaGGpFd31jfoxVemjMjCzmE58yETu3HAr1qCXV5gzbDno', 'QmQZJMLWk5n28RPF9yQXe6m9TQw5FCSXuFTstv175NhiP6' ], 'new_1MB.txt')

module.exports = {
    findProvidersUsingMetaInfo : findProvidersUsingMetaInfo
}