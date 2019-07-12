var execSync = require('child_process').execSync;
const fs = require('fs')
const parser = require('../../utils/parser')

function decode(fname){
    const decoder = "decoder"
    cmd = decoder.concat(" ", fname)

    execSync(cmd, function(err, stdOut, stdErr){
        if (stdErr){
            console.log(stdErr)
        }
    })
}

function createDecodingConfigurationFile(mi){
    var codingPath = './Coding/'
    var mfname = parser.getMetaFilename(mi.FileName)
    var es = mi.FileName.concat('\n', mi.FileSize, '\n', mi.K , ' ', mi.M, ' ', mi.WordSize, ' ', mi.PacketSize, ' ', mi.BufferSize, '\n', mi.CodingTechnique, '\n', mi.D1, '\n', mi.D2, '\n')
    fs.writeFileSync(codingPath.concat(mfname), es, 'utf8')
}

module.exports = {
    decode:decode,
    createDecodingConfigurationFile:createDecodingConfigurationFile
}