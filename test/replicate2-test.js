const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfs1 = new IPFS({ repo: './ipfs1', EXPERIMENTAL:{
    pubsub:true
}, config: {
    Addresses: {
        Swarm: [
            "/ip4/0.0.0.0/tcp/6002",
            "/ip4/127.0.0.1/tcp/6003/ws"
        ]
        } }
    })
ipfs1.on('ready', async () => {
  // Create the database
  const orbitdb1 = await OrbitDB.createInstance(ipfs1, { directory: './orbitdb1' })
  const db1 = await orbitdb1.keyvalue('events')

  // Create the second peer
  const ipfs2 = new IPFS({ repo: './ipfs2', EXPERIMENTAL:{
      pubsub:true
  } })

  ipfs2.on('ready', async () => {
    // Open the first database for the second peer,
    // ie. replicate the database
    const orbitdb2 = await OrbitDB.createInstance(ipfs2, { directory: './orbitdb2' })
    const db2 = await orbitdb2.keyvalue(db1.address.toString())

    // When the second database replicated new heads, query the database
    db2.events.on('replicated', () => {
    //   const result = db2.iterator({ limit: -1 }).collect()
    console.log('replicated')
    //   console.log(result.join('\n'))
    })

    // Start adding entries to the first database
    setInterval(async () => {
      await db1.put('hello', 'world')
    }, 10000)
  })
})
