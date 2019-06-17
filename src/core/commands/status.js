var ipfsClusterAPI = require('ipfs-cluster-api')
var ipfsCluster = ipfsClusterAPI('localhost', 9094, {protocol: 'http'})

async function test() {
    a = await ipfsCluster.status()
    console.log(a)
}

test()
