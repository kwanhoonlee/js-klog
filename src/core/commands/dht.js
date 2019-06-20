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

// async function dht_test(){
//     var cids = ['QmRv4bXYMS9dCxcK7dySTvWqohrhACWaas9sUsFPrVDwmf', 'Qmf9Z15w8zcBjrVXhDT4XwNVUhAdxZTMaHPQCLPUSLMWod', 'QmaGGpFd31jfoxVemjMjCzmE58yETu3HAr1qCXV5gzbDno', 'QmQZJMLWk5n28RPF9yQXe6m9TQw5FCSXuFTstv175NhiP6' ]
//     const promise = cids.map(item => findProviders(item))
    
//     await Promise.all(promise).then(function(num){
//         var counter = 0
//         for(const i of num){
//             counter = counter + i
//         }
//         console.log(counter)
//     })
//     console.log('done')
// }
// dht_test()

module.exports = {
    findProvidersUsingCIDs : findProvidersUsingCIDs
}