var exec = require('child_process').exec,child;


function decode(fname){
    const decoder = "decoder"
    cmd = decoder.concat(" ", fname)

    child = exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

module.exports = decode
