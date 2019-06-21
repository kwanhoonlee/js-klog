var exec = require('child_process').exec,child;
const fs = require('fs')
const parser = require('../../utils/parser')

function decode(fname){
    const decoder = "decoder"
    cmd = decoder.concat(" ", fname)

    child = exec(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

function createMetaFile(mi){
    var mfname = parser.splitExtension(mi.FileName)[0].concat('_meta.txt')
    var data = mi.FileName.concat('\n', mi.FileSize, '\n', mi.K , ' ', mi.M, ' ', mi.WordSize, ' ', mi.PacketSize, ' ', mi.BufferSize, '\n', mi.CodingTechnique, '\n', mi.D1, '\n', mi.D2, '\n')
    fs.writeFileSync('./Coding/'.concat(mfname), data, 'utf8')
}

module.exports = {
    decode:decode,
    createMetaFile:createMetaFile
}