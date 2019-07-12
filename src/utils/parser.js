
function splitBlockName(fname){
    var b = fname.split("_")
    return b
}

function splitExtension(fname){
    var e = fname.split('.')
    return e
}

function getExtension(fname) {
    return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2);
}

function getFilenameWithoutExtension(fname){
    return fname.split('.'.concat(getExtension(fname)))[0]
}

function getMetaFilename(fname){
    return getFilenameWithoutExtension(fname).concat('_meta.txt')
}

module.exports = {
    splitBlockName : splitBlockName,
    splitExtension : splitExtension,
    getExtension : getExtension,
    getFilenameWithoutExtension : getFilenameWithoutExtension,
    getMetaFilename : getMetaFilename
}
