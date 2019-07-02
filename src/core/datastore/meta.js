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

async function setMetaInfo(es, rh, dbl, pbl){
    var mi = new metaInfo()

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
}