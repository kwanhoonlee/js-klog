
function splitBlockName(fname){
    var b = fname.split("_")
    return b
}

function splitExtension(fname){
    var e = fname.split('.')
    return e
}

module.exports = {
    splitBlockName : splitBlockName,
    splitExtension : splitExtension
}
// console.log(splitBlockName('helloworld_meta.txt'))
// console.log(splitExtension('helloworld_meta.mp4'))