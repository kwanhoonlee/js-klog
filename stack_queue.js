const io = require('socket.io')(80);
var queue = [];
io.on('connection', (socket) => {
    
    console.log('a user connected');
  
    socket.on('chat message', (msg) => {
        queue.push(msg)

        var item = queue.shift()        
        console.log(queue.length, item)
    });
  
    socket.on('disconnect', () => {
        console.log(queue.length)
        console.log('user disconnected');
    });
  });
  