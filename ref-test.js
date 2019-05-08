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

    var eventlog = await orbitdb.eventlog('eventlog', dbOptions)


    await eventlog.load()

    // console.log(meta.address)

    console.log(eventlog.address.toString())

    eventlog.events.on('replicated', (address) => {
        console.log("Log has been replicatied")
        console.log(eventlog.iterator({ limit: -1 }).collect())
    })
    
    let eQueue = []

    const queryLoop = async function(db, content) {
        var hash = await db.add(content)
        console.log(hash)
        setImmediate(() => queryLoop(db))
    }
    
    var a = await ipfsC.ls('QmQg1kiYJ33yAfiLWmo3yaGSM6NB4xSfquAdr5ygLqTKXE', async function(err, result){
        middle = []
        leaf = []
        for (var i in result){
            await middle.push(result[i].hash)
            await ipfsC.ls(result[i].hash, async function(err, hash){
                
                for (var j in hash){
                    await leaf.push(hash[j].hash)
                    await pin.allocations('QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX', [hash[j].hash])
                    
                    // const log = await eventlog.add('/pinned/QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX' + hash[j].hash)
                    await queryLoop(eventlog, '/pinned/QmdxgDCehPNnd9AYkHp93KcwTjJ8wkRxSf6mS1HrrXp2vX' + hash[j].hash)
                    // console.log(log)
                    
                    // const all = await eventlog.iterator({ limit: -1 })
                    //     .collect()
                    //     .map((e) => e.payload.value)

                }
                
            })
        }
        console.log(await leaf.length)
    })
    
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  