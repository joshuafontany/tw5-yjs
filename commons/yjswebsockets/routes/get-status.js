/*\
title: $:/core/modules/server/routes/get-status.js
type: application/javascript
module-type: route

GET /^\/status\/?$/

Returns server status information

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/status$/;

exports.handler = function (request, response, state) {
	let text = "";
	// build the status objects
	if(state.queryParameters && state.queryParameters["wiki"] && state.queryParameters["session"]) {
		let conectionIp = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0] : request.connection.remoteAddress;
		let session = $tw.wsServer.getSession(state.queryParameters["session"]);
		if(!session || state.boot.pathPrefix !== session.pathPrefix || state.authenticatedUsername !== session.username) {
			session = $tw.wsServer.newSession({
				id: $tw.utils.uuid.v4(),
				key: state.boot.wikiInfo.uuid,
				pathPrefix: state.boot.pathPrefix,
				authenticatedUsername: state.authenticatedUsername,
				username: state.authenticatedUsername || $tw.wsServer.getAnonUsername(state),
				isAnonymous: !state.authenticatedUsername,
				isLoggedIn: !!state.authenticatedUsername,
				isReadOnly: !state.server.isAuthorized(state.boot.pathPrefix ? state.boot.pathPrefix + "/writers" : "writers", state.authenticatedUsername),
				access: state.server.getUserAccess((!state.authenticatedUsername) ? null : state.authenticatedUsername, state.boot.pathPrefix),
				client: false,
				connect: false,
				ip: conectionIp,
				url: state.urlInfo
			});
		}
		if(state.server.get('debug-level') !== "none") {
			$tw.utils.log(`['${session.username}'] GET ${state.boot.url}${state.urlInfo.href} (${conectionIp})`);
		}
		// Set a login window for 60 seconds.
		$tw.wsServer.refreshSession(session, 1000 * 60);
		text = {
			username: session.username,
			anonymous: session.isAnonymous,
			read_only: session.isReadOnly,
			tiddlywiki_version: $tw.version,
			session: session.id,
			session_expires: session.expires,
			ip: session.ip
		}
	} else {
		text = {
			username: state.authenticatedUsername || $tw.wsServer.getAnonUsername(state),
			anonymous: !state.authenticatedUsername,
			read_only: !state.server.isAuthorized("writers", state.authenticatedUsername),
			space: {
				recipe: "default"
			},
			tiddlywiki_version: $tw.version
		};
	}
	response.writeHead(200, {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Headers": "*"
	});
	response.end(JSON.stringify(text), "utf8");
}