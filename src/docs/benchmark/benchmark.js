'use strict'

const IPFS = require('ipfs')
const IPFSRepo = require('ipfs-repo')
const DatastoreLevel = require('datastore-level')
const OrbitDB = require('orbit-db')

// Metrics
let totalQueries = 0
let seconds = 0
let queriesPerSecond = 0
let lastTenSeconds = 0
let key = 10000000000

// Main loop
const queryLoop = async (db) => {
  await db.put(key, 'this.Fname = Fname  this.Fsize = Fsize  this.K = K  this.M = M   this.W = W   this.P = P   this.B = B   this.CodingTechnique = CodingTechnique   this.D1 = D1   this.D2 = D2   this.Roothash = Roothash   this.DataBlockList = DataBlockList   this.ParityBlockList = ParityBlockList')
  key ++
  totalQueries ++
  lastTenSeconds ++
  queriesPerSecond ++
  setImmediate(() => queryLoop(db))
}

// Start
console.log("Starting IPFS daemon...")

const repoConf = {
  storageBackends: {
    blocks: DatastoreLevel,
  },
}

const ipfs = new IPFS({
  repo: new IPFSRepo('./orbitdb/benchmarks/ipfs', repoConf),
  start: false,
  EXPERIMENTAL: {
    pubsub: false,
    sharding: false,
    dht: false,
  },
})

ipfs.on('error', (err) => console.error(err))

ipfs.on('ready', async () => {
  const run = async () => {
    try {
      const orbit = await OrbitDB.createInstance(ipfs,{ directory: './orbitdb/benchmarks' })
      const db = await orbit.keyvalue('orbit-db.benchmark', {
        replicate: false,
      })

      // Metrics output
      setInterval(() => {
        seconds ++
        if(seconds % 10 === 0) {
          console.log(`--> Average of ${lastTenSeconds/10} q/s in the last 10 seconds`)
          if(lastTenSeconds === 0)
            throw new Error("Problems!")
          lastTenSeconds = 0
        }
        console.log(`${queriesPerSecond} queries per second, ${totalQueries} queries in ${seconds} seconds (Oplog: ${db._oplog.length})`)
        queriesPerSecond = 0
      }, 1000)
      // Start the main loop
      queryLoop(db)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }

  run()
})