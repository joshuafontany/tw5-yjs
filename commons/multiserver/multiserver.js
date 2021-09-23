/*\
title: $:/plugins/commons/multiserver/multiserver.js
type: application/javascript
module-type: library


\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.node) {
  const fs = require("fs"),
    path = require("path"),
    Server = require("$:/core/modules/server/server.js").Server;

/*
  A simple node server for Yjs, extended from the core server module
  options: 
*/
function MultiServer(options) {
  // Initialise the server settings
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(path.join($tw.boot.wikiPath, "settings", "settings.json")));
  } catch (err) {
    $tw.utils.log("Server Settings Error - using default values.");
    settings = {};
  }
  settings = $tw.utils.extend(options.wiki.getTiddlerData("$:/config/commons/multiserver",{}),settings);
  options.variables = $tw.utils.extend(settings,options.variables);
  Server.call(this, options);
  // Initialise admin authorization principles
	var authorizedUserName = (this.get("username") && this.get("password")) ? this.get("username") : null;
  this.authorizationPrincipals["admin"] = (this.get("admin") || authorizedUserName).split(',').map($tw.utils.trim);
  // Setup the root route
  $tw.utils.loadSateRoot(this.get("path-prefix") || "");
  // Add all the routes, this also loads and adds authorization priciples for each wiki
  this.addWikiRoutes($tw.boot.pathPrefix);
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


MultiServer.prototype.getUserAccess = function(username,pathPrefix) {
  pathPrefix = pathPrefix || '';
  if(!!username) {
      let type, accessPath = pathPrefix? pathPrefix+'/' : '';
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
  }
  // Check for a wikiState route
  options = this.findStateOptions(request,options);
  // Call the parent method
  Object.getPrototypeOf(MultiServer.prototype).requestHandler.call(this,request,response,options);
};

MultiServer.prototype.findStateOptions = function(request,options) {
  options = options || {};
  let potentialMatch = $tw;
  $tw.states.forEach(function(state,key) {
    var match = Object.prototype.toString.call(state.regexp) == '[object RegExp]' && state.regexp.exec(request.url);
    if(match) {
      potentialMatch = state;
    }
  });
  options.boot = potentialMatch.boot;
  options.wiki = potentialMatch.wiki;
  options.pathPrefix = potentialMatch.boot.pathPrefix;
  if(potentialMatch.boot.pathPrefix) {
		options.authorizationType = potentialMatch.boot.pathPrefix+"/"+(this.methodMappings[request.method] || "readers");
	}
	return options;
};

/*
  Load each wiki. Log each wiki's authorizationPrincipals as `${state.boot.pathPrefix}/readers` & `${state.boot.pathPrefix}/writers`.
*/
MultiServer.prototype.addWikiRoutes = function(pathPrefix) {
  let self = this,
      readers = this.authorizationPrincipals["readers"],
      writers = this.authorizationPrincipals["writers"];
  // Setup the other routes
  $tw.utils.each($tw.boot.wikiInfo.serveWikis,function(group,groupPrefix){
    $tw.utils.each(group,function(serveInfo) {
      let state = $tw.utils.loadStateWiki(serveInfo,pathPrefix,groupPrefix);
      if (state) {
        // Add the authorized principal overrides
        if(!!serveInfo.readers) {
          readers = serveInfo.readers.split(',').map($tw.utils.trim);
        }
        if(!!serveInfo.writers) {
          writers = serveInfo.writers.split(',').map($tw.utils.trim);
        }
        self.authorizationPrincipals[`${state.boot.pathPrefix}/readers`] = readers;
        self.authorizationPrincipals[`${state.boot.pathPrefix}/writers`] = writers;
        $tw.utils.log("Added route " + state.boot.pathPrefix);
      };
    });
  });
};

exports.MultiServer = MultiServer;

}
