const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')
config = {
    host:"localhost",
    port:"5001",
    protocol:"http",
}

const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol})

async function test() {
  var dir = process.env['HOME'].concat('/.k-log/datastore/orbitdb')

  const orbitdb = await OrbitDB.createInstance(ipfs, { directory: './orbitdb1' })
  const dbOptions = {
        accessController: {
            write: ['*']
        },
        directory: dir
    }
  const db1 = await orbitdb.eventlog('events', dbOptions)
  console.log(db1.address.toString()) 
   setInterval(async () => {
      await db1.add('helloworld')
      console.log('added')
    }, 10000)

  db1.events.on('replicated', () => {
    const result = db1.iterator({ limit: -1 }).collect()
    console.log('replicated')
    console.log(result.join('\n'))
    })
}

test()
