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
        }, 10000)      
    })
}

async function findProviders(cids){
    const promise = cids.map(cid => find(cid))
    var cidList = []

    await Promise.all(promise).then(function(countList){      
        for(const count of countList){
            cidList.push(count)
        }       
    })

    return new Promise(function (resolve){
        resolve(cidList)
    })
}

module.exports = {
    findProviders : findProviders
}