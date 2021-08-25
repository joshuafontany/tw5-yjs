/*\
title: $:/core/modules/server/routes/get-wiki.js
type: application/javascript
module-type: route

GET /wikis/:route

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/wikis\/(.+)$/;

exports.handler = function(request,response,state) {
	var path = require("path"),
		fs = require("fs"),
		util = require("util"),
		wikiName = decodeURIComponent(state.params[0]),
		filename = path.resolve(state.boot.wikiPath,"files",wikiName),
		extension = path.extname(filename);
	debugger;
	if (wikiName == "RootWiki") {
		// Redirect to the root wiki
		response.writeHead(302,{
			Location: "/"
		});
		response.end();
	} else {
		
	}



	$tw.Yjs.loadWiki(wikiRoute,function(err,text) {
		var status,text,type = "text/plain";
		if(err) {
			console.log("Error accessing file " + filename + ": " + err.toString());
			status = 404;
			text = "Wiki '" + wikiName + "' not found";
		} else {
			status = 200;
			text = state.wiki.renderTiddler(state.server.get("root-render-type"),state.server.get("root-tiddler"));
			type = state.server.get("root-serve-type");
		}
		state.sendResponse(status,{"Content-Type": type},text);
	});
};

}());
