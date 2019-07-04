// Opens or creates the queue specified by key 31337
var queue = require('svmq').open(31337);
// OR
var MessageQueue = require('svmq');
var queue = new MessageQueue(31337);

queue.on('data', (data)=>{
   console.log('Popped message: ' + data.toString());
})
