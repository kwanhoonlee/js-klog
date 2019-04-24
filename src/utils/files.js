const fs = require('fs')

name = {
    mfExtension : '_meta.txt'
}

function getBlockList(){
    var files = fs.readdirSync(path.coding)

    return files
}

function readMetaFile(fname){
    var f = fs.readFileSync(path.coding.concat(fname)).toString().split('\n')

    return f
}

module.exports = {
    name : name,
    getBlockList : getBlockList,
    readMetaFile : readMetaFile
} 