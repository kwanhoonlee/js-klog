const ipfsClient = require('ipfs-http-client')
// const utils = require('../../utils/')
//const encoder = require('./encoder')
// const pinning = require('./pin')
// const Meta = require('../datastore/meta')
const fs = require('fs')

config = {
    host:"127.0.0.1",
    port:"5001",
    protocol:"http",
    dht:true,
}

const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol,dht:true}, )
// var ipfs = ipfsClient({ host: '1.1.1.1', port: '80', 'api-path': '/ipfs/api/v0', dht:true})

// async function get(cid) {
//     ipfs.get(cid, function (err, files) {
        
//         files.forEach((file) => {
//           console.log(file.path)
//           console.log(file.content.toString('utf8'))
//           fs.writeFileSync(file.path, file.content.toString('utf8'), 'utf8')
//         })
//     })
// }

// get('QmY54MTzDrLefCMm8FbXzaXXgRe3N1AJKj9k36VP58EEzH')


var exec = require('child_process').exec,child;

function makeCmd(cids, fname){
    cmd = "ipfs cat "

    cids.forEach(function(cid) {
        cmd = cmd.concat(cid, " ")
    })
    cmd = cmd.concat("> ", fname )

    return cmd
}

function getFileUsingDataBlock(cids, fname){
    cmd = makeCmd(cids, fname)
    
    child = exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

async function findProvidersUsingDHT(cid){

    await ipfs.dht.findProvs(cid, {timeout:400000}, async function (err, res) {
        console.log(cid)

        var a = await res
        console.log(a)
    })
}
findProvidersUsingDHT('QmehBA2HreFDit6QkGQnR6dzD19EhQaiGVR6TJvVej5YJs')
// getFileUsingDataBlock(['QmXWGEY9R9on1aFNWoc5hmcLd8C4zABUkSwCDDjsudzNUc', 'QmQW7czK468NrKLwhXhF9C3CywWBztivL3b4L5MBF9V73g' ], 'test.jpg')
// console.log()

module.exports = {
    getFileUsingDataBlock: getFileUsingDataBlock
}