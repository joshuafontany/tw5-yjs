/*\
title: $:/plugins/commons/yjs/server/routes/get-status.js
type: application/javascript
module-type: route

GET /^\/status\/?$/

Returns server status information

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/status$/;

exports.handler = function(request,response,state) {
  let conectionIp = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0]:
  request.connection.remoteAddress;
  $tw.utils.log(`['${state.queryParameters["session"]}'] GET ${state.urlInfo.href} (${conectionIp})`);
  // build the status objects
  if(state.queryParameters && state.queryParameters["wiki"] && state.queryParameters["session"]) {
      let session = $tw.Yjs.openSession({
        id: state.queryParameters["session"],
        wikiName: state.queryParameters["wiki"],
        username: state.authenticatedUsername || $tw.Yjs.getAnonUsername(state),
        isReadOnly: !state.server.isAuthorized("writers",state.authenticatedUsername),
        isAnonymous: !state.authenticatedUsername,
        isLoggedIn: !!state.authenticatedUsername,
        access: $tw.Yjs.wsServer.getUserAccess((!state.authenticatedUsername)? null: state.authenticatedUsername,state.queryParameters["wiki"]),
        doc: $tw.Yjs.getYDoc(state.queryParameters["wiki"]),
        client: false,
        connect: false,
        url: state.urlInfo,
        ip: conectionIp
      });
    // Set a login window for 60 seconds.
    $tw.Yjs.refreshSession(session,1000*60)
    let text = {
      username: session.username,
      anonymous: session.isAnonymous,
      read_only: session.isReadOnly,
      tiddlywiki_version: $tw.version,
      session_id: session.id,
      session_expires: session.expires,
      ip: session.ip
    }
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "*"});
    response.end(JSON.stringify(text),"utf8");
  }
}

}());
