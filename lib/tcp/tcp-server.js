'use strict';

const os = require('os')
	, EventEmitter = require('events').EventEmitter
	, net = require('net')
	, winston = require('winston')
	, TcpChatClient = require('./tcp-chat-client.model');

// opts: port
// emits: client, connected, error, disconnected

class TcpServer extends EventEmitter {
	constructor() {
		super();
		this._eventBus = require('../eventbus');
		this._config = require('./tcp-server.config');
		winston.info('[TcpServer] connecting on %d', this._config.port);
		this._server = net.createServer();
		this._server.listen(this._config.port);

		this._server.on('connection', socket => {
			winston.info('[TcpServer] received client connection from %s:%d', socket.remoteAddress, socket.remotePort);
			this._eventBus.emit('server:client', new TcpChatClient(socket));
		});
		this._server.on('listening', () => {
			winston.info('[TcpServer] connected on %d', this._config.port);
			this._eventBus.emit('server:connected');
		});
		this._server.on('error', err => {
			winston.error('[TcpServer] error %s', err.toString());
			this._eventBus.emit('server:error', err);
		});
		this._server.on('close', () => {
			winston.info('[TcpServer] disconnected on %d', this._config.port);
			this._eventBus.emit('server:disconnected');
		});
	}

	disconnect() {
		winston.info('[TcpServer] disconnecting on %d', this._config.port);
		this._server.close();
	}
}

module.exports = new TcpServer();
