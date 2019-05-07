const ipfsClient = require('ipfs-http-client')
const pin = require('./src/core/commands/pin')

config = {
    host:"localhost",
    port:"5001",
    protocol:"http",
}
const ipfsC = ipfsClient(config.host, config.port, {protocol:config.protocol})

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
// const io = require('socket.io')(3999)
const EventEmitter = require('events')

const ipfsOptions = {
    EXPERIMENTAL:{
        pubsub:true
    },
    repo:process.env['HOME'].concat('/.k-log/js-ipfs/'),
    config: {
        Addresses: {
            Swarm: [
                "/ip4/0.0.0.0/tcp/6002",
                "/ip4/127.0.0.1/tcp/6003/ws"
            ]
        }
    }
}
const ipfs1 = new IPFS(ipfsOptions)

ipfs1.on('ready', async () => {
    var dir = process.env['HOME'].concat('/.k-log/datastore/orbitdb')
    const orbitdbOptions = {
        directory:dir
    } 
    // const orbitdb = new OrbitDB(ipfs)
    const orbitdb = await OrbitDB.createInstance(ipfs1, orbitdbOptions)
    const dbOptions = {
        accessController:{
            write:['*']
        }, 
        directory:dir
    }

    var meta = await orbitdb.keyvalue('meta', dbOptions)
    var job = await orbitdb.docs('job', dbOptions)
    var eventlog = await orbitdb.eventlog('eventlog', dbOptions)

    await meta.load()
    await job.load()
    await eventlog.load()

    // console.log(meta.address)
    console.log(meta.address.toString())
    console.log(job.address.toString())
    console.log(eventlog.address.toString())

    meta.events.on('replicated', (address) => {
        console.log("Meta has been replicated")
        // console.log(meta.iterator({ limit: -1 }).collect())
    })

    job.events.on('replicated', (address) => {
        console.log("Job has been replicatied")
        // console.log(job.iterator({ limit: -1 }).collect())
    })

    eventlog.events.on('replicated', (address) => {
        console.log("Log has been replicatied")
        console.log(eventlog.iterator({ limit: -1 }).collect())
    })

    let mQueue = []
    let eQueue = []
    let jQueue = []
    var a = await ipfsC.ls('QmQg1kiYJ33yAfiLWmo3yaGSM6NB4xSfquAdr5ygLqTKXE', async function(err, result){
        middle = []
        leaf = []
        for (var i in result){
            await middle.push(result[i].hash)
            ipfsC.ls(result[i].hash, async function(err, hash){
                for (var j in hash){
                    await leaf.push(hash[j].hash)
                    await pin.allocations('QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX', [hash[j].hash])
                    await eventlog.add('/pinned/QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX' + hash[j].hash)
                }
                
            })
        }
        console.log(await leaf.length)
    })
    // kE.on('event', (event) =>  {
    //     console.log(event, 'event')
    // })
    // makeEvent()
    // var a = function(){
    //     console.log('hello world')
    // }
    // io.on('connection', (socket) => {
    //     socket
    //         .on('meta', async (msg) => {
    //             console.log(msg)
    //             await mQueue.push(msg)
    //             var mMsg = await mQueue.shift()
    //             await meta.put(mMsg.Roothash, mMsg)
    //         })
    // })
})

async function test(){
    
      
}
test()

const ipfs = new IPFS(ipfsOptions)
