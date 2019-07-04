var execSync = require('child_process').execSync;
var utils = require('../../utils')

function encode(fname){
    cmd = concatFlag(fname)

    execSync(cmd, async function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })

    return new Promise(resolve => {        
        var es = getErasureCodingSchema(fname)
        resolve(es)
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

// TODO: add exception for getting extension
function getErasureCodingSchema(fname){
    var parsed = utils.parser.splitExtension(fname)
    parsed.pop()
    var mfname = parsed.join('').concat(utils.files.name.mfExtension)  
    var f = utils.files.readMetaFile(mfname)
    f.pop()

    var es = []
    for (var i in f){
        if (i == 2) {
            tmp = f[i].split(' ')
            for (var j in tmp){
                es.push(tmp[j])
            }
        } else {
            es.push(f[i])
        }
    }

    return es
}

module.exports.encode = encode