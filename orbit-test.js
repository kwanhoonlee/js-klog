const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfs = new IPFS({ repo: './ipfs1', EXPERIMENTAL:{
    pubsub:true
}, config: {
    Addresses: {
        Swarm: [
            "/ip4/0.0.0.0/tcp/6002",
            "/ip4/127.0.0.1/tcp/6003/ws"
        ]
        } }
    })

ipfs.on('ready', async() => {
   const orbitdb = await OrbitDB.createInstance(ipfs, { directory: './orbitdb1' })
   const db2 = await orbitdb.open('/orbitdb/zdpuAm9ZAqZtd5Ur6pe83YpdjDKGQX6MxNL3VbKNwPnfuag5u/events')
   await db2.load()
   db2.events.on('replicated', () => {
    //   const result = db2.iterator({ limit: -1 }).collect()
    console.log('replicated')
    //   console.log(result.join('\n'))
    })
 
})

