const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const io = require('socket.io')(3999);
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub:true
  },
}
const ipfs = new IPFS(ipfsOptions)
var queue = [];
ipfs.on('ready', async () => {
  const orbitdb = await OrbitDB.createInstance(ipfs)
  // const options = {
  //   // Give write access to ourselves
  //   accessController: {
  //     write: [orbitdb.identity.publicKey]
  //   }
  // }


  const db = await orbitdb.eventlog('first-database')
  console.log(db.address.toString())

  io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
      await queue.push(msg)
      await db.add(msg)

      console.log(queue.length)
    })
  })


})
