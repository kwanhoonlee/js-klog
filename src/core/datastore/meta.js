const test = require('./orbitdb')

let m = new test.DB('keyvalue', 'meta', '', '6002', '6003')
// m.address = 'helloworld'
// console.log(m)

var metaInfo = class{  

    constructor(FileName, FileSize, K, M, WordSize, PacketSize, BufferSize, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList){
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
        let {FileName, FileSize, K, M, WordSize, PacketSize, BufferSize, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList} = this

        return {FileName, FileSize, K, M, WordSize, PacketSize, BufferSize, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList}
    }
}


// let mi = new metaInfo('helloworld.txt', '234', '8', '4', '8', '1024', '0', 'cauchy_orig', '0', '0', 'Qm*', ['Qm1', 'Qm2'], ['Qm3', 'Qm4'])

// console.log(mi.toJSON())

module.exports = {
    mi : metaInfo
}