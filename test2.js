const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfsOptions = {
	EXPERIMENTAL: {
		pubsub:true
	}
}

const ipfs = new IPFS(ipfsOptions)
ipfs.once('ready', async () => {
	const orbitdb = await OrbitDB.createInstance(ipfs)
	const db = await orbitdb.eventlog('helloworld')
	console.log(db.address.toString()) 
	// await orbitdb.stop()
	// await ipfs.stop
//	await orbitdb.disconnect()
 	ipfs.stop(() => {
	//	ipfs.end()
		console.log('node stopped')
	})
})

// ipfs.on('stop', () => {
// 	console.log('node stopped')
// })
