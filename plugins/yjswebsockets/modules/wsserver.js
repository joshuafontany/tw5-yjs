/*\
title: $:/plugins/commons/yjs/wsserver.js
type: application/javascript
module-type: library


\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.node) {
  const path = require('path');
  const fs = require('fs');
  const os = require('os');
  const WS = require('./external/ws/ws.js');
  const WebsocketSession = require('./wssession.js').WebsocketSession;
  const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('./external/unique-names-generator/dist/index.js');

/*
  A simple websocket server extending the `ws` library
  options: 
*/
function WebSocketServer(options) {
  Object.assign(this, new WS.Server(options));
  // Setup the httpServer
  let self = this;
  this.server = options.server || null;
  // Users
  this.anonId = 0; // Incremented when an anonymous userid is created
  // Setup a sessions Map
  $tw.sessions = new Map();
  // Set the event handlers
  this.on('listening',this.serverOpened);
  this.on('close',this.serverClosed);
  this.on('connection',this.handleWSConnection);
  if(this.server){
    this.server.on('upgrade', function(request,socket,head) {
      if(request.headers.upgrade === 'websocket') {
        // Verify the client here
        let state = self.verifyUpgrade(request);
        if(state){
          self.handleUpgrade(request,socket,head,function(ws) {
            self.emit('connection',ws,request,state);
          });
        } else {
          $tw.utils.log(`ws-server: Unauthorized Upgrade GET ${request.url}`);
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
      }
    });
  }

  if (typeof options.persistenceDir === 'string') {
    $tw.utils.log('Persisting Y documents to "' + options.persistenceDir + '"')
    // @ts-ignore
    const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
    const ldb = new LeveldbPersistence(options.persistenceDir)
    this.persistence = {
      provider: ldb,
      bindState: async (docName,ydoc) => {
        const persistedYdoc = await ldb.getYDoc(docName)
        const newUpdates = Y.encodeStateAsUpdate(ydoc)
        ldb.storeUpdate(docName, newUpdates)
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
        ydoc.on('update', update => {
          ldb.storeUpdate(docName, update)
        })
      },
      writeState: async (docName, ydoc) => {}
    }
  }
}

WebSocketServer.prototype = Object.create(require('./external/ws/ws.js').Server.prototype);
WebSocketServer.prototype.constructor = WebSocketServer;

WebSocketServer.prototype.defaultVariables = {

};

WebSocketServer.prototype.serverOpened = function() {

}

WebSocketServer.prototype.serverClosed = function() {

}

WebSocketServer.prototype.verifyUpgrade = function(request) {
  if(request.url.indexOf("wiki=") !== -1
  && request.url.indexOf("session=") !== -1) {
    // Compose the state object
    var state = {};
    state.server = this.server;
    state.ip = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0]:
      request.connection.remoteAddress;
    state.serverAddress = this.server.protocol + "://" + this.server.httpServer.address().address + ":" + this.server.httpServer.address().port;
    state.urlInfo = new URL(request.url,state.serverAddress);
    //state.pathPrefix = request.pathPrefix || this.get("path-prefix") || "";
    // Get the principals authorized to access this resource
    var authorizationType = "readers";
    // Check whether anonymous access is granted
    state.allowAnon = this.server.isAuthorized(authorizationType,null);
    // Authenticate with the first active authenticator
    let fakeResponse = {
      writeHead: function(){},
      end: function(){}
    }
    if(this.server.authenticators.length > 0) {
      if(!this.server.authenticators[0].authenticateRequest(request,fakeResponse,state)) {
        // Bail if we failed (the authenticator will have -not- sent the response)
        return false;
      }		
    }
    // Authorize with the authenticated username
    if(!this.server.isAuthorized(authorizationType,state.authenticatedUsername)) {
      return false;
    }
    state.sessionId = state.urlInfo.searchParams.get("session");
    if(this.hasSession(state.sessionId)) {
      let session = this.getSession(state.sessionId);
      return state.authenticatedUsername == session.authenticatedUsername
        && state.urlInfo.searchParams.get('wiki') == session.wikiName
        && state
    }
  } else {
    return false;
  }
};

/**
 * @param {WebSocket} socket
 * @param {UPGRADE} request
 * @param {$tw server state} state
  This function handles incomming connections from client sessions.
  It can support multiple client sessions, each with a unique sessionId.
  Session objects are defined in $:/plugins/commons/yjs/wssession.js
*/
WebSocketServer.prototype.handleWSConnection = function(socket,request,state) {
  if(this.hasSession(state.sessionId)) {
    let session = this.getSession(state.sessionId);
    // Reset the connection state
    session.ip = state.ip;
    session.url = state.urlInfo;
    session.ws = socket;
    session.connecting = false;
    session.connected = true;
    session.synced = false;

    let wikiDoc = $tw.utils.getYDoc(session.wikiName);
    wikiDoc.sessions.set(session, new Set())
    console.log(`['${state.sessionId}'] Opened socket ${socket._socket._peername.address}:${socket._socket._peername.port}`);
    // Event handlers
    socket.on('message', function(event) {
      let message = new Uint8Array(event);
      const decoder = session.authenticateMessage(message);
      if(message && decoder) {
        session.lastMessageReceived = time.getUnixTime();
        const encoder = encoding.createEncoder();
        const eventDoc = session.getSubDoc(decoding.readAny(decoder));
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
          case messageSync: {
            encoding.writeVarUint(encoder, messageSync)
            // Instead of syncProtocol.readSyncMessage(decoder, encoder, eventDoc, null)
            // Implement Read-Only Sessions
            const messageSyncType = decoding.readVarUint(decoder);
            switch (messageSyncType) {
              case syncProtocol.messageYjsSyncStep1:
                syncProtocol.readSyncStep1(decoder, encoder, eventDoc)
                break
              case syncProtocol.messageYjsSyncStep2:
                if (!session.isReadOnly) syncProtocol.readSyncStep2(decoder, eventDoc, session.id)
                break
              case syncProtocol.messageYjsUpdate:
                if (!session.isReadOnly) syncProtocol.readUpdate(decoder, eventDoc, session.id)
                break
              default:
                throw new Error('Unknown message type')
            }
            if (encoding.length(encoder) > 1) { 
              session.send(encoder,eventDoc.name);
            }
            break
          }
          case messageAwareness: {
            awarenessProtocol.applyAwarenessUpdate(wikiDoc.awareness,decoding.readVarUint8Array(decoder),session)
            break
          }
          case messageAuth : {
            break
          }
          case messageQueryAwareness : {
            break
          }
          case messageHandshake : {
            console.log(`['${session.id}'] Server Handshake`);
            // Refresh the session to expire in 60 minutes
            $tw.wsServer.refreshSession(session,1000*60*60);
            // send messageHandshake
            const encoderHandshake = encoding.createEncoder();
            encoding.writeVarUint(encoderHandshake, messageHandshake);
            encoding.writeVarString(encoderHandshake, JSON.stringify({
              expires: session.expires
            }));
            session.send(encoderHandshake,wikiDoc.name);
            // Start a sync
            // send sync step 1
            const encoderSync = encoding.createEncoder()
            encoding.writeVarUint(encoderSync, messageSync)
            syncProtocol.writeSyncStep1(encoderSync, wikiDoc)
            session.send(encoderSync,wikiDoc.name);
            // broadcast the doc awareness states
            const awarenessStates = wikiDoc.awareness.getStates()
            if (awarenessStates.size > 0) {
              const encoderAwareness = encoding.createEncoder()
              encoding.writeVarUint(encoderAwareness, messageAwareness)
              encoding.writeVarUint8Array(encoderAwareness, awarenessProtocol.encodeAwarenessUpdate(wikiDoc.awareness, Array.from(awarenessStates.keys())))
              session.send(encoderAwareness,wikiDoc.name);
            }
            // Notify listeners
            session.emit('handshake');
            break
          }
          case messageHeartbeat : {
            // ping == 0, pong == 1
            const heartbeatType = decoding.readVarUint(decoder)
            if(heartbeatType == 0) {
              // incoming ping, send back a pong
              const encoderHeartbeat = encoding.createEncoder()
              encoding.writeVarUint(encoderHeartbeat, messageHeartbeat)
              encoding.writeVarUint(encoderHeartbeat, 1)
              session.send(encoderHeartbeat,wikiDoc.name);
            } else if (heartbeatType == 1) {
              // Incoming pong, who did we ping?
            }
            break
          }
          default: {
            console.error(`['${session.id}'] Unable to compute message, ydoc ${message.doc}`);
          }
        }
      } else {
        console.error(`['${session.id}'] Unable to parse message:`, event);
        // send messageAuth denied
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageAuth);
        authProtocol.writePermissionDenied(encoder, "WebSocket Authentication Error - Invalid Client Message");
        session.send(encoder,wikiDoc.name);
        session.ws.close(4023, `Invalid session`);
      }
    });
    socket.on('close', function(event) {
      console.log(`['${session.id}'] Closed socket ${socket._socket._peername.address}:${socket._socket._peername.port}  (code ${socket._closeCode})`);
      session.connecting = false;
      session.connected = false;
      session.synced = false;
      // Close the WikiDoc session when disconnected
      $tw.wsServer.closeWSConnection(wikiDoc,session,event);
      session.emit('disconnected', [{
        event: event 
      },session]);
    });
    socket.on('error', function(error) {
      console.log(`['${session.id}'] socket error:`, error);
      $tw.wsServer.closeWSConnection(wikiDoc,session,event);
      session.emit('error', [{
        error: error
      },session]);
    })

    session.emit('connected', [{},session]);
  }
}
  
/**
 * @param {WikiDoc} doc
 * @param {WebsocketSession} session
*/
WebSocketServer.prototype.closeWSConnection = function(doc,session,event) {
  if (doc.sessions.has(session)) {
    /**
     * @type {Set<number>}
     */
    // @ts-ignore
    const controlledIds = doc.sessions.get(session)
    doc.sessions.delete(session)
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null)
    if (doc.sessions.size === 0 && this.persistence !== null) {
      // if persisted, we store state and destroy ydocument
      this.persistence.writeState(doc.name, doc).then(() => {
        doc.destroy()
      })
      this.ydocs.delete(doc.name)
    }
  }
  if (session.isReady()) {
    session.ws.close(1000, `['${this.id}'] Websocket closed by the server`,event);
  }
}

/*
  User methods
*/
WebSocketServer.prototype.getAnonUsername = function(state) {
  // Query the request state server for the anon username parameter
  let anon = state.server.get("anon-username")
  return (anon || '') + uniqueNamesGenerator({
    dictionaries: [colors, adjectives, animals, names],
    style: 'capital',
    separator: '',
    length: 3,
    seed: this.anonId++
  });
}

/*
  Session methods
*/
WebSocketServer.prototype.newSession = function(options) {
  if(options.id !== $tw.utils.uuid.NIL) {
    let session = new WebsocketSession(options);
    if(session) {
      this.setSession(session);
    }
    return session
  }
}

WebSocketServer.prototype.setSession = function(session) {
  if(session.id !== $tw.utils.uuid.NIL) {
    return $tw.sessions.set(sessionId);
  }
}

WebSocketServer.prototype.getSession = function(sessionId) {
  if(sessionId !== $tw.utils.uuid.NIL && this.hasSession(sessionId)) {
    return $tw.sessions.get(sessionId);
  } else {
    return null;
  }
}

WebSocketServer.prototype.hasSession = function(sessionId) {
  return $tw.sessions.has(sessionId);
}

WebSocketServer.prototype.deleteSession = function(sessionId) {
  if (this.hasSession(sessionId)) {
    this.getSession(sessionId).destroy()
    $tw.sessions.delete(sessionId);
  }
}

WebSocketServer.prototype.getSessionsByUser = function(username) {
  let usersSessions = new Map();
  for (let [id,session] of $tw.sessions.entries()) {
    if (session.username === username) {
      usersSessions.add(id,session);
    }
  }
  return usersSessions;
}

WebSocketServer.prototype.getSessionsByWiki = function(wikiName) {
  let wikiSessions = new Map();
  for (let [id, session] of $tw.sessions.entries()) {
    if (session.wikiName === wikiName) {
      wikiSessions.add(id, session);
    }
  }
  return wikiSessions;
}

/**
 * @param {WebsocketSession} session
 * @param {int} timeout
*/
WebSocketServer.prototype.refreshSession = function(session,timeout) {
  let eol = new Date(session.expires).getTime() + timeout;
  session.expires = new Date(eol).getTime();
}

exports.WebSocketServer = WebSocketServer;

}
