const ipfsClient = require('ipfs-http-client')
const utils = require('../../utils/')
const encoder = require('./encoder')
const sender = require('./messenger')
const Meta = require('../datastore/meta')
const fs = require('fs')

config = {
    host:"localhost",
    port:"5001",
    protocol:"http",
}

const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol})

async function add(fname){
    var f = fs.readFileSync(fname)
    let h = await ipfs.add(f)

    // console.log(h[0].hash)

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

async function addBlocks(){
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

    await add(fname).then(function(resolvedData){
        roothash = resolvedData
    })

    return roothash
}

async function commandAdd(fname){
    encoder.encode(fname)
    var rh = await addOriginal(fname)
    var pbl = await addBlocks()
    let mi = await setMetaInfo(fname, rh, pbl)

    // console.log(mi.toJSON())
    return rh, pbl
}

function isParityBlock(fname){
    var pattern = /_m[0-9]./
    var isParity = pattern.test(fname)

    return isParity
}

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

async function setMetaInfo(fname, rh, pbl){
    var es = await getErasureCodingSchema(fname)
    var mi = await new Meta.mi()

    for (var i in es) {
        mi[Object.keys(mi)[i]] = es[i]
    }

    mi['Roothash'] = rh
    mi['ParityBlockList'] = pbl
    console.log(mi)
    
    sender.sendMessages(mi)
    return mi
}

commandAdd('add.js')

module.exports = {
    add : add,
    // addBlocks : addBlocks,
    // addOriginal: addOriginal,
    commandAdd : commandAdd
}
