var queue = require('message-queue')('redis');
 
var cats = queue.Subscribe({channel: 'cats'});
 
cats.on('message', function(coolCat){
  console.log('message: ' + JSON.stringify(coolCat));
});
