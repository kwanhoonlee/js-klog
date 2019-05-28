const fs = require('fs'); 

var fname = 'test.csv'
// var data = '123,456,789'

async function appendData(){
    var count = '1'
    var time = '1'
    var totalTime = '1'
    const startTime = process.hrtime()
    try { 
        var data = count.concat(',', time, ',', totalTime, '\n')
        fs.appendFileSync(fname, data, 'utf-8', function(err){
            console.log('added data,')
        })
    }
    catch(err){
        console.log(err)
    }
}
// var a = new Date()
const endTime = process.hrtime(a)[1]/(Math.pow(10, 6))
appendData()
// const b = window.performance.now()
// var b = new Date()
// console.log( process.hrtime(a), ())