'use strict';

var os = require('os');

var net = require('net');
var sockets = [];
var guestId = 0;
var messages = [];

var server = net.createServer(function(socket) {
	// Increment
	guestId++;

	socket.nickname = 'Guest' + guestId;
	var clientName = socket.nickname;

	sockets.push(socket);

	// Log it to the server output
	console.log(clientName + ' joined this chat.');

	// Broadcast to others excluding this socket
	// broadcast(clientName, clientName + ' joined this chat.\n');

	socket.setEncoding('utf-8')

	// TODO: keep a buffer, load it with data, check it for crlf
	var bufferedData = '';

	function checkBuffer() {
		var endIdx = bufferedData.indexOf('\r\n');
		if (endIdx > -1) {
			console.log('got end!');
			var msg = bufferedData.substring(0, endIdx);
			console.log('msg: ' + msg);
			bufferedData = bufferedData.substring(endIdx + 2);
			messages.push(msg);
			checkBuffer();
		}
	}

	// When client sends data
	socket.on('data', function(data) {
		console.log('data: ' + data.toString());
		bufferedData += data;
		checkBuffer();
	});


	// When client leaves
	socket.on('end', function() {

		var message = clientName + ' left this chat\n';

		// Log it to the server output
		console.log(message);

		// close connection to client
		socket.end();

		// Remove client from socket array
		removeSocket(socket);

		// Notify all clients
		broadcast(clientName, message);
	});


	// When socket gets errors
	socket.on('error', function(error) {

		console.log('Socket got problems: ', error.message);

	});
});


// Broadcast to others, excluding the sender
function broadcast(from, message) {

	// If there are no sockets, then don't broadcast any messages
	if (sockets.length === 0) {
		console.log('Everyone left the chat');
		return;
	}

	// If there are clients remaining then broadcast message
	sockets.forEach(function(socket, index, array) {
		// Dont send any messages to the sender
		if (socket.nickname === from) return;

		socket.write(message);

	});

};

// Remove disconnected client from sockets array
function removeSocket(socket) {
	sockets.splice(sockets.indexOf(socket), 1);
};

// Listening for any problems with the server
server.on('error', function(error) {

	console.log('So we got problems!', error.message);

});

server.getMessages = function() {
	return messages;
}

server.nextMessage = function() {
	if (messages.length > 0) {
		// TODO: ugly
		return messages.shift();
	} else {
		return null;
	}
};

server.clearMessages = function() {
	messages = [];
}

module.exports = server;
