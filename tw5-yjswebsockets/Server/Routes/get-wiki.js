/*\
title: $:/plugins/joshuafontany/tw5-yjs/server/routes/get-wiki.js
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
		wikiName = $tw.utils.decodeURIComponentSafe(state.params[0]);
	debugger;
	if (wikiName == "RootWiki") {
		// Redirect to the root wiki
		response.writeHead(302,{
			Location: "/"
		});
		response.end();
	} else {
		$tw.utils.loadWiki(wikiName,function(err,wikiPath) {
			var status,text,type = "text/plain";
			if(err) {
				$tw.Yjs.logger.log("Error accessing wiki " + wikiName + ": " + err.toString());
				status = 404;
				text = "Wiki '" + wikiName + "' not found";
			} else {
				status = 200;
				text = state.wiki.renderTiddler(state.server.get("root-render-type"),state.server.get("root-tiddler"));
				type = state.server.get("root-serve-type");
			}
			state.sendResponse(status,{"Content-Type": type},text);
		});
	}
};

}());
