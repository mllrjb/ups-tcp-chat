'use strict';

const os = require('os')
	, EventEmitter = require('events').EventEmitter
	, net = require('net')
	, winston = require('winston')
	, TcpChatClient = require('./tcp-chat-client.model');

// opts: port
// emits: client, connected, error, disconnected

class TcpServer extends EventEmitter {
	constructor(opts) {
		super();
		this._opts = opts;
		winston.info('[TcpServer] connecting on %d', opts.port);
		this._server = net.createServer();
		this._server.listen(opts.port);

		this._server.on('connection', socket => {
			winston.info('[TcpServer] received client connection from %s:%d', socket.remoteAddress, socket.remotePort);
			this.emit('client', new TcpChatClient(socket));
		});
		this._server.on('listening', () => {
			winston.info('[TcpServer] connected on %d', opts.port);
			this.emit('connected');
		});
		this._server.on('error', err => {
			winston.error('[TcpServer] error %s', err.toString());
			this.emit('error', err);
		});
		this._server.on('close', () => {
			winston.info('[TcpServer] disconnected on %d', opts.port);
			this.emit('disconnected');
		});
	}

	disconnect() {
		winston.info('[TcpServer] disconnecting on %d', this._opts.port);
		this._server.close();
	}
}

module.exports = TcpServer;
