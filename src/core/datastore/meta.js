const test = require('./orbitdb')

let m = new test.DB('keyvalue', 'meta', '', '6002', '6003')
// m.address = 'helloworld'
// console.log(m)

var metaInfo = class{  

    constructor(Fname, Fsize, K, M, W, P, B, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList){
        this.Fname = Fname
        this.Fsize = Fsize
        this.K = K
        this.M = M
        this.W = W
        this.P = P
        this.B = B
        this.CodingTechnique = CodingTechnique
        this.D1 = D1
        this.D2 = D2
        this.Roothash = Roothash
        this.DataBlockList = DataBlockList
        this.ParityBlockList = ParityBlockList
    }  
    toJSON(){
        let {Fname, Fsize, K, M, W, P, B, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList} = this

        return {Fname, Fsize, K, M, W, P, B, CodingTechnique, D1, D2, Roothash, DataBlockList, ParityBlockList}
    }
}


// let mi = new metaInfo('helloworld.txt', '234', '8', '4', '8', '1024', '0', 'cauchy_orig', '0', '0', 'Qm*', ['Qm1', 'Qm2'], ['Qm3', 'Qm4'])

// console.log(mi.toJSON())

module.exports = {
    mi : metaInfo
}