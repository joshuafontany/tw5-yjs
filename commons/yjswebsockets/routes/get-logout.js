/*\
title: $:/core/modules/server/routes/get-logout.js
type: application/javascript
module-type: route

GET /logout -- force a logout

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/logout$/;

exports.handler = function(request,response,state) {
	if(!state.authenticatedUsername) {
		// Challenge if there's no username
		response.writeHead(401,this.credentialsData?{
			"WWW-Authenticate": 'Basic realm="Please provide your username and password to logout of any sessions on' + state.server.servername + '"'
		}:"Authorization header required to logout of any sessions on '" + state.server.servername + "'");
		response.end();
	} else if(state.queryParameters && state.queryParameters["session"]) {
		// log out of this session
		$tw.wsServer.deleteSession(state.queryParameters["session"]);
		response.writeHead(202,{
			session: state.queryParameters["session"]
		});
		response.end();
	} else {
        // log out of all sessions of the current wiki?
    }
};

}());
