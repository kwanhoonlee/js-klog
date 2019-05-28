const ipfsClient = require('ipfs-http-client')
const utils = require('../../utils/')
const encoder = require('./encoder')
const sender = require('./messenger')
const pinning = require('./pin')
const Meta = require('../datastore/meta')
const fs = require('fs')
// const cluster_test = require('../../../cluster-test')

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
            await add(codingPath.concat(files[i])).then(function(resolvedData){
                hashList.push(resolvedData)
            })        
        }
    }

    return hashList
}

async function addOriginal(fname){
    var roothash

    await add(fname, true).then(function(resolvedData){
        roothash = resolvedData
    })

    return roothash
}

async function commandAdd(fname){
    await encoder.encode(fname)

    var rh = await addOriginal(fname)
    var dbl = await getDataBlockList(rh)
    var pbl = await addParityBlocks()
    let mi = await setMetaInfo(fname, rh, dbl, pbl)
    // for (var i=0; i < dbl.length; i++){
    //     await pinning.pin(dbl[i])
    // }
    // await pinning.pin(pbl)
    // console.log(pbl)
    // console.log(mi)
    // console.log(es)
    console.log(mi)
    return rh, pbl
}

function isParityBlock(fname){
    var pattern = /_m[0-9]./
    var isParity = pattern.test(fname)

    return isParity
}

// TODO: add exception for getting extension
function getErasureCodingSchema(fname){
    var parsed = utils.parser.splitExtension(fname)
    parsed.pop()
    var mfname = parsed.join('').concat(utils.files.name.mfExtension)  
    var f = utils.files.readMetaFile(mfname)
    f.pop()

    var es = []
    for (var i in f){
        if (i == 2) {
            tmp = f[i].split(' ')
            for (var j in tmp){
                es.push(tmp[j])
            }
        } else {
            es.push(f[i])
        }
    }

    return es
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


// async function getDataBlockList(cid){
//     var mhList = await getBlockList(cid)
//     var lfList = []
//     var dbList = []

//     if (mhList.length != 0 ){
//         for (var i=0; i<mhList.length; i++){
//             var lf = await getBlockList(mhList[i])
//             lf.forEach(function(e){
//                 lfList.push(e)
//             })
//         }
        
//         var sNumber = Math.ceil(lfList.length / 8 )
//         for (var i = 0; i < 8; i ++ ){
//             if (i != 0 ){
//                 dbList.push(lfList.slice(i*lfList - 1, (i+1)*sNumber))
//             }else {
//                 dbList.push(lfList.slice(i, sNumber))
//             }
//         }
//         return dbList
//     }
    
// }

async function setMetaInfo(fname, rh, dbl, pbl){
    var es = await getErasureCodingSchema(fname)
    var mi = await new Meta.mi()

    for (var i in es) {
        mi[Object.keys(mi)[i]] = es[i]
    }

    mi['Roothash'] = rh
    mi['DataBlockList'] = dbl
    mi['ParityBlockList'] = pbl
   
    // sender.sendMessages('meta', mi.toJSON())
    
    return mi
}

commandAdd('7MB.txt')

module.exports = {
    add : add,
    commandAdd : commandAdd
}
