const fs = require('fs'); 

var fname = 'test.csv'

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

const endTime = process.hrtime(a)[1]/(Math.pow(10, 6))
appendData()
