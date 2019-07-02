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
   const db1 = await orbitdb.keyvalue('events')
   console.log(db1.address.toString()) 
   setInterval(async () => {
      await db1.put('hello', 'world')
      console.log('added')
    }, 10000)
})
