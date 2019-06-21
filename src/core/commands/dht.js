var spawn = require('child_process').spawn;

function findProviders(cid){
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
            // console.log(cid)
            resolve(count)
        }, 2000)      
    })
}

async function findProvidersUsingCIDs(cids){
    const promise = cids.map(cid => findProviders(cid))
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
    findProvidersUsingCIDs : findProvidersUsingCIDs
}