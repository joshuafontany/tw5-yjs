/*\
title: $:/plugins/joshuafontany/tw5-yjs/MultiServer.js
type: application/javascript
module-type: library


\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.node) {
  const Server = require("$:/core/modules/server/server.js").Server;
  const querystring = require("querystring");

/*
  A simple node server for Yjs, extended from the core server module
  options: 
*/
function MultiServer(options) {
  Server.call(this, options);
  // Reserve a connetion to the httpServer
  this.httpServer = null;
  // Initialise admin authorization principles
	var authorizedUserName = (this.get("username") && this.get("password")) ? this.get("username") : null;
  this.authorizationPrincipals['admin'] = (this.get("admin") || authorizedUserName).split(',').map($tw.utils.trim);
  // Add all the routes, this also adds authorization priciples for each wiki
  //this.addAllRoutes();
}

MultiServer.prototype = Object.create(Server.prototype);
MultiServer.prototype.constructor = MultiServer;

MultiServer.prototype.defaultVariables = Server.prototype.defaultVariables;

MultiServer.prototype.isAdmin = function(username) {
  if(!!username) {
    return this.isAuthorized("admin",username);
  } else {
    return null;
  }
}

MultiServer.prototype.getUserAccess = function(username,wikiName) {
  wikiName = wikiName || 'RootWiki';
  if(!!username) {
      let type, accessPath = (wikiName == 'RootWiki')? "" : wikiName+'/';
      type = (this.isAuthorized(accessPath+"readers",username))? "readers" : null;
      type = (this.isAuthorized(accessPath+"writers",username))? "writers" : type;
      type = (this.isAuthorized("admin",username))? "admin" : type;
      return type;
  } else {
    return null;
  }
}

MultiServer.prototype.requestHandler = function(request,response,options) {
  options = options || {};
  // Test for OPTIONS
  if(request.method === 'OPTIONS') {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE"
    })
    response.end()
    return
  }debugger;
  // Compose the options object
  options.wiki = $tw.Yjs.Wikis.get(options.wikiName);;
  // Call the parent method
  Object.getPrototypeOf(MultiServer.prototype).requestHandler.call(this,request,response,options);
};

MultiServer.prototype.listen = function(port,host,prefix) {
  this.httpServer = Server.prototype.listen.call(this,port,host,prefix);
  let self = this;
  this.httpServer.on('upgrade', function(request,socket,head) {
    if($tw.Yjs.wsServer && request.headers.upgrade === 'websocket') {
      // Verify the client here
      let state = self.verifyUpgrade(request);
      if(state){
        $tw.Yjs.wsServer.handleUpgrade(request,socket,head,function(ws) {
          $tw.Yjs.wsServer.emit('connection',ws,request,state);
        });
      } else {
        console.log(`ws-server: Unauthorized Upgrade GET ${request.url}`);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
    }
  });
	return this.httpServer
};

MultiServer.prototype.verifyUpgrade = function(request) {
  if(request.url.indexOf("wiki=") !== -1
  && request.url.indexOf("session=") !== -1) {
    // Compose the state object
    var state = {};
    state.server = this;
    state.ip = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0]:
      request.connection.remoteAddress;
    state.serverAddress = this.protocol + "://" + this.httpServer.address().address + ":" + this.httpServer.address().port;
    state.urlInfo = new $tw.Yjs.url(request.url,state.serverAddress);
    state.pathPrefix = request.pathPrefix || this.get("path-prefix") || "";
    // Get the principals authorized to access this resource
    var authorizationType = "readers";
    // Check whether anonymous access is granted
    state.allowAnon = this.isAuthorized(authorizationType,null);
    // Authenticate with the first active authenticator
    let fakeResponse = {
      writeHead: function(){},
      end: function(){}
    }
    if(this.authenticators.length > 0) {
      if(!this.authenticators[0].authenticateRequest(request,fakeResponse,state)) {
        // Bail if we failed (the authenticator will have -not- sent the response)
        return false;
      }		
    }
    // Authorize with the authenticated username
    if(!this.isAuthorized(authorizationType,state.authenticatedUsername)) {
      return false;
    }
    state.sessionId = state.urlInfo.searchParams.get("session");
    if($tw.Yjs.hasSession(state.sessionId)) {
      let session = $tw.Yjs.getSession(state.sessionId);
      return state.authenticatedUsername == session.authenticatedUsername
        && state.urlInfo.searchParams.get('wiki') == session.wikiName
        && state
    }
  } else {
    return false;
  }
};

/*
  Log each wiki's authorizationPrincipals as `${wikiName}\readers` & `${wikiName}\writers`.
  The routes should load the wiki if it hasn't loaded already.
*/
MultiServer.prototype.addWikiRoutes = function(inputObject,prefix) {
  if(typeof inputObject === 'object') {
    let self = this,
      readers = this.authorizationPrincipals[(prefix)? prefix+"/readers": "readers"],
      writers = this.authorizationPrincipals[(prefix)? prefix+"/writers": "writers"],
      wikis = Object.keys(inputObject);
    wikis.forEach(function(wikiName) {
      let fullName = (!!prefix)? prefix + '/' + wikiName: wikiName;
      // Add the authorized principles
      if(!!inputObject[wikiName].readers) {
        readers = inputObject[wikiName].readers.split(',').map($tw.utils.trim);
      }
      if(!!inputObject[wikiName].writers) {
        writers = inputObject[wikiName].writers.split(',').map($tw.utils.trim);
      }
      self.authorizationPrincipals[fullName+"/readers"] = readers;
      self.authorizationPrincipals[fullName+"/writers"] = writers;
      // Setup the routes
      $tw.modules.forEachModuleOfType("wikiroute", function(title, routeDefinition) {
        if(typeof routeDefinition === 'function') {
          self.addRoute(routeDefinition(fullName));
        }
      });
      $tw.modules.forEachModuleOfType("fileroute", function(title, routeDefinition) {
        if(typeof routeDefinition === 'function') {
          self.addRoute(routeDefinition(fullName));
        }
      });
      $tw.Yjs.loadWiki(fullName);
      $tw.Yjs.logger.log("Added route " + String(new RegExp('^\/' + fullName + '\/?$')))
    })
  }
};

// This removes all but the root wiki from the routes
MultiServer.prototype.clearRoutes = function() {
  // Remove any routes that don't match the root path
  this.routes = this.routes.filter(function(thisRoute) {
    return String(thisRoute.path) === String(/^\/$/) || String(thisRoute.path) === String(/^\/favicon.ico$/);
  });
  // Remove any added authorizationPrinciples
  let baseTypes = ["admin","readers","writers"]
  let clearedPrinciples = {};
  Object.keys(this.authorizationPrinciples).forEach(function(thisType) {
    if(baseTypes.indexOf(thisType) !== -1) {
      clearedPrinciples[thisType] == authorizatonPrinciples[thisTypes];
    };
  });
  this.authorizationPrinciples = clearedPrinciples;
}

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

exports.MultiServer = MultiServer;

exports.WebSocketServer = WebSocketServer;



}
})();