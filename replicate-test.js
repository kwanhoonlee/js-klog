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

    // const value = await db.get('hello')
    // console.log(value)
    // const hash = db.get('zdpuAvWVNGwbkmk3C77mSrFPSWw4b23roFnzmXPk6WH3zS7FJ')
    // console.log(hash)
    // const db = await orbitdb.open('/orbitdb/zdpuAwcRbFyvTFZzCurABByCXodUjBtYDgDeF5vaGPeeTsQM5/test')
    // a = await db.get('zdpuAx7CGyNKZdhdgbvE9esghzJS4ZafGFPA4zwTsArDE8DRq')

    // console.log(a)
})
var queue = [];

// ipfs.on('ready', async() => {
// })

// async function createDB(){

// }