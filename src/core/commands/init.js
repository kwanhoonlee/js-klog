var exec = require('child_process').exec;
var spawn = require('child_process').spawn,
    cluster = spawn('ipfs-cluster-service', ['init', '-s'])

function mkdir(){
    cmd = 'sh ../../bin/create.sh'

    exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

function ipfsClusterInit(cKey){
    cluster.stdout.on('data', function(data){
        cluster.stdin.write(cKey)
        cluster.stdin.end()
    })
}

ipfsClusterInit('eeaae2efbd05ae7863525be4da7046444a178b5ff17fb123828cc93dbaec08bd')

module.exports = {
    ipfsClusterInit:ipfsClusterInit
}


