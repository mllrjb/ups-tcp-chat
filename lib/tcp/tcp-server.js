'use strict';

const os = require('os')
	, EventEmitter = require('events').EventEmitter
	, net = require('net')
	, TcpClient = require('./tcp-client.model');

// opts: port
// emits: client, connected, error, disconnected

class TcpServer extends EventEmitter {
	constructor(opts) {
		super();
		this._server = net.createServer();
		this._server.listen(opts.port);

		this._server.on('connection', socket => {
			this.emit('client', new TcpClient(socket));
		});
		this._server.on('listening', () => {
			this.emit('connected');
		});
		this._server.on('error', err => {
			this.emit('error', err);
		});
		this._server.on('close', () => {
			this.emit('disconnected');
		});
	}

	disconnect() {
		this._server.close();
	}
}

module.exports = TcpServer;
