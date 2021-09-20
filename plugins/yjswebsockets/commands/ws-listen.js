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
    WebSocketServer = require('../server/wsserver.js').WebSocketServer;

const Command = function(params,commander,callback) {
  let self = this;
  this.params = params;
  this.commander = commander;
  this.callback = callback;
};

Command.prototype.execute = function() {
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
    server: nodeServer
  });
  $tw.utils.log(`TiddlyWiki v${$tw.version} with TW5-Yjs Websockets`);
	$tw.hooks.invokeHook("th-server-command-post-start",this.server,nodeServer,"tiddlywiki");
  return null;
};

exports.Command = Command;
