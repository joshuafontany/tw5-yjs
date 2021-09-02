/*\
title: $:/plugins/commons/yjs/Yjs.js
type: application/javascript
module-type: library

A core prototype to hand everything else onto.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const WebsocketSession = require('./wssession.js').WebsocketSession;
const Y = require('./yjs.cjs');
const syncProtocol = require('./sync.cjs');
const authProtocol = require('./auth.cjs');
const awarenessProtocol = require('./awareness.cjs');
const time = require('./lib0/dist/time.cjs');
const encoding = require('./lib0/dist/encoding.cjs');
const decoding = require('./lib0/dist/decoding.cjs');
const mutex = require('./lib0/dist/mutex.cjs');
const map = require('./lib0/dist/map.cjs');
const observable_js = require('./lib0/dist/observable.cjs');
const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('./external/unique-names-generator/dist/index.js');

// Polyfill because IE uses old javascript
if(!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

/*
  "TW5-yjs" is a Yjs and websocket module for both server and client/browser. 
*/
class YSyncer {
  constructor () {
    // Create a logger
    this.logger = $tw.node? new $tw.utils.Logger("Yjs-server"): new $tw.utils.Logger("Yjs-browser");
    // YDocs
    this.YDocs = new Map();
    // disable gc when using snapshots!
    this.gcEnabled = $tw.node? (process.env.GC !== 'false' && process.env.GC !== '0'): true;
    /**
     * @type {{bindState: function(string,WSSharedDoc):void, writeState:function(string,WSSharedDoc):Promise<any>, provider: any}|null}
     */
    this.persistence = null;

    // Sessions
    this.sessions = new Map();
  }

  /*
    Websocket Session methods
  */

  getHost (host) {
    host = new this.url(host || (!!document.location && document.location.href));
    // Websocket host
    let protocol = null;
    if(host.protocol == "http:") {
      protocol = "ws:";
    } else if(host.protocol == "https:") {
      protocol = "wss:";
    }
    host.protocol = protocol
    return host.toString();
  }

  // Reconnect a session or create a new one
  openSession (options) {
    let session = this.getSession(options.id)
    if(!session || options.wikiName !== session.wikiName || options.username !== session.username) {
      if(options.id == this.uuid.NIL) {
        options.id = this.uuid.v4();
      }
      session = new WebsocketSession(options);
      this.sessions.set(options.id, session);
    }
    return session 
  }

  getSession (sessionId) {
    if(sessionId !== this.uuid.NIL && this.hasSession(sessionId)) {
      return this.sessions.get(sessionId);
    } else {
      return null;
    }
  }

  hasSession (sessionId) {
    return this.sessions.has(sessionId);
  }

  deleteSession (sessionId) {
    if (this.hasSession(sessionId)) {
      this.getSession(sessionId).destroy()
      this.sessions.delete(sessionId);
    }
  }

  /*
    Wiki methods
  */

  loadWiki (wikiName = $tw.wiki.getTiddlerText("$:/status/WikiName", $tw.wiki.getTiddlerText("$:/SiteTitle", "")),cb) { 
    let error = null;
    if(!!wikiName && !$tw.states.has(wikiName)) {
      try{
        // Set the name for this wiki for websocket messages
        $tw.wikiName = wikiName;

        // Setup the YDoc for the wiki
        let wikiDoc = this.getYDoc(wikiName);
        let wikiTitles = wikiDoc.getArray("wikiTitles");
        let wikiTiddlers = wikiDoc.getArray("wikiTiddlers");
        let wikiTombstones = wikiDoc.getArray("wikiTombstones");
        //Attach the persistence provider here

        // Attach a y-tiddlywiki provider here
        // This leaves each wiki's syncadaptor free to sync to disk or other storage

        // Setup the observers
        let queueTiddler = function(title) {
          if(title && $tw.syncer) {
            $tw.syncer.titlesToBeLoaded[title] = true;
          }
        }
        wikiTiddlers.observeDeep((events,transaction) => {
          if ($tw.syncadaptor.session && transaction.origin !== $tw.wiki) {
            let targets = [];
            events.forEach(event => {
              if (event.target == event.currentTarget) {
                // A tiddler was added
                event.changes.added.forEach(added => {
                  console.log(added.content.type.toJSON());
                  let title = added.content.type.get('title');
                  if(targets.indexOf(title) == -1) {
                    targets.push(title);
                  }
                });
              } else {
                // A tiddler was modified
                console.log(event.target.toJSON());
                let title = event.target.get("title");
                if(targets.indexOf(title) == -1) {
                  targets.push(title);
                }
              }
            });
            targets.forEach((title) => {
              console.log(`['${transaction.origin}'] Updating tiddler: ${title}`);
              queueTiddler(title);
            })
            $tw.utils.nextTick(() => $tw.syncer.processTaskQueue());
          }
        });

        wikiTombstones.observe((event,transaction) => {
          if (transaction.origin !== $tw.wiki) {
            event.delta.forEach(delta => {
              if(delta.insert) {
                delta.insert.forEach(item => {
                  console.log(`['${transaction.origin}'] Deleting tiddler: ${item}`);
                  // A tiddler was deleted
                  $tw.wiki.deleteTiddler(item)
                });
              }
            });
          }
        });

        // Set this wiki as loaded
        $tw.states.set($tw.wikiName,$tw);
        $tw.hooks.invokeHook('wiki-loaded',wikiName);
      } catch (err) {
        console.error(err);
        error = err;
      }
    }
    if (typeof cb === 'function') {
      cb(error,error == null?true:false);
    } else {
      return error == null?true:false;
    }
  };

  /*
    Yjs methods
  */

  /**
   * Gets a Y.Doc by name, whether in memory or on disk
   *
   * @param {string} docname - the name of the Y.Doc to find or create
   * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
   * @return {Y.Doc}
   */
  getYDoc (docname,gc = this.gcEnabled) {
    return map.setIfUndefined(this.YDocs, docname, () => {
      const doc = new Y.Doc(docname);
      doc.gc = gc;
      doc.name = docname;
      if (this.persistence !== null) {
        this.persistence.bindState(docname, doc);
      }
      this.YDocs.set(docname, doc);
      return doc;
    })
  }

}

exports.YSyncer = YSyncer;

/*
* Node classes
*/ 
if($tw.node) {
const path = require('path');
const fs = require('fs');
const os = require('os');

// A polyfilL to make this work with older node installs

// START POLYFILL
const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

if (!Object.values) {
  Object.values = function values(O) {
    return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
  };
}
// END POLYFILL

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
 * @param {WSSharedDoc} doc
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

class WSSharedDoc extends Y.Doc {
  /**
   * @param {string} name
   */
  constructor (name) {
    super({ gc: $tw.Yjs.gcEnabled })
    this.name = name
    this.mux = mutex.createMutex()
    /**
     * Maps from session to set of controlled user ids & session/doc specific handlers. Delete all user ids from awareness, and clear handlers when this session is closed
     * @type {Map<Object, Set<number>>}
     */
    this.sessions = new Map()
    this.handlers = new Map()
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

class YServer extends YSyncer {
  constructor () {
    super();
    // Users
    this.anonId = 0; // Incremented when an anonymous userid is created

    // YDocs
    if (typeof persistenceDir === 'string') {
      console.info('Persisting Y documents to "' + persistenceDir + '"')
      // @ts-ignore
      const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
      const ldb = new LeveldbPersistence(persistenceDir)
      this.persistence = {
        provider: ldb,
        bindState: async (docName, ydoc) => {
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

  /*
    Session methods
  */
  getAnonUsername (state) {
    // Query the request state server for the anon username parameter
    let anon = state.server.get("anon-username")
    return (anon || '') + uniqueNamesGenerator({
      dictionaries: [colors, adjectives, animals, names],
      style: 'capital',
      separator: '',
      length: 3,
      seed: $tw.Yjs.anonId++
    });
  }

  getSessionsByUser (username) {
    let usersSessions = new Map();
    for (let [id,session] of this.sessions.entries()) {
      if (session.username === username) {
        usersSessions.add(id,session);
      }
    }
    return usersSessions;
  }

  getSessionsByWiki (wikiName) {
    let wikiSessions = new Map();
    for (let [id, session] of this.sessions.entries()) {
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
  refreshSession (session,timeout) {
    if($tw.node && $tw.Yjs.wsServer) {
      let eol = new Date(session.expires).getTime() + timeout;
      session.expires = new Date(eol).getTime();
    }
  }

  /**
   * @param {WebSocket} socket
   * @param {UPGRADE} request
   * @param {$tw server state} state
    This function handles incomming connections from client sessions.
    It can support multiple client sessions, each with a unique sessionId.
    Session objects are defined in $:/plugins/commons/yjs/wssession.js
  */
  handleWSConnection (socket,request,state) {
    if($tw.Yjs.hasSession(state.sessionId)) {
      let session = $tw.Yjs.getSession(state.sessionId);
      // Reset the connection state
      session.ip = state.ip;
      session.url = state.urlInfo;
      session.ws = socket;
      session.connecting = false;
      session.connected = true;
      session.synced = false;
  
      let wikiDoc = $tw.Yjs.getYDoc(session.wikiName);
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
              $tw.Yjs.refreshSession(session,1000*60*60);
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
        // Close the WSSharedDoc session when disconnected
        $tw.Yjs.closeWSConnection(wikiDoc,session,event);
        session.emit('disconnected', [{
          event: event 
        },session]);
      });
      socket.on('error', function(error) {
        console.log(`['${session.id}'] socket error:`, error);
        $tw.Yjs.closeWSConnection(wikiDoc,session,event);
        session.emit('error', [{
          error: error
        },session]);
      })

      session.emit('connected', [{},session]);
    }
  }

  /**
   * @param {WSSharedDoc} doc
   * @param {WebsocketSession} session
   */
  closeWSConnection (doc,session,event) {
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
    Yjs methods
  */

  /**
   * Gets a Y.Doc by name, whether in memory or on disk
   *
   * @param {string} docname - the name of the Y.Doc to find or create
   * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
   * @return {WSSharedDoc}
   */
  getYDoc (docname,gc = this.gcEnabled) {
    return map.setIfUndefined(this.YDocs, docname, () => {
      const doc = new WSSharedDoc(docname);
      doc.gc = gc;
      if (this.persistence !== null) {
        this.persistence.bindState(docname, doc);
      }
      this.YDocs.set(docname, doc);
      return doc;
    })
  }

  /*
    Return the resolved filePathRoot
  */
  getFilePathRoot () {
    const currPath = path.parse(process.argv[0]).name !== 'node' ? path.dirname(process.argv[0]) : process.cwd();
    let basePath = '';
    this.settings.filePathRoot = this.settings.filePathRoot || './files';
    if (this.settings.filePathRoot === 'cwd') {
      basePath = path.parse(process.argv[0]).name !== 'node' ? path.dirname(process.argv[0]) : process.cwd();
    } else if (this.settings.filePathRoot === 'homedir') {
      basePath = os.homedir();
    } else {
      basePath = path.resolve(currPath, this.settings.filePathRoot);
    }
  }

  /*
    Return the resolved basePath
  */
  getBasePath () {
    const currPath = path.parse(process.argv[0]).name !== 'node' ? path.dirname(process.argv[0]) : process.cwd();
    let basePath = '';
    this.settings.basePath = this.settings.basePath || 'cwd';
    if (this.settings.basePath === 'homedir') {
      basePath = os.homedir();
    } else if (this.settings.basePath === 'cwd' || !this.settings.basePath) {
      basePath = path.parse(process.argv[0]).name !== 'node' ? path.dirname(process.argv[0]) : process.cwd();
    } else {
      basePath = path.resolve(currPath, this.settings.basePath);
    }
    return basePath;
  }

  /*
    Given a wiki name this generates the path for the wiki.
  */
  generateWikiPath (wikiName) {
    const basePath = this.getBasePath();
    return path.resolve(basePath, this.settings.wikisPath, wikiName);
  }

  /*
    Information about the available plugins
  */
  getPluginInfo () {
    this.logger.log('Getting plugin paths...');
    // Enumerate the plugin paths
    const pluginPaths = $tw.getLibraryItemSearchPaths($tw.config.pluginsPath,$tw.config.pluginsEnvVar);
    pluginInfo = {};
    for(let pluginIndex=0; pluginIndex<pluginPaths.length; pluginIndex++) {
      const pluginPath = path.resolve(pluginPaths[pluginIndex]);
      $tw.Yjs.logger.log('Reading theme from ', pluginPaths[pluginIndex], {level:4});
      // Enumerate the folders
      try {
        const authors = fs.readdirSync(pluginPath);
        for(let authorIndex=0; authorIndex<authors.length; authorIndex++) {
          const pluginAuthor = authors[authorIndex];
          if($tw.utils.isDirectory(path.resolve(pluginPath,pluginAuthor))) {
            const pluginNames = fs.readdirSync(path.join(pluginPath,pluginAuthor));
            pluginNames.forEach(function(pluginName) {
              // Check if directories have a valid plugin.info
              if(!pluginInfo[pluginAuthor + '/' + pluginName] && $tw.utils.isDirectory(path.resolve(pluginPath,pluginAuthor,pluginName))) {
                let info = false;
                try {
                  info = JSON.parse(fs.readFileSync(path.resolve(pluginPath,pluginAuthor, pluginName,"plugin.info"),"utf8"));
                } catch(ex) {
                  $tw.Yjs.logger.error('Reading plugin info failed ', ex, {level: 3});
                  $tw.Yjs.logger.error('Failed to read plugin ', pluginAuthor, '/', pluginName, {level:4});
                }
                if(info) {
                  pluginInfo[pluginAuthor + '/' + pluginName] = info;
                  $tw.Yjs.logger.error('Read info for plugin ', pluginName, {level:4})
                }
              }
            })
          }
        }
      } catch (e) {
        if(e.code === 'ENOENT') {
          $tw.Yjs.logger.log('No Plugins Folder ' + pluginPaths[pluginIndex], {level:2});
        } else {
          $tw.Yjs.logger.error('Error getting plugin info', e, {level:2})
        }
      }
    }
    return pluginInfo;
  }

}

exports.YServer = YServer;
}