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
		if(origin !== s.id) {
			s.send(encoder, doc.name);
		}
	})
}

class WikiDoc extends Y.Doc {
	/**
	 * @param {string} name
	 */
	constructor(name) {
		super({
			gc: true
		})
		this.name = name
		if($tw.node) {
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
			const awarenessChangeHandler = ({
				added,
				updated,
				removed
			}, origin) => {
				const changedClients = added.concat(updated, removed)
				if(origin !== null) {
					const connControlledIDs = /** @type {Set<number>} */ (this.sessions.get(origin))
					if(connControlledIDs !== undefined) {
						added.forEach(clientID => {
							connControlledIDs.add(clientID)
						})
						removed.forEach(clientID => {
							connControlledIDs.delete(clientID)
						})
					}
				}
				// broadcast awareness update
				const encoder = encoding.createEncoder()
				encoding.writeVarUint(encoder, messageAwareness)
				encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
				this.sessions.forEach((_, s) => {
					s.send(encoder, this.name);
				})
			}
			this.awareness.on('update', awarenessChangeHandler)
			this.on('update', updateHandler)
			/**
			 * @param {WebsocketSession} session
			 */
			this.on('message', (session, event) => {
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
									if(!session.isReadOnly) syncProtocol.readSyncStep2(decoder, eventDoc, session)
									break
								case syncProtocol.messageYjsUpdate:
									if(!session.isReadOnly) syncProtocol.readUpdate(decoder, eventDoc, session)
									break
								default:
									throw new Error('Unknown message type')
							}
							if(encoding.length(encoder) > 1) {
								session.send(encoder, eventDoc.name);
							}
							break
						}
						case messageAwareness: {
							awarenessProtocol.applyAwarenessUpdate(this.awareness, decoding.readVarUint8Array(decoder), session)
							break
						}
						case messageAuth: {
							break
						}
						case messageQueryAwareness: {
							break
						}
						case messageHandshake: {
							console.log(`['${session.id}'] Server Handshake`);
							// Refresh the session to expire in 60 minutes
							$tw.wsServer.refreshSession(session, 1000 * 60 * 60);
							// send messageHandshake
							const encoderHandshake = encoding.createEncoder();
							encoding.writeVarUint(encoderHandshake, messageHandshake);
							encoding.writeVarString(encoderHandshake, JSON.stringify({
								expires: session.expires
							}));
							session.send(encoderHandshake, this.name);
							// Start a sync
							// send sync step 1
							const encoderSync = encoding.createEncoder()
							encoding.writeVarUint(encoderSync, messageSync)
							syncProtocol.writeSyncStep1(encoderSync, this)
							session.send(encoderSync, this.name);
							// broadcast the doc awareness states
							const awarenessStates = this.awareness.getStates()
							if(awarenessStates.size > 0) {
								const encoderAwareness = encoding.createEncoder()
								encoding.writeVarUint(encoderAwareness, messageAwareness)
								encoding.writeVarUint8Array(encoderAwareness, awarenessProtocol.encodeAwarenessUpdate(this.awareness, Array.from(awarenessStates.keys())))
								session.send(encoderAwareness, this.name);
							}
							// Notify listeners
							session.emit('handshake',[session]);
							break
						}
						case messageHeartbeat: {
							// ping == 0, pong == 1
							const heartbeatType = decoding.readVarUint(decoder)
							if(heartbeatType == 0) {
								// incoming ping, send back a pong
								const encoderHeartbeat = encoding.createEncoder()
								encoding.writeVarUint(encoderHeartbeat, messageHeartbeat)
								encoding.writeVarUint(encoderHeartbeat, 1)
								session.send(encoderHeartbeat, this.name);
							} else if(heartbeatType == 1) {
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
					session.send(encoder, this.name);
					session.ws.close(4023, `Invalid session`);
				}
			})
			/**
			 * @param {WebsocketSession} session
			 */
			this.on('close', (session, event) => {
				if(this.sessions.has(session)) {
					/**
					 * @type {Set<number>}
					 */
					const controlledIds = this.sessions.get(session)
					this.sessions.delete(session)
					awarenessProtocol.removeAwarenessStates(this.awareness, Array.from(controlledIds), null)
					if(this.sessions.size === 0 && $tw.wsServer.persistence) {
						// if persisted, we store state and destroy ydocument
						$tw.wsServer.persistence.writeState(this.name, this).then(() => {
							this.destroy()
						})
						this.ydocs.delete(this.name)
					}
				}
				if(session.isReady()) {
					session.ws.close(1000, `['${this.id}'] Websocket closed by the server`, event);
				}
			})
		}
	}
}

exports.WikiDoc = WikiDoc;