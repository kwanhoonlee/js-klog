var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient('localhost', '5001', { protocol: 'http' })


// ipfs.object.new('unixfs-dir', (err, cid) => {
//     if (err) {
//       throw err
//     }
//     console.log(cid.toString())
//     // Logs:
//     // QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn
//   })
// const link = {
//     name: 'Qmef7ScwzJUCg1zUSrCmPAz45m8uP5jU7SLgt2EffjBmbL',
//     size: 37,
//     cid: new CID('Qmef7ScwzJUCg1zUSrCmPAz45m8uP5jU7SLgt2EffjBmbL')
//   };

// ipfs.object.patch.addLink(link, {
//     name: 'some-link',
//     size: 10,
//     cid: new CID('QmPTkMuuL6PD8L2SwTwbcs1NPg14U8mRzerB1ZrrBrkSDD')
//   }, (err, cid) => {
//     if (err) {
//       throw err
//     }
//     // cid is CID of the DAG node created by adding a link
//   })

// const buf = new Buffer.from('a serialized object')

// ipfs.block.put(buf, (err, block) => {
//   if (err) { throw err }
//   // Block has been stored

//   console.log(block.data.toString())
//   // Logs:
//   // a serialized object
//   console.log(block.cid.toBaseEncodedString())
//   // Logs:
//   // the CID of the object
// })

// const CID = require('cids')
// const buf = new Buffer('another serialized object')
// const cid = new CID(1, 'dag-pb', new Buffer.from('QmcnVGQ3bzfMpTMAXfJvZ7YpywZP3ZkRijGr6BomrfcVLR'))

// ipfs.block.put(blob, cid, (err, block) => {
//   if (err) { throw err }
//   // Block has been stored

//   console.log(block.data.toString())
//   // Logs:
//   // a serialized object
//   console.log(block.cid.toBaseEncodedString())
//   // Logs:
//   // the CID of the object
// })


// const multihash = 'QmPb5f92FxKPYdT3QNBd1GKiL4tZUXUrzF4Hkpdr3Gf1gK'

// ipfs.object.data(multihash, (err, data) => {
//   if (err) {
//     throw err
//   }
//   console.log(data.toString())
//   // Logs:
//   // some data
// })

// example obj
const obj = {
    a: 1,
    b: [1, 2, 3],
    c: {
      ca: [5, 6, 7],
      cb: 'foo'
    }
  }
  
  ipfs.dag.put(obj, { format: 'dag-cbor', hashAlg: 'sha2-256' }, (err, cid) => {
    console.log(cid.toBaseEncodedString())
    // zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5
  })
  
  function errOrLog(err, result) {
    if (err) {
      console.error('error: ' + err)
    } else {
      console.log(result.value)
    }
  }

//   ipfs.dag.get('zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5/a', errOrLog)
//   // Logs:
//   // 1
  
//   ipfs.dag.get('zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5/b', errOrLog)
//   // Logs:
//   // [1, 2, 3]
  
//   ipfs.dag.get('zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5/c', errOrLog)
//   // Logs:
//   // {
//   //   ca: [5, 6, 7],
//   //   cb: 'foo'
//   // }
  
//   ipfs.dag.get('zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5/c/ca/1', errOrLog)
//   // Logs: