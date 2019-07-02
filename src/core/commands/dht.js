var spawn = require('child_process').spawn;

function find(cid){
    var cmd = spawn('ipfs', ['dht', 'findprovs', cid])
    var count = 0

    cmd.stdout.on('data', function(data){
        if (data.toString().length != 1){
            count = 1
        }
    })

    return new Promise (resolve => {
        setTimeout(function(){
            cmd.kill()
            resolve(count)
        }, 3000)      
    })
}

async function findProviders(cids){
    const promise = cids.map(cid => find(cid))
    var aliveCIDList = []

    await Promise.all(promise).then(function(num){      
        for(const i of num){
            aliveCIDList.push(i)
        }       
    })

    return new Promise(function (resolve){
        resolve(aliveCIDList)
    })
}

module.exports = {
    findProviders : findProviders
}