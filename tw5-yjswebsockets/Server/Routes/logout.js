/*\
title: $:/plugins/joshuafontany/tw5-yjs/server/routes/logout.js
type: application/javascript
module-type: route

GET /^\/logout\/?$/

Returns server status information

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "POST";

exports.path = /^\/logout$/;

exports.handler = function(request,response,state) {
  // build the status objects
  if(state.queryParameters && state.queryParameters["wiki"] && state.queryParameters["session"]) {
    let sessionId = state.queryParameters["session"],
      conectionIp = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0]:
        request.connection.remoteAddress,
      session = $tw.Yjs.getSession(sessionId);
    $tw.Yjs.logger.log(`['${sessionId}'] POST ${state.urlInfo.href} (${conectionIp})`);
    if(session && session.id == state.queryParameters["session"] && session.wikiName == state.queryParameters["wiki"] ) {
        $tw.Yjs.deleteSession(sessionId);
    }
    let text = {
        session_id: session? session.id: null
    }
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "*"});
    response.end(JSON.stringify(text),"utf8");
    
  }
}

}());
