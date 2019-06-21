const fs = require('fs')
const dht = require('./dht')
const decoder = require('./decoder')
const parser = require('../../utils/parser')
var exec = require('child_process').exec,child;

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

async function getFile(mi){
    var checkList = [[mi.Roothash], mi.DataBlockList, mi.ParityBlockList]
    const promise = checkList.map(list => dht.findProvidersUsingCIDs(list))

    await Promise.all(promise).then(function(resolved){
        var checkerResult = []
        var indices = []
        
        resolved.forEach(function(array){
            checkerResult.push(checker(array))
            indices.push(findIndices(array))
        })
        var numBlocks = indices[1].length + indices[2].length
        console.log(checkerResult, indices, 'current the number of blocks', numBlocks)

        if (checkerResult[0] == true){
            get([mi.Roothash], mi.FileName)
        }else if (checkerResult[0] == false && checkerResult[1] == true){
            get(mi.DataBlockList, mi.FileName)
        }else {
            var aliveBlockList = {
                'dataBlock' : getAliveBlockList(indices[1], mi, 'data'),
                'parityBlock' : getAliveBlockList(indices[2], mi, 'parity')
            }
            
            var codingDir = './Coding/'
            if (fs.existsSync(codingDir) == false){
                fs.mkdirSync(codingDir)
            }
            decoder.createMetaFile(mi)
            
            for (var key in aliveBlockList){
                if (aliveBlockList[key].Block != undefined){
                    for (var i = 0; i<aliveBlockList[key].Block.length; i++){
                        get([aliveBlockList[key].Block[i]], codingDir.concat(aliveBlockList[key].Name[i]))
                    }
                }
            }
            // TODO: try , catch
            decoder.decode(mi.FileName)
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

function findIndices(array){
    var idx = array.indexOf(1)
    var indices = []

    while (idx != -1){
        indices.push(idx)
        idx = array.indexOf(1, idx + 1)
    }

    return indices
}

function getAliveBlockList(indices, mi, blockType ){
    var dict = {}
    var blockNameList = []
    var aliveBlockList = []
    var fname = parser.splitExtension(mi.FileName)
    var prefix = blockType == 'data' ? '_k' : '_m'
    var blockList = blockType == 'data' ? mi.DataBlockList : mi.ParityBlockList

    if (indices.length != 0){
        indices.forEach(function(idx){
            aliveBlockList.push(blockList[idx])
            blockNameList.push(fname[0].concat(prefix, String(idx+1), '.', fname[1]))
        })
    }else {
        return 0
    }

    dict['Block'] = aliveBlockList
    dict['Name'] = blockNameList

    return dict
}


module.exports = {
    getFile : getFile
}