const ipfsClient = require('ipfs-http-client')
const utils = require('../../utils/')
const encoder = require('./encoder')
const meta = require('../datastore/meta')
const fs = require('fs')

config = {
    host:"localhost",
    port:"5001",
    protocol:"http",
}

const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol})

async function add(fname, option){
    var f = fs.readFileSync(fname)
    let h 
    if (typeof option === 'undefined')
        h = await ipfs.add(f)
    else 
        h = await ipfs.add(f, {chunker:"klog-".concat(String(f.length))})
    
    return new Promise(function(resolve, reject){
        const cid = h[0].hash

        if (typeof cid != undefined){
            resolve(cid)
        }else {
            console.log("Error: no such file")
            reject(false)
        }
    })
}

async function addParityBlocks(){
    var files = await utils.files.getCodingBlockList()
    var codingPath = utils.path.coding
    var hashList = []

    for(var i in files){
        if (isParityBlock(files[i])){
            await add(codingPath.concat(files[i])).then(function(resolved){
                hashList.push(resolved)
            })        
        }
    }

    return hashList
}

function isParityBlock(fname){
    var pattern = /_m[0-9]./
    var isParity = pattern.test(fname)

    return isParity
}

async function addOriginalFile(fname){
    var rh

    await add(fname, true).then(function(resolvedData){
        rh = resolvedData
    })

    return rh
}

// TODO : if fsize < 1MB, replicates a file
async function addFile(fname){
    var es = await encoder.encode(fname)   
    var rh = await addOriginalFile(fname)
    var dbl = await getDataBlockList(rh)    
    var pbl = await addParityBlocks()
    var mi = await meta.setMetaInfo(es, rh, dbl, pbl)
    utils.files.deleteFolderRecursive('Coding')

    return mi
}

async function getDataBlockList(cid){
    var mhl = await ipfs.ls(cid)
    var dbl = []

    if (mhl.length != 0){    
        mhl.forEach(function(mh){
            dbl.push(mh.hash)    
        })
    }
    
    return dbl
}

module.exports = {
    addFile : addFile
}
