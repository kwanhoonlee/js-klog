var ipfsClient = require('ipfs-http-client')
const Unixfs = require('ipfs-unixfs')

var ipfs = ipfsClient('localhost', '5001', { protocol: 'http' })

// 1MB.txt root : QmTgiNyS3DdxmnTPSo5n7ZED6MRh4fQdsW5CWjBhA8aqM9
// leaf : QmRv4bXYMS9dCxcK7dySTvWqohrhACWaas9sUsFPrVDwmf
ipfs.dag.get('QmRv4bXYMS9dCxcK7dySTvWqohrhACWaas9sUsFPrVDwmf', async (err, d) => {
  console.log('CID : QmRv4bXYMS9dCxcK7dySTvWqohrhACWaas9sUsFPrVDwmf')
  console.log(d.value)
  console.log(" ")
  console.log("data :")
  console.log(Unixfs.unmarshal(d.value.data).data.toString())
  console.log(" ")
  console.log("_links : ")
  console.log( d.value.links)

  console.log(' ')
})

