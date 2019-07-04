const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfsOptions = {
    EXPERIMENTAL:{
        pubsub:true
    }
}

const ipfs = new IPFS(ipfsOptions)
// console.log(ipfs)
ipfs.on('ready', async() => {
    const orbitdb = await OrbitDB.createInstance(ipfs)
    const options = {
        accessController:{
            write:['*']
        }
    }
    const db = await orbitdb.eventlog('helloworld', options)
    await db.load()

    console.log(db.address)
    
    db.events.on('replicated', (address) => {
        console.log(db.iterator({ limit: -1 }).collect())
    })

    const hash = await db.add('helloworld!')
    console.log(hash)
    const result = db.iterator({ limit: -1 }).collect()
    console.log(JSON.stringify(result, null, 2))
    const hash2 = await db.add('helloworld!2')
})
var queue = [];
