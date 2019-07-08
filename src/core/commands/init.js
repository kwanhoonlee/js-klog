var exec = require('child_process').exec;
var spawn = require('child_process').spawn,
    cluster = spawn('ipfs-cluster-service', ['init', '-s'])
var args = process.argv

function mkdir(){
    cmd = 'sh ../../bin/create.sh'

    exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

function klogInit(){
    const cmd = 'ipfs'.concat(' ', 'init')
    exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })

    cluster.stdout.on('data', function(data){
        cluster.stdin.write(args[2])
        cluster.stdin.end()
        setTimeout(function(){
            cluster.kill()
        }, 5000)
    })
}

klogInit()

module.exports = {
    klogInit:klogInit
}


