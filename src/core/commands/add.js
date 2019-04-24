const ipfsClient = require('ipfs-http-client')
const utils = require('../../utils/')
const encoder = require('./encoder')
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

    console.log(h[0].hash)

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

// TODO: except meta and datablocks
async function addBlocks(){
    var files = await utils.files.getBlockList()
    var codingPath = utils.path.coding
    
    for(var i in files){
        console.log(isParityBlock(files[i]))
        await add(codingPath.concat(files[i]))
    }
}

async function addOriginal(fname){
    await add(fname)
}

async function commandAdd(fname){
    encoder.encode(fname)
    addOriginal(fname)
    addBlocks()
}

commandAdd('add.js')
module.exports = {
    add : add,
    // addBlocks : addBlocks,
    addOriginal: addOriginal,
    commandAdd : commandAdd
}

function isParityBlock(fname){
    var pname = '_m[0-9].'
    var isParity = fname.indexOf(pname)!==-1;

    return isParity
}