const fs = require('fs')
const parser = require('./parser')
name = {
    mfExtension : '_meta.txt'
}

function getCodingBlockList(){
    var files = fs.readdirSync(path.coding)

    return files
}

function readMetaFile(fname){
    var f = fs.readFileSync(path.coding.concat(fname)).toString().split('\n')

    return f
}

function deleteFolderRecursive(dir){
  if(fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function(file, index){
      var curPath = dir + "/" + file

      if(fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else { 
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
  }
}

function moveDecodedFile(fname){
    var codingPath = './Coding/'
    var decoded = '_decoded'
    var f = parser.getFilenameWithoutExtension(fname)
    var e = parser.getExtension(fname)
    fs.renameSync(codingPath.concat(f, decoded,'.',e), fname)
}

module.exports = {
    name : name,
    getCodingBlockList : getCodingBlockList,
    readMetaFile : readMetaFile,
    deleteFolderRecursive : deleteFolderRecursive,
    moveDecodedFile : moveDecodedFile
} 