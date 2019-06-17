const ipfsClient = require('ipfs-http-client')

config = {
    host:"localhost",
    port:"5001",
    protocol:"http",
}

const ipfs = ipfsClient(config.host, config.port, {protocol:config.protocol})

async function getBlockList(cid){
    var mh = await ipfs.ls(cid)
    var mhList = []

    if (mh.length != 0){    
        mh.forEach(function(e){
            mhList.push(e.hash)    
        })
    }
    
    return mhList
}


async function getDataBlockList(cid){
    var mhList = await getBlockList(cid)
    var lfList = []
    var dbList = []

    if (mhList.length != 0 ){
        for (var i=0; i<mhList.length; i++){
            var lf = await getBlockList(mhList[i])
            lf.forEach(function(e){
                lfList.push(e)
            })
        }
        
        var sNumber = Math.ceil(lfList.length / 8 )
        for (var i = 0; i < 8; i ++ ){
            if (i != 0 ){
                dbList.push(lfList.slice(i*lfList - 1, (i+1)*sNumber))
            }else {
                dbList.push(lfList.slice(i, sNumber))
            }
        }
        return dbList
    }
    
}

async function test(){
    a = await getDataBlockList("QmT4xRTR7LCXHeJJ87npTeRmiwy5ifZpWinW13Gtab2aZ9")
    console.log(a)
}
test()
