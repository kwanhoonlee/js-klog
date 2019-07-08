const OrbitDB = require('../datastore/orbitdb')
var MessageQueue = require('svmq')
var queue = new MessageQueue(31337)
var Cluster = require('./cluster')
var Add = require('./add')
var Get = require('./get')
var Pin = require('./pin')

async function daemon(){
    var orbitdb = await OrbitDB.newDB()
    const dbOptions = {
        accessController: {
            write: ['*']
        }
    }
    var meta = await orbitdb.keyvalue('meta', dbOptions)
    var job = await orbitdb.docs('job', dbOptions)
    var eventlog = await orbitdb.eventlog('eventlog', dbOptions)

    await meta.load()
    await job.load()
    await eventlog.load()

    console.log(meta.address.toString().concat('\n', job.address.toString(), '\n',  eventlog.address.toString()))
    
    meta.events.on('replicated', (address) => {
        console.log("Meta has been updated")
    })

    job.events.on('replicated', (address) => {
        console.log("Job has been updated")
    })

    eventlog.events.on('replicated', (address) => {
        console.log("Evenltlog has been updated")
        // const event = eventlog.iterator({ limit: 1 }).collect().map(e => e.payload.value)
        // console.log(event[0])
    })
    Cluster.daemon(eventlog)

    queue.on('data', async (data) => {
        var d = JSON.parse(data.toString())
        if (d.type == 'add') {
            var mi = await Add.addFile(d.data)
            var h = await meta.put(mi.Roothash, mi)
            console.log(mi.Roothash)
            console.log(mi)

            var pm = await Pin.pin(mi.Roothash, mi.DataBlockList.concat(mi.ParityBlockList))
            for (var i = 0; i < pm.length; i ++){
                console.log(pm[i])
                await eventlog.add(pm[i])
            }
        }
        if (d.type == 'get') {
            var mi = await meta.get(d.data)
            console.log(mi)
            await Get.getFile(mi)
        }
    })
}


daemon()
// cluster_daemon()
