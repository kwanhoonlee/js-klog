const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub:true
  },
}
const ipfs = new IPFS(ipfsOptions)
ipfs.on('ready', async () => {
  const orbitdb = await OrbitDB.createInstance(ipfs)
  const options = {
    // Give write access to ourselves
    accessController: {
      write: [orbitdb.identity.publicKey]
    }
  }

  const db = await orbitdb.keyvalue('first-database', options)
  console.log(db.address.toString())
  // /orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/first-database
})
