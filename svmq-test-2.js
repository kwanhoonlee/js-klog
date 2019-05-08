// OR
var MessageQueue = require('svmq');
var queue = new MessageQueue(31337);

for (var i=0; i<1; i++){

 queue.push(JSON.stringify({type:"eventlog", data:"helloworld"}), (err, result) => {
  // This callback is optional; it is called once the message is placed in the queue.
   console.log('Message pushed');
 });
} 
