const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const io = require('socket.io')(3999)

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
const ipfs = new IPFS(ipfsOptions)

ipfs.on('errer', (e) => console.error(e))
ipfs.on('ready', async () => {
    var queue = []
    console.log("daemon")
    var dir = process.env['HOME'].concat('/.k-log/datastore/orbitdb')
    const orbitdbOptions = {
        directory:dir
    }

    const orbitdb = await OrbitDB.createInstance(ipfs, orbitdbOptions)
    const dbOptions = {
        accessController:{
            write:['*']
        }, 
        directory:dir
    }
    
    const meta = await orbitdb.keyvalue('meta', dbOptions)
    const job = await orbitdb.docs('job', dbOptions)
    const eventlog = await orbitdb.eventlog('eventlog', dbOptions)

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
        console.log(eventlog.iterator({ limit: -1 }).collect().map(e => e.payload.value))
    })

    io.on('connection', (socket) => {
        socket.on('message', async (msg) => {
            await queue.push(msg)
            var newMsg = await queue.shift()
            meta.put(newMsg.Roothash, newMsg)

            // console.log(newMsg)
        })
    })
})
