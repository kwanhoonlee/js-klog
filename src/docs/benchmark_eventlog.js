'use strict'
const fs = require('fs')
const IPFS = require('ipfs')
const IPFSRepo = require('ipfs-repo')
const DatastoreLevel = require('datastore-level')
const OrbitDB = require('orbit-db')

// Metrics
let totalQueries = 0
let seconds = 0
let queriesPerSecond = 0
let lastTenSeconds = 0
let totalTime = 0
var fname = 'eventlog_get.csv'
var qfname = 'eventlog_get_avgQ.csv'

// Main loop
const queryLoop = async (db) => {
  var hash = await db.add('/pin/QmUrX8VAVF7WxbuEh61tv6Jka2V1z1iEkUxtYQnLm5J5eR/QmUrX8VAVF7WxbuEh61tv6Jka2V1z1iEkUxtYQnLm5J5')
  const startTime = process.hrtime()
  // console.log(await db.get(hash))
  const all = await db.iterator({limit:-1}).collect().map((e)=> e.payload.value)
  // console.log(all)
  const takenTime = process.hrtime(startTime)[1]/(Math.pow(10, 6))
  totalTime = totalTime + takenTime
  // console.log(takenTime)
  await appendData(fname, totalQueries, takenTime, totalTime)
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
      const db = await orbit.eventlog('orbit-db.benchmark', {
        replicate: false,
      })

      // Metrics output
      setInterval(() => {
        seconds ++
        if(seconds % 10 === 0) {
          console.log(`--> Average of ${lastTenSeconds/10} q/s in the last 10 seconds`)
          appendData(qfname, lastTenSeconds/10, '', '')
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

async function appendData(fname, query, time, totalTime){
  try { 
      var data = String(query).concat(',', String(time), ',', String(totalTime), '\n')
      fs.appendFileSync(fname, data, 'utf-8', function(err){
      })
  }
  catch(err){
      console.log(err)
  }
}