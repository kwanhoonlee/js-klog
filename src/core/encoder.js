var exec = require('child_process').exec,child;

function encode(fname){

    cmd = concatFlag(fname)

    child = exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

function concatFlag(fname){

    const encoder = "encoder"
    const options = {
        K : "8",
        M : "4",
        CondingTechnique : "cauchy_orig",
        W : "8",
        P : "1024",
        B : "0"
    }

    cmd = encoder.concat(" ", fname)

    for (var key in options){
        cmd = cmd.concat(" ", options[key])
    }

    return cmd;
}

encode("add.js")
module.exports = encode