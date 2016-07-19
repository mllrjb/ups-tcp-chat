// 'use strict';

// const TcpServer = sut('lib/tcp/tcp-server')
//   , portastic = require('portastic')
//   , portRange = {
//     min: 8000,
//     max: 9000
//   };

// describe('SanityTest', () => {

//   var port;

//   before(done => {
//     portastic.find(portRange, (ports) => {
//       if (ports.length < 1) {
//         done('unable to find an open port in the range ' + 8000 + '-' + 9000);
//       } else {
//         port = ports[0];
//         done();
//       }
//     });
//   });

//   var server, client, rawClient;

//   beforeEach(done => {
//     server = new TcpServer({
//       port: port
//     });
//     server.on('client', (c) => {
//       client = c;
//     });
//     server.on('connected', () => {
//       rawClient = net.connect({
//         port: port
//       }, done);
//     });
//   });

//   afterEach(done => {
//     rawClient.on('close', () => {
//       server.disconnect();
//     });
//     server.on('disconnected', done;
//     rawClient.end();
//   });

//   it('should send and receive', () => {
    
//   });

// });

// // tcpServer.on('client', (client) => {
// //   client.on('message', (msg) => {
// //     console.log(client._id + ': ' + msg);
// //   });
// // });
