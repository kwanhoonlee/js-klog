
var socket = require('socket.io-client')('http://localhost:3999');

var items = ['item', 'item2', 'item3']

items.forEach(function(item){
    socket.emit('chat message', item)
}) 

function sendMessage(message)
// io.emit('chat message', 'helloworld')
// socket.on('event', function(){
//     socket.emit('chat message', "helloworld")
// })