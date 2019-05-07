var mq = require('mqemitter')
  , emitter = mq()
 
emitter.on('hello/+/world', function(message, cb) {
  // this will print { topic: 'hello/my/world', 'something': 'more' }
  console.log(message)
  cb()
})
 
emitter.on('hello/+', function(message, cb) {
  // this will not be called
  console.log(message)
  cb()
})

