/*\
title: $:/plugins/joshuafontany/tw5-yjs/server/wsserver.js
type: application/javascript
module-type: library


\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.node) {
  const WS = require('../external/ws/ws.js');

/*
  A simple websocket server extending the `ws` library
  options: 
*/
function WebSocketServer(options) {
  Object.assign(this, new WS.Server(options));
  // Setup the httpServer
  this.server = options.server || null;
  // Set the event handlers
  this.on('listening',this.serverOpened);
  this.on('close',this.serverClosed);
  this.on('connection',this.handleWSConnection);
}

WebSocketServer.prototype = Object.create(require('../external/ws/ws.js').Server.prototype);
WebSocketServer.prototype.constructor = WebSocketServer;

WebSocketServer.prototype.defaultVariables = {

};

WebSocketServer.prototype.serverOpened = function() {

}

WebSocketServer.prototype.serverClosed = function() {

}

WebSocketServer.prototype.handleWSConnection = function() {

}

exports.WebSocketServer = WebSocketServer;

}
