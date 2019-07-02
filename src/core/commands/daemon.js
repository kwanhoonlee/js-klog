const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
var MessageQueue = require('svmq')
var queue = new MessageQueue(31337)
var Add = require('./add')
var Get = require('./get')
var Pin = require('./pin')

const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    },
    repo: process.env['HOME'].concat('/.k-log/js-ipfs/'),
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

ipfs.on('ready', async () => {
    var dir = process.env['HOME'].concat('/.k-log/datastore/orbitdb')
    const orbitdbOptions = {
        directory: dir
    }
    // const orbitdb = new OrbitDB(ipfs)
    const orbitdb = await OrbitDB.createInstance(ipfs, orbitdbOptions)
    const dbOptions = {
        accessController: {
            write: ['*']
        },
        directory: dir
    }

    var meta = await orbitdb.keyvalue('meta', dbOptions)
    var job = await orbitdb.docs('job', dbOptions)
    var eventlog = await orbitdb.eventlog('eventlog', dbOptions)

    await meta.load()
    await job.load()
    await eventlog.load()

    console.log(meta.address.toString())
    console.log(job.address.toString())
    console.log(eventlog.address.toString())
    console.log(meta.get('QmWVeULwWqerbPzB9sUYYR9pxodPz2BoMxHjLM5BEyiLjX'))
    meta.events.on('replicated', (address) => {
        console.log("Meta has been replicated")
    })

    job.events.on('replicated', (address) => {
        console.log("Job has been replicatied")
    })

    eventlog.events.on('replicated', (address) => {
        console.log("Log has been replicatied")
        console.log(eventlog.iterator({ limit: -1 }).collect())
    })

    queue.on('data', async (data) => {
        var d = JSON.parse(data.toString())
        if (d.type == 'add') {
            var mi = await Add.addFile(d.data)
            var h = await meta.put(mi.Roothash, mi)

            console.log(mi.Roothash)
            console.log(mi)
            // await Pin.pin(mi.DataBlockList.concat(mi.ParityBlockList))
        }
        if (d.type == 'get') {
            var mi = await meta.get(d.data)
            console.log(mi)
            await Get.getFile(mi)
        }
    })
})
