var MessageQueue = require('svmq')
var queue = new MessageQueue(31337)

async function sendMessages(type, data){
    var d = JSON.stringify({type:type, data:data})
    await queue.push(d)
}

module.exports = {
    sendMessages : sendMessages
}