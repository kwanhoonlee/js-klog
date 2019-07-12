const fs = require('fs')
const dht = require('./dht')
const decoder = require('./decoder')
const parser = require('../../utils/parser')
const files = require('../../utils/files')
var execSync = require('child_process').execSync;

function get(cids, fname) {
    cmd = concatFlag(cids, fname)

    execSync(cmd, function(err, stdOut, stdErr){
        if (err){
            console.log(err)
        }
    })
}

function concatFlag(cids, fname){
    var cmd = 'ipfs cat '

    cids.forEach(function(cid) {
        cmd = cmd.concat(cid, " ")
    })
    cmd = cmd.concat("> ", fname )

    return cmd
}

async function getFile(mi){
    var checkList = [[mi.Roothash], mi.DataBlockList, mi.ParityBlockList]
    const promise = checkList.map(list => dht.findProviders(list))

    await Promise.all(promise).then(function(resolved){
        var checkerResult = []
        var indices = []
        
        resolved.forEach(function(array){
            checkerResult.push(checker(array))
            indices.push(findIndices(array))
        })
        var numBlocks = indices[1].length + indices[2].length
        // console.log(checkerResult, indices, 'the number of blocks', numBlocks)

        // TODO : add try-catch
        if (checkerResult[0] == true){
            get([mi.Roothash], mi.FileName)
        }else if (checkerResult[0] == false && checkerResult[1] == true){
            get(mi.DataBlockList, mi.FileName)
        }else {
            if (numBlocks >= indices[1].length) {
            getFileUsingDecoding(indices, mi)
            }else {
                console.log('Not enough number of blocks')
            }
        }
    })
}

function getFileUsingDecoding(indices, mi){
    var aliveBlockList = {
        'dataBlock' : getAliveBlockList(indices[1], mi, 'data'),
        'parityBlock' : getAliveBlockList(indices[2], mi, 'parity')
    }
    
    var codingDir = './Coding/'
    if (fs.existsSync(codingDir) == false){
        fs.mkdirSync(codingDir)
    }
    decoder.createDecodingConfigurationFile(mi)
    
    for (var key in aliveBlockList){
        if (aliveBlockList[key].Block != undefined){
            for (var i = 0; i<aliveBlockList[key].Block.length; i++){
                get([aliveBlockList[key].Block[i]], codingDir.concat(aliveBlockList[key].Name[i]))
                if(isLastDataBlock(aliveBlockList[key].Name[i])){
                    var dsize = getMiddleSize(mi.FileSize)
                    addNull(codingDir.concat(aliveBlockList[key].Name[i]), dsize)
                }
            }
        }
    }
    getNumberOfBlocks(aliveBlockList)
    decoder.decode(mi.FileName)
    files.moveDecodedFile(mi.FileName)
    files.deleteFolderRecursive(codingDir)
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
    var cidList = []
    var fname = parser.getFilenameWithoutExtension(mi.FileName)
    var extension = parser.getExtension(mi.FileName)
    var prefix = blockType == 'data' ? '_k' : '_m'
    var blockList = blockType == 'data' ? mi.DataBlockList : mi.ParityBlockList

    if (indices.length != 0){
        indices.forEach(function(idx){
            cidList.push(blockList[idx])
            blockNameList.push(fname.concat(prefix, String(idx+1), '.', extension))
        })
    }else {
        return 0
    }

    dict['Block'] = cidList
    dict['Name'] = blockNameList

    return dict
}

function getMiddleSize(fsize){
    var size
    var mb = 1024 * 1024 
    var q = parseInt(fsize / mb)
    var r = fsize % mb

    if (r > (mb/2)){
        q = q + 1
        size = q * mb /8
    }else if (r == 0){
        size = q * mb / 8
    }else if (r < (mb/2)){
        size = ((q + 0.5) * mb) / 8
    }
    return size
}

function isLastDataBlock(fname){
    var pattern = /_k8./
    var isLast = pattern.test(fname)

    return isLast
}

function addNull(fname, dsize){
    var fsize = fs.statSync(fname).size
    var psize = dsize - fsize

    if (psize != 0){
        var cmd = 'dd '
        cmd = cmd.concat('if=/dev/zero bs=1 count=', psize, ' >> ', fname )
            execSync(cmd, function(err, stdOut, stdErr){
        })
    }
}

function getNumberOfBlocks(abl){
    var num = abl['dataBlock'].Block.length + abl['parityBlock'].Block.length
    if (num == 12 ){
        var codingDir = './Coding/'
        fs.unlinkSync(codingDir.concat(abl['parityBlock'].Name[0]))
    }
    return num
}

module.exports = {
    getFile : getFile
}