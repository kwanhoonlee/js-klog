const test = require('./orbitdb')
const utils = require('../../utils')
// let m = new test.DB('keyvalue', 'meta', '', '6002', '6003')

var metaInfo = class{  
    constructor(FileName, FileSize, K, M, WordSize, PacketSize, BufferSize, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList,  ){
        this.FileName = FileName
        this.FileSize = FileSize
        this.K = K
        this.M = M
        this.WordSize = WordSize
        this.PacketSize = PacketSize
        this.BufferSize = BufferSize
        this.CodingTechnique = CodingTechnique
        this.D1 = D1
        this.D2 = D2
        this.Roothash = Roothash
        this.DataBlockList = DataBlockList
        this.ParityBlockList = ParityBlockList
    }  
    toJSON(){
        let {FileName, FileSize, K, M, WordSize, PacketSize, BufferSize, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList,  } = this

        return {FileName, FileSize, K, M, WordSize, PacketSize, BufferSize, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList,  }
    }
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

async function setMetaInfo(fname, rh, dbl, pbl){
    var es = await getErasureCodingSchema(fname)
    var mi = await new metaInfo()

    for (var i in es) {
        mi[Object.keys(mi)[i]] = es[i]
    }

    mi['Roothash'] = rh
    mi['DataBlockList'] = dbl
    mi['ParityBlockList'] = pbl
   
    return mi
}

module.exports = {
    metaInfo : metaInfo,
    setMetaInfo : setMetaInfo,
    getErasureCodingSchema : getErasureCodingSchema
}