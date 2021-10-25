/*\
title: $:/plugins/commons/yjs/commands/ws-listen.js
type: application/javascript
module-type: command

Serve tiddlers using a two-way websocket server over http

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.info = {
	name: "ws-listen",
	synchronous: true,
	namedParameterMode: true,
	mandatoryParameters: []
};

const MultiServer = require('$:/plugins/commons/multiserver/multiserver.js').MultiServer,
	WebSocketServer = require('../wsserver.js').WebSocketServer;

const Command = function (params, commander, callback) {
	let self = this;
	this.params = params;
	this.commander = commander;
	this.callback = callback;
};

Command.prototype.execute = function () {
	if(!$tw.boot.wikiTiddlersPath) {
		$tw.utils.warning("Warning: Wiki folder '" + $tw.boot.wikiPath + "' does not exist or is missing a tiddlywiki.info file");
		return;
	}
	let self = this;
	// Set up http(s) server
	this.server = new MultiServer({
		wiki: this.commander.wiki,
		requiredPlugins: [
			"$:/plugins/commons/multiserver",
			"$:/plugins/commons/yjs",
			"$:/plugins/commons/yjswebsockets",
			"$:/plugins/tiddlywiki/filesystem"
		].join(','),
		variables: self.params
	});
	// Listen
	let nodeServer = this.server.listen();
	// Set up the the WebSocketServer
	$tw.wsServer = new WebSocketServer({
		clientTracking: false,
		noServer: true, // We roll our own Upgrade
		httpServer: nodeServer
	});
	// Handle upgrade events
	nodeServer.on('upgrade', function (request, socket, head) {
		if(request.headers.upgrade === 'websocket') {
			// Verify the client here
			let options = self.server.findStateOptions(request);
			options.server = self.server;
			let state = $tw.wsServer.verifyUpgrade(request, options);
			if(state) {
				$tw.wsServer.handleUpgrade(request, socket, head, function (ws) {
					$tw.wsServer.emit('connection', ws, request, state);
				});
			} else {
				$tw.utils.log(`ws-server: Unauthorized Upgrade GET ${$tw.boot.origin+request.url}`);
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
				return;
			}
		}
	});
	$tw.utils.log(`TiddlyWiki v${$tw.version} with TW5-Yjs Websockets`);
	$tw.hooks.invokeHook("th-server-command-post-start", this.server, nodeServer, "tiddlywiki");
	return null;
};

exports.Command = Command;