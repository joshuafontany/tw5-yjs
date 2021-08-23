/*\
title: $:/plugins/joshuafontany/tw5-yjs/Yjs.js
type: application/javascript
module-type: library

A core prototype to hand everything else onto.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const WebsocketSession = require('./WSSession.js').WebsocketSession;
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
const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('./External/unique-names-generator/dist/index.js');

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
    // Version
    this.version = $tw.wiki.getTiddler('$:/plugins/joshuafontany/tw5-yjs/yjs.cjs').fields.version;
    // Create a logger
    this.logger = $tw.node? new $tw.utils.Logger("Yjs-server"): new $tw.utils.Logger("Yjs-browser");
    // Access levels
    this.accessLevels = {
      Reader: "reader",
      Writer: "writer",
      Admin: "admin"
    }
    // Settings
    this.settings = {};

    // Wikis
    this.Wikis = new Map();

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

    // Load the client-messagehandlers
    this.clientHandlers = {};
    $tw.modules.applyMethods("client-messagehandlers", this.clientHandlers);
    // Reserve the server-messagehandlers
    this.serverHandlers = null;

    // Setup external libraries
    this.uuid = require('./External/uuid/index.js');
    if($tw.node){
      this.ws = require('./External/ws/ws.js');
      this.url = require('url').URL;
    } else if($tw.browser) {
      this.ws = WebSocket;
      this.url = URL;
    }
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
    if(!session || options.wikiName !== session.wikiName || options.authenticatedUsername !== session.authenticatedUsername) {
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
    if(!!wikiName && !this.Wikis.has(wikiName)) {
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
        this.Wikis.set($tw.wikiName,$tw);
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
 * @param {WSSession} origin
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
    // Initialise the scriptQueue objects ???
    this.scriptQueue = {};
    this.scriptActive = {};
    this.childproc = false;

    // Initialise the $tw.Yjs.settings object & load the user settings
    this.settings = $tw.wiki.getTiddlerData('$:/config/joshuafontany/tw5-yjs/WSServer',{});
    this.loadSettings(this.settings,$tw.boot.wikiPath);

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

    // Load the server-messagehandlers modules
    this.serverHandlers = {};
    $tw.modules.applyMethods("server-messagehandlers", this.serverHandlers);
  }

  /*
    Session methods
  */
  setAnonUsername (state,session) {
    // Query the request state server for the anon username parameter
    let anon = state.server.get("anon-username")
    session.username = (anon || '') + uniqueNamesGenerator({
      dictionaries: [colors, adjectives, animals, names],
      style: 'capital',
      separator: '',
      length: 3,
      seed: $tw.Yjs.anonId++
    });
  }

  getSessionsByUser (authenticatedUsername) {
    let usersSessions = new Map();
    for (let [id,session] of this.sessions.entries()) {
      if (session.authenticatedUsername === authenticatedUsername) {
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
    Session objects are defined in $:/plugins/joshuafontany/tw5-yjs/WSSession.js
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
    Settings Methods
  */

  /*
    Parse the default settings file and the normal user settings file
    This function modifies the input settings object with the properties in the
    json file at newSettingsPath
  */
  loadSettings (settings,bootPath) {
    const newSettingsPath = path.join(bootPath, 'settings', 'settings.json');
    let newSettings;
    if (typeof $tw.ExternalServer !== 'undefined') {
      newSettings = require(path.join(process.cwd(), 'LoadConfig.js')).settings;
    } else {
      if ($tw.node && !fs) {
        const fs = require('fs')
      }
      let rawSettings;
      // try/catch in case defined path is invalid.
      try {
        rawSettings = fs.readFileSync(newSettingsPath);
      } catch (err) {
        console.log('NodeSettings - No settings file, creating one with default values.');
        rawSettings = '{}';
      }
      // Try to parse the JSON after loading the file.
      try {
        newSettings = JSON.parse(rawSettings);
        console.log('NodeSettings - Parsed raw settings.');
      } catch (err) {
        console.log('NodeSettings - Malformed user settings. Using empty default.');
        console.log('NodeSettings - Check settings. Maybe comma error?');
        // Create an empty default settings.
        newSettings = {};
      }
    }
    // Extend the default with the user settings & normalize the wiki objects
    this.updateSettings(settings, newSettings);
    // Get the ip address to make it easier for other computers to connect.
    const ipAddress = require('./External/IP/ip.js').address();
    settings.serverInfo = {
      name: settings.serverName,
      ipAddress: ipAddress,
      protocol: !!settings["tls-key"] && !!!settings["tls-cert"]? "https": "http",
      port: settings.port || "8080",
      host: settings.host || "127.0.0.1"
    }
  }

  /*
    Given a local and a global settings, this returns the global settings but with
    any properties that are also in the local settings changed to the values given
    in the local settings.
    Changes to the settings are later saved to the local settings.
  */
  updateSettings (globalSettings,localSettings) {
    /*
    Walk though the properties in the localSettings, for each property set the global settings equal to it, 
    but only for singleton properties. Don't set something like 
    GlobalSettings.Accelerometer = localSettings.Accelerometer, instead set 
    GlobalSettings.Accelerometer.Controller = localSettings.Accelerometer.Contorller
    */
    let self = this;
    Object.keys(localSettings).forEach(function (key, index) {
      if (typeof localSettings[key] === 'object') {
        if (!globalSettings[key]) {
          globalSettings[key] = {};
        }
        //do this again!
        self.updateSettings(globalSettings[key], localSettings[key]);
      } else {
        globalSettings[key] = localSettings[key];
      }
    });
  }

  /*
    Creates initial settings tiddlers for the wiki.
  */
  createStateTiddlers (data,wiki) {
    // Create the $:/ServerIP tiddler
    let pluginTiddlers = {
      "$:/state/tw5-yjs/ServerIP": {
        title: "$:/state/tw5-yjs/ServerIP",
        text: this.settings.serverInfo.ipAddress,
        protocol: this.settings.serverInfo.protocol,
        port: this.settings.serverInfo.port,
        host: this.settings.serverInfo.host
      }
    }
    if (typeof wiki.wikiInfo === 'object') {
      // Get plugin list
      const fieldsPluginList = {
        title: '$:/state/tw5-yjs/ActivePluginList',
        list: $tw.utils.stringifyList(wiki.wikiInfo.plugins)
      }
      pluginTiddlers['$:/state/tw5-yjs/ActivePluginList'] = fieldsPluginList;
      
      const fieldsThemesList = {
        title: '$:/state/tw5-yjs/ActiveThemesList',
        list: $tw.utils.stringifyList(wiki.wikiInfo.themes)
      }
      pluginTiddlers['$:/state/tw5-yjs/ActiveThemesList'] = fieldsThemesList;
      
      const fieldsLanguagesList = {
        title: '$:/state/tw5-yjs/ActiveLanguagesList',
        list: $tw.utils.stringifyList(wiki.wikiInfo.languages)
      }
      pluginTiddlers['$:/state/tw5-yjs/ActiveLanguagesList'] = fieldsLanguagesList;
    }
    const message = {
      type: 'saveTiddler',
      wiki: data.wiki,
      tiddler: {
        fields: {
          title: "$:/state/tw5-yjs",
          type: "application/json",
          "plugin-type": "plugin",
          text: JSON.stringify({tiddlers: pluginTiddlers}) 
        }
      }
    };
    //this.getSession(data.sessionId).send(message);
  }

  // Wiki methods

  /*
    This function loads a tiddlywiki wiki and calls any callback.
  */
  loadWiki (wikiName,cb) {
    const settings = this.getWikiSettings(wikiName);
    let wikiPath = this.wikiExists(settings.path),
      error = null;
    // Make sure it isn't loaded already
    if(!!wikiPath && !this.Wikis.has(wikiName)) {
      try {
        //setup the tiddlywiki instance
        let $y = (wikiName == 'RootWiki') ? $tw : Object.create(null);
        if (wikiName == 'RootWiki') {
          // We have already booted
        } else {
          //Create a new Wiki object
          $y.wiki = new $tw.Wiki();
          $y.boot = Object.create(null);
          // Record boot info
          $y.boot.wikiPath = wikiPath;
          // Load the boot tiddlers (from $tw.loadTiddlersNode)
          $tw.utils.each($tw.loadTiddlersFromPath($tw.boot.bootPath),function(tiddlerFile) {
            $y.wiki.addTiddlers(tiddlerFile.tiddlers);
          });
          // Load the core tiddlers
          $y.wiki.addTiddler($tw.loadPluginFolder($tw.boot.corePath));
          // Load any required plugins
          // Set up http(s) server as $tw.Yjs.server.httpServer
          $tw.utils.each($tw.Yjs.settings["required-plugins"],function(name) {
            if(name.charAt(0) === "+") { // Relative path to plugin
              let pluginFields = $tw.loadPluginFolder(name.substring(1));
              if(pluginFields) {
                $y.wiki.addTiddler(pluginFields);
              }
            } else {
              let parts = name.split("/"),
                type = parts[0];
              if(parts.length  === 3 && ["plugins","themes","languages"].indexOf(type) !== -1) {
                this.loadPlugins($y,[parts[1] + "/" + parts[2]],$tw.config[type + "Path"],$tw.config[type + "EnvVar"]);
              }
            }
          });
          // Load the tiddlers from the wiki directory
          $y.boot.wikiInfo = this.loadWikiTiddlers($y,wikiPath);
          // Create a root widget for attaching event handlers. By using it as the parentWidget for another widget tree, one can reuse the event handlers
          $y.rootWidget = new widget.widget({
            type: "widget",
            children: []
          },{
            wiki: $y.wiki,
            document: $tw.fakeDocument
          });
          // Execute any startup actions
          $y.rootWidget.invokeActionsByTag("$:/tags/StartupAction");
          $y.rootWidget.invokeActionsByTag("$:/tags/StartupAction/Node");
          // Attach the syncadaptor & syncer
          // Find a working syncadaptor
          $y.syncadaptor = undefined;
          $tw.modules.forEachModuleOfType("syncadaptor",function(title,module) {
            if(!$y.syncadaptor && module.adaptorClass) {
              $y.syncadaptor = new module.adaptorClass({boot: $y.boot, wiki: $y.wiki});
            }
          });
          // Set up the syncer object if we've got a syncadaptor
          if($y.syncadaptor) {
            $y.syncer = new $tw.Syncer({wiki: $y.wiki, syncadaptor: $y.syncadaptor});
          }
        }
        // Name the wiki
        $y.wikiName = wikiName;
        const fields = {
          title: '$:/status/WikiName',
          text: wikiName
        };
        $y.wiki.addTiddler(new $tw.Tiddler(fields));

        // Setup the YDoc for the wiki
        let wikiDoc = this.getYDoc(wikiName);
        let wikiTitles = wikiDoc.getArray("wikiTitles");
        let wikiTiddlers = wikiDoc.getArray("wikiTiddlers");
        let wikiTombstones = wikiDoc.getArray("wikiTombstones");
        //Attach the persistence provider here

        // Attach a y-tiddlywiki provider here
        // This leaves each wiki's syncadaptor free to sync to disk or other storage

        // Setup the observers
        let stashTiddler = function(title) {
          let targetIndex = wikiTitles.toArray().indexOf(title);
          if(targetIndex !== -1) {
            // Save the tiddler
            let target = wikiTiddlers.get(targetIndex),
              fields = target.toJSON();
            $y.wiki.addTiddler(new $tw.Tiddler($y.wiki.getCreationFields(),fields,{title: title},$y.wiki.getModificationFields()));
          }
        }
        wikiTiddlers.observeDeep((events,transaction) => {
          if (transaction.origin !== $y.wiki) {
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
              stashTiddler(title);
            })
          }
        });
        wikiTombstones.observe((event,transaction) => {
          if (transaction.origin !== $y.wiki) {
            event.delta.forEach(delta => {
              if(delta.insert) {
                delta.insert.forEach(item => {
                  console.log(`['${transaction.origin}'] Deleting tiddler: ${item}`);
                  // A tiddler was deleted
                  $y.wiki.deleteTiddler(item)
                });
              }
            });
          }
        });

        // Setup the Wiki change event listener
        $y.wiki.addEventListener("change",function(changes) {
          // Filter the changes to match the syncer settings
          let filteredChanges = $y.syncer.getSyncedTiddlers(function(callback) {
            $tw.utils.each(changes,function(change,title) {
              var tiddler = $y.wiki.tiddlerExists(title) && $y.wiki.getTiddler(title);
              callback(tiddler,title);
            });
          });
          if(filteredChanges.length > 0) {
            let filteredTiddlers = {}
            $tw.utils.each(changes,function(change,title) {
              let changedFields = {},
                tiddlerIndex = wikiTitles.toArray().indexOf(title),
                tiddler = $y.wiki.tiddlerExists(title) && $y.wiki.getTiddler(title);
              if(tiddler && change.modified) {
                let tiddlerFields = tiddler.getFieldStrings();
                $tw.utils.each(tiddlerFields,function(field,name) {
                  if(tiddlerIndex == -1 || !wikiTiddlers.get(tiddlerIndex).has(name) || 
                    $tw.utils.hashString(field) !== $tw.utils.hashString(wikiTiddlers.get(tiddlerIndex).get(name))) {
                    changedFields[name] = field;
                  }
                });
              } else if(change.deleted && tiddlerIndex !== -1) {
                changedFields = null;
              }
              filteredTiddlers[title] = changedFields;
            });
            wikiDoc.transact(() => {
              $tw.utils.each(filteredTiddlers,function(changedFields,title) {
                let change = changes[title];
                let tiddler = $y.wiki.tiddlerExists(title) && $y.wiki.getTiddler(title);
                let tiddlerIndex = wikiTitles.toArray().indexOf(title);
                let tsIndex = wikiTombstones.toArray().indexOf(title);
                if(tiddler && change.modified) {
                  let tiddlerMap = tiddlerIndex == -1? new Y.Map(): wikiTiddlers.get(tiddlerIndex);
                  $tw.utils.each(changedFields,(field,name) => {
                    tiddlerMap.set(name,field);
                  });
                  $tw.utils.each(tiddlerMap.toJSON(),(field,name) => {
                    if(Object.keys(tiddler.fields).indexOf(name) == -1) {
                      tiddlerMap.delete(name);
                    }
                  });
                  if(tiddlerIndex == -1){
                    wikiTiddlers.push([tiddlerMap]);
                    wikiTitles.push([title]);
                  }
                  if(tsIndex !== -1) {
                    wikiTombstones.delete(tsIndex,1)
                  }
                } else if(change.deleted) {
                  if (tiddlerIndex !== -1 ) {
                    wikiTitles.delete(tiddlerIndex,1);
                    wikiTiddlers.delete(tiddlerIndex,1);
                  }
                  if (tsIndex == -1) {
                    wikiTombstones.push([title]);
                  }
                }
              })
            },$y.wiki);
          }
        })
        
        // Setup the FileSystemMonitors
        /*
        // Make sure that the tiddlers folder exists
        const error = $tw.utils.createDirectory($tw.Yjs.Wikis[wikiName].wikiTiddlersPath);
        if(error){
          this.logger.error('Error creating wikiTiddlersPath', error, {level:1});
        }
        // Recursively build the folder tree structure
        $tw.Yjs.Wikis[wikiName].FolderTree = buildTree('.', $tw.Yjs.Wikis[wikiName].wikiTiddlersPath, {});
        if($tw.Yjs.settings.disableFileWatchers !== 'yes') {
          // Watch the root tiddlers folder for chanegs
          $tw.Yjs.WatchAllFolders($tw.Yjs.Wikis[wikiName].FolderTree, wikiName);
        }
        */
        // Set the wiki as loaded
        this.Wikis.set(wikiName,$y);
        $tw.hooks.invokeHook('wiki-loaded',wikiName);
      } catch (err) {
        console.error(err);
        error = err;
      }
    }
    if (typeof cb === 'function') {
      cb(error,error == null?this.getWikiPath(wikiName):false);
    } else {
      return error == null?this.getWikiPath(wikiName):false;
    }
  }

  /*
    $y: a Yjs tiddlywiki instance  
    path: path of wiki directory
    options:
      parentPaths: array of parent paths that we mustn't recurse into
      readOnly: true if the tiddler file paths should not be retained
  */
  loadWikiTiddlers ($y,wikiPath,options) {
    options = options || {};
    let parentPaths = options.parentPaths || [],
      wikiInfoPath = path.resolve(wikiPath,$tw.config.wikiInfo),
      wikiInfo,
      pluginFields;
    // Bail if we don't have a wiki info file
    if(fs.existsSync(wikiInfoPath)) {
      wikiInfo = JSON.parse(fs.readFileSync(wikiInfoPath,"utf8"));
    } else {
      return null;
    }
    // Save the path to the tiddlers folder for the filesystemadaptor
    let config = wikiInfo.config || {};
    if($y.boot.wikiPath == wikiPath) {
      $y.boot.wikiTiddlersPath = path.resolve($y.boot.wikiPath,config["default-tiddler-location"] || $tw.config.wikiTiddlersSubDir);
    }
    // Load any included wikis
    if(wikiInfo.includeWikis) {
      parentPaths = parentPaths.slice(0);
      parentPaths.push(wikiPath);
      $tw.utils.each(wikiInfo.includeWikis,function(info) {
        if(typeof info === "string") {
          info = {path: info};
        }
        let resolvedIncludedWikiPath = path.resolve(wikiPath,info.path);
        if(parentPaths.indexOf(resolvedIncludedWikiPath) === -1) {
          let subWikiInfo = $tw.loadWikiTiddlers($y,resolvedIncludedWikiPath,{
            parentPaths: parentPaths,
            readOnly: info["read-only"]
          });
          // Merge the build targets
          wikiInfo.build = $tw.utils.extend([],subWikiInfo.build,wikiInfo.build);
        } else {
          $tw.utils.error("Cannot recursively include wiki " + resolvedIncludedWikiPath);
        }
      });
    }
    // Load any plugins, themes and languages listed in the wiki info file
    this.loadPlugins($y,wikiInfo.plugins,$tw.config.pluginsPath,$tw.config.pluginsEnvVar);
    this.loadPlugins($y,wikiInfo.themes,$tw.config.themesPath,$tw.config.themesEnvVar);
    this.loadPlugins($y,wikiInfo.languages,$tw.config.languagesPath,$tw.config.languagesEnvVar);
    // Load the wiki files, registering them as writable
    let resolvedWikiPath = path.resolve(wikiPath,$tw.config.wikiTiddlersSubDir);
    $tw.utils.each($tw.loadTiddlersFromPath(resolvedWikiPath),function(tiddlerFile) {
      if(!options.readOnly && tiddlerFile.filepath) {
        $tw.utils.each(tiddlerFile.tiddlers,function(tiddler) {
          $y.boot.files[tiddler.title] = {
            filepath: tiddlerFile.filepath,
            type: tiddlerFile.type,
            hasMetaFile: tiddlerFile.hasMetaFile,
            isEditableFile: config["retain-original-tiddler-path"] || tiddlerFile.isEditableFile || tiddlerFile.filepath.indexOf($y.boot.wikiTiddlersPath) !== 0
          };
        });
      }
      $y.wiki.addTiddlers(tiddlerFile.tiddlers);
    });
    if($y.boot.wikiPath == wikiPath) {
      // Save the original tiddler file locations if requested
      let output = {}, relativePath, fileInfo;
      for(let title in $y.boot.files) {
        fileInfo = $y.boot.files[title];
        if(fileInfo.isEditableFile) {
          relativePath = path.relative($y.boot.wikiTiddlersPath,fileInfo.filepath);
          fileInfo.originalpath = relativePath;
          output[title] =
            path.sep === "/" ?
            relativePath :
            relativePath.split(path.sep).join("/");
        }
      }
      if(Object.keys(output).length > 0){
        $y.wiki.addTiddler({title: "$:/config/OriginalTiddlerPaths", type: "application/json", text: JSON.stringify(output)});
      }
    }
    // Load any plugins within the wiki folder
    let wikiPluginsPath = path.resolve(wikiPath,$tw.config.wikiPluginsSubDir);
    if(fs.existsSync(wikiPluginsPath)) {
      let pluginFolders = fs.readdirSync(wikiPluginsPath);
      for(let t=0; t<pluginFolders.length; t++) {
        pluginFields = $tw.loadPluginFolder(path.resolve(wikiPluginsPath,"./" + pluginFolders[t]));
        if(pluginFields) {
          $y.wiki.addTiddler(pluginFields);
        }
      }
    }
    // Load any themes within the wiki folder
    let wikiThemesPath = path.resolve(wikiPath,$tw.config.wikiThemesSubDir);
    if(fs.existsSync(wikiThemesPath)) {
      let themeFolders = fs.readdirSync(wikiThemesPath);
      for(let t=0; t<themeFolders.length; t++) {
        pluginFields = $tw.loadPluginFolder(path.resolve(wikiThemesPath,"./" + themeFolders[t]));
        if(pluginFields) {
          $y.wiki.addTiddler(pluginFields);
        }
      }
    }
    // Load any languages within the wiki folder
    let wikiLanguagesPath = path.resolve(wikiPath,$tw.config.wikiLanguagesSubDir);
    if(fs.existsSync(wikiLanguagesPath)) {
      let languageFolders = fs.readdirSync(wikiLanguagesPath);
      for(let t=0; t<languageFolders.length; t++) {
        pluginFields = $tw.loadPluginFolder(path.resolve(wikiLanguagesPath,"./" + languageFolders[t]));
        if(pluginFields) {
          $y.wiki.addTiddler(pluginFields);
        }
      }
    }
    return wikiInfo;
  };

  /*
    $y: a Yjs tiddlywiki instance
    plugins: Array of names of plugins (eg, "tiddlywiki/filesystemadaptor")
    libraryPath: Path of library folder for these plugins (relative to core path)
    envVar: Environment variable name for these plugins
  */
  loadPlugins ($y,plugins,libraryPath,envVar) {
    if(plugins) {
      var pluginPaths = $tw.getLibraryItemSearchPaths(libraryPath,envVar);
      for(var t=0; t<plugins.length; t++) {
        $tw.loadPlugin($y,plugins[t],pluginPaths);
      }
    }
  };

  /*
    $y: a Yjs tiddlywiki instanc
    name: Name of the plugin to load
    paths: array of file paths to search for it
  */
  loadPlugin ($y,name,paths) {
    var pluginPath = $tw.findLibraryItem(name,paths);
    if(pluginPath) {
      var pluginFields = $tw.loadPluginFolder(pluginPath);
      if(pluginFields) {
        $y.wiki.addTiddler(pluginFields);
        return;
      }
    }
    console.log("Warning: Cannot find plugin '" + name + "'");
  };

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
    Given a wiki name this gets the wiki path if one is listed, if the wiki isn't
    listed this returns undefined.
    This can be used to determine if a wiki is listed or not.
  */
  getWikiPath (wikiName) {
    let wikiPath = this.getWikiSettings(wikiName).path || undefined;
    // If the wikiPath exists convert it to an absolute path
    if (typeof wikiPath !== 'undefined') {
      const basePath = this.getBasePath()
      wikiPath = path.resolve(basePath, this.settings.wikisPath, wikiPath);
    }
    return wikiPath;
  }

  /*
    Given a wiki name this gets the wiki settings object if one is listed, 
    if the wiki isn't listed this returns undefined.
    This can be used to determine if a wiki is listed or not.
  */
  getWikiSettings (wikiName) {
    let wikiSettings = undefined;
    if (wikiName == 'RootWiki') {
      wikiSettings = {
        path: path.resolve($tw.boot.wikiPath),
        admin: this.settings.admin,
        readers: this.settings.readers,
        writers: this.settings.writers,
      }
    } else if (typeof this.settings.wikis[wikiName] === 'object') {
      wikiSettings = this.settings.wikis[wikiName];
      wikiSettings.admin = this.settings.admin,
      wikiSettings.readers = wikiSettings.readers || this.settings.readers,
      wikiSettings.writers = wikiSettings.writers || this.settings.writers
    }
    return wikiSettings;
  }

  /*
    This checks to make sure there is a tiddlwiki.info file in a wiki folder
    If so, the full wikipath is returned, else false is returned.
  */
  wikiExists (wikiFolder) {
    let exists = false;
    // Make sure that the wiki actually exists
    if (wikiFolder) {
      const basePath = this.getBasePath()
      // This is a bit hacky to get around problems with loading the root wiki
      // This tests if the wiki is the root wiki and ignores the other pathing
      // bits
      if (wikiFolder === $tw.boot.wikiPath) {
        wikiFolder = path.resolve($tw.boot.wikiPath)
      } else {
        // Get the correct path to the tiddlywiki.info file
        wikiFolder = path.resolve(basePath, this.settings.wikisPath, wikiFolder);
        // Make sure it exists
      }
      exists = fs.existsSync(path.resolve(wikiFolder, 'tiddlywiki.info'));
    }
    return exists? wikiFolder: false;
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