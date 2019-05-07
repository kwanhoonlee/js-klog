const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// myEmitter.once('newListener', (event, listener) => {
//     if (event === 'event') {
//       // Insert a new listener in front
//       myEmitter.on('event', () => {
//         console.log('B');
//       });
//     }
//   });
// myEmitter.on('event', () => {
// console.log('A');
// });
myEmitter.emit('event');
  // Prints:
  //   B
  //   A
// Ignored