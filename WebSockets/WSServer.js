/*\
title: $:/plugins/joshuafontany/yjs/WSServer.js
type: application/javascript
module-type: library


\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.node) {

/*
  A simple websocket server extending the `ws` library
  options: 
*/
function WebSocketServer(options) {
  Object.assign(this, new $tw.Yjs.ws.Server(options));
  // Set the event handlers
  this.on('listening',this.serverOpened);
  this.on('close',this.serverClosed);
  this.on('connection',$tw.Yjs.handleWSConnection);
}

WebSocketServer.prototype = Object.create(require('./External/ws/ws.js').Server.prototype);
WebSocketServer.prototype.constructor = WebSocketServer;

WebSocketServer.prototype.defaultVariables = {

};

WebSocketServer.prototype.serverOpened = function() {

}

WebSocketServer.prototype.serverClosed = function() {

}

WebSocketServer.prototype.isAdmin = function(username) {
  if(!!username && !!$tw.Yjs.server) {
    return $tw.Yjs.server.isAuthorized("admin",username);
  } else {
    return null;
  }
}

WebSocketServer.prototype.getUserAccess = function(username,wikiName) {
  wikiName = wikiName || 'RootWiki';
  if(!!username && !!$tw.Yjs.server) {
      let type, accessPath = (wikiName == 'RootWiki')? "" : wikiName+'/';
      type = ($tw.Yjs.server.isAuthorized(accessPath+"readers",username))? "readers" : null;
      type = ($tw.Yjs.server.isAuthorized(accessPath+"writers",username))? "writers" : type;
      type = ($tw.Yjs.server.isAuthorized("admin",username))? "admin" : type;
      return type;
  }
  return null;
}

exports.WebSocketServer = WebSocketServer;

}