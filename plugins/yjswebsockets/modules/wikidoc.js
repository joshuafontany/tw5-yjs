/*\
title: $:/plugins/commons/yjs/wikidoc.js
type: application/javascript
module-type: library

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const Y = require('./yjs.cjs');
const syncProtocol = require('./sync.cjs');
const authProtocol = require('./auth.cjs');
const awarenessProtocol = require('./awareness.cjs');
const time = require('./lib0/dist/time.cjs');
const encoding = require('./lib0/dist/encoding.cjs');
const decoding = require('./lib0/dist/decoding.cjs');
const mutex = require('./lib0/dist/mutex.cjs');

// Y message handler flags
const messageSync = 0;
const messageAwareness = 1;
const messageAuth = 2;
const messageQueryAwareness = 3;
const messageHandshake = 4;
const messageHeartbeat = 5;

/**
 * @param {Uint8Array} update
 * @param {wssession} origin
 * @param {WikiDoc} doc
 */
const updateHandler = (update, origin, doc) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  doc.sessions.forEach((_, s) => {
    if (origin !== s.id) {
      s.send(encoder,doc.name);
    }
  })
}

class WikiDoc extends Y.Doc {
  /**
   * @param {string} name
   */
  constructor (name) {
    super({ gc: $tw.node? $tw.wsServer && $tw.wsServer.gcEnabled: $tw.syncadaptor && $tw.syncadaptor.gcEnabled })
    this.name = name
    if($tw.node){
      this.mux = mutex.createMutex()
      /**
       * Maps from session to set of controlled user ids. Delete all user ids from awareness when this session is closed
       * @type {Map<Object, Set<number>>}
       */
      this.sessions = new Map()
      /**
       * @type {awarenessProtocol.Awareness}
       */
      this.awareness = new awarenessProtocol.Awareness(this)
      this.awareness.setLocalState(null)
      /**
       * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
       * @param {Object | null} origin Origin is the connection that made the change
       */
      const awarenessChangeHandler = ({ added, updated, removed }, origin) => {
        const changedClients = added.concat(updated, removed)
        if (origin !== null) {
          const connControlledIDs = /** @type {Set<number>} */ (this.sessions.get(origin))
          if (connControlledIDs !== undefined) {
            added.forEach(clientID => { connControlledIDs.add(clientID) })
            removed.forEach(clientID => { connControlledIDs.delete(clientID) })
          }
        }
        // broadcast awareness update
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, messageAwareness)
        encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
        this.sessions.forEach((_, s) => {
          s.send(encoder,this.name);
        })
      }
      this.awareness.on('update', awarenessChangeHandler)
      this.on('update', updateHandler)
    }
  }
}

exports.WikiDoc = WikiDoc;