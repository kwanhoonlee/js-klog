const ipfsClient = require('ipfs-http-client')
const utils = require('../../utils/')
const encoder = require('./encoder')
// const pinning = require('./pin')
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
            console.log("Invalid CID")
            reject(cid)
        }
    })
}

async function addParityBlocks(){
    var files = await utils.files.getBlockList()
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
    var roothash

    await add(fname, true).then(function(resolvedData){
        roothash = resolvedData
    })

    return roothash
}

// TODO : if fsize < 1MB, replicate a file
async function addFile(fname){
    var es = await encoder.encode(fname)   
    var rh = await addOriginalFile(fname)
    var dbl = await getDataBlockList(rh)    
    var pbl = await addParityBlocks()
    var mi = await meta.setMetaInfo(es, rh, dbl, pbl)

    return mi
}

async function getDataBlockList(cid){
    var mh = await ipfs.ls(cid)
    var mhList = []

    if (mh.length != 0){    
        mh.forEach(function(e){
            mhList.push(e.hash)    
        })
    }
    
    return mhList
}

module.exports = {
    addFile : addFile
}
