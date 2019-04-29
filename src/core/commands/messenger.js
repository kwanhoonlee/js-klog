var socket = require('socket.io-client')('http://localhost:3999')

function sendMessages(type, message){
    console.log(type)
    switch (type) {
        
        case 'meta':
            socket.emit(type, message)
            break

        case 'log':
            socket.emit(type, message)
        
            // message.forEach(function(msg){
            //     console.log(msg)
            //     socket.emit(type, msg)
            // })
            break
        case 'job' :
            socket.emit(type, message)
            break
    }    
    socket.disconnect()
}

module.exports = {
    sendMessages : sendMessages
}