const test = require('./orbitdb')

let m = new test.DB('keyvalue', 'meta', '', '6002', '6003')

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

module.exports = {
    mi : metaInfo
}