/*\
title: $:/plugins/joshuafontany/yjs/Commands/ws-server.js
type: application/javascript
module-type: command

Serve tiddlers using a two-way websocket server over http

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.info = {
  name: "ws-server",
  synchronous: true,
	namedParameterMode: true,
	mandatoryParameters: []
};

exports.platforms = ["node"];

const MultiServer = require('../MultiServer.js').MultiServer,
  WebSocketServer = require('../WSServer.js').WebSocketServer;

const Command = function(params,commander,callback) {
  this.params = params;
  this.commander = commander;
  this.callback = callback;
};

Command.prototype.execute = function() {
  let self = this;
  if(!$tw.boot.wikiTiddlersPath) {
    $tw.utils.warning("Warning: Wiki folder '" + $tw.boot.wikiPath + "' does not exist or is missing a tiddlywiki.info file");
    return;
  }
  // Set up http(s) server as $tw.Yjs.server.httpServer
  let requiredPlugins = [
    "$:/plugins/joshuafontany/yjs",
    "$:/plugins/tiddlywiki/filesystem"
  ];
  let variables = $tw.utils.extend(self.params,$tw.Yjs.settings);
	$tw.Yjs.server = new MultiServer({
		wiki: this.commander.wiki,
    requiredPlugins: requiredPlugins,
		variables: variables
	});
	let httpServer = $tw.Yjs.server.listen();
  // Set up the the WebSocketServer
  $tw.Yjs.wsServer = new WebSocketServer({
    clientTracking: false, 
    noServer: true // We roll our own Upgrade
  });
  $tw.Yjs.logger.log(`TiddlyWiki v${$tw.version} with TW5-Yjs v${$tw.Yjs.version}`);
	$tw.hooks.invokeHook("th-server-command-post-start",httpServer,$tw.Yjs.server,"tiddlywiki");
  return null;
};

exports.Command = Command;

})();
