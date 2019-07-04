const IPFS = require('ipfs')
const Unixfs = require('ipfs-unixfs')

const ipfsOptions = {
    EXPERIMENTAL:{
        pubsub:true
    },
    repo:process.env['HOME'].concat('/.k-log/js-ipfs/'),
    config: {
        Addresses: {
            Swarm: [
                "/ip4/0.0.0.0/tcp/6002",
                "/ip4/127.0.0.1/tcp/6003/ws"
            ]
        }
    }
}

const ipfs = new IPFS(ipfsOptions)

ipfs.on('ready', async() => {
    // ipfs.dag.get('QmXHyrnK8nEMds4HsQpPrqA2EBJrbcVdeLCfzS92cDKq3P', (err, d) => {
    //     console.log(Unixfs.unmarshal(d.value.data).data.toString())
    // })
    ipfs.dag.put(obj, { format: 'dag-cbor', hashAlg: 'sha2-256' }, (err, cid) => {
        console.log(cid.toBaseEncodedString())
        // zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5
      })
})
  