var socket = require('socket.io-client')('http://localhost:3999')
function sendMessages(messages){

    socket.emit('message', messages)
    // messages.forEach(function(msg){
    //     socket.emit('message', msg)
    // })
    socket.disconnect()
}

module.exports = {
    sendMessages : sendMessages
}