// const IPFS = require('ipfs')
// const OrbitDB = require('orbit-db')

// const ipfsOptions = {
// 	EXPERIMENTAL: {
// 		pubsub:true
// 	}
// }

// const ipfs = new IPFS(ipfsOptions)
// ipfs.once('ready', async () => {
// 	const orbitdb = await OrbitDB.createInstance(ipfs)
// 	const db = await orbitdb.eventlog('helloworld')
// 	console.log(db.address.toString()) 
// 	// await orbitdb.stop()
// 	// await ipfs.stop
// //	await orbitdb.disconnect()
//  	ipfs.stop(() => {
// 	//	ipfs.end()
// 		console.log('node stopped')
// 	})
// })

// // ipfs.on('stop', () => {
// // 	console.log('node stopped')
// // })

const ipfsClient = require('ipfs-http-client')
// const utils = require('../../utils/')
// const encoder = require('./encoder')
// const sender = require('./messenger')
// const Meta = require('../datastore/meta')
const fs = require('fs')

config = {
    host:"localhost",
    port:"5001",
    protocol:"http",
}

const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol})

// const a = ipfs.add("helloworld")
async function test(){
	f = fs.readFileSync('atom-mac.zip')
	let h = await ipfs.add(f)
	// console.log(h[0].path)
	const stream = ipfs.lsPullStream(h[0].path)
	console.log(h[0].path)
	let middle = []
	
	await ipfs.ls(h[0].path, function (err, files) {
		files.forEach((file) => {
		  console.log(file.hash)
		middle.push(file.hash)
		console.log(middle)
		})
	})
	b = await ipfs.dag.get(h[0].path)
	console.log(b)
	// b = await ipfs.ls(h[0].path)
	
}
test()