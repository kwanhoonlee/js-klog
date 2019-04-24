const test = require('./orbitdb')

let m = new test.DB('keyvalue', 'meta', '', '6002', '6003')
m.address = 'helloworld'
console.log(m)

var metaInfo = class{
    constructor(fname, fsize, K, M, W, P, B, codingTechnique, d1, d2, roothash, dataBlockList, parityBlockList){
        this.fname = fname
        this.fsize = fsize
        this.K = K
        this.M = M
        this.W = W
        this.P = P
        this.B = B
        this.codingTechnique = codingTechnique
        this.d1 = d1
        this.d2 = d2
        this.roothash = roothash
        this.dataBlockList = dataBlockList
        this.parityBlockList = parityBlockList
    }
}


// let mi = new metaInfo('helloworld.txt', '234', '8', '4', '8', '1024', '0', 'cauchy_orig', '0', '0', 'Qm*', ['Qm1', 'Qm2'], ['Qm3', 'Qm4'])
// console.log(mi)