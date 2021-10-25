/*\
title: $:/plugins/commons/yjs/y-tiddlywiki.js
type: application/javascript
module-type: library

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/**
 * @module bindings/tiddlywiki
 */

 const { Awareness } = require('./awareness.cjs');
 const { createMutex } = require('./lib0/dist/mutex.cjs');
 const Delta = require('./external/quill-delta/delta.js');
 const Y = require('./yjs.cjs');
 
 /**
  * @param {any} twCursors
  */
 const updateCursor = (twCursors, aw, clientId, doc, type) => {
   try {
	 if (aw && aw.cursor && clientId !== doc.clientID) {
	   const user = aw.user || {}
	   const color = user.color || '#ffa500'
	   const name = user.name || `User: ${clientId}`
	   twCursors.createCursor(clientId.toString(), name, color)
	   const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(aw.cursor.anchor), doc)
	   const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(aw.cursor.head), doc)
	   if (anchor && head && anchor.type === type) {
		 twCursors.moveCursor(clientId.toString(), { index: anchor.index, length: head.index - anchor.index })
	   }
	 } else {
	   twCursors.removeCursor(clientId.toString())
	 }
   } catch (err) {
	 console.error(err)
   }
 }
 
 class TiddlywikiBinding {
	/**
		* @param {string} pathPrefix
		* @param {state} state
		* @param {Awareness} [awareness]
		*/
	constructor (pathPrefix, state, awareness) {
		const mux = createMutex()
		this.mux = mux
		this.url = $tw.node? state.boot.url + '/': state.syncadaptor.getHost();
		const wikiDoc = $tw.utils.getYDoc(pathPrefix);
		this.wikiDoc = wikiDoc
		const wikiTiddlers = wikiDoc.getArray("tiddlers");
		this.wikiTiddlers = wikiTiddlers;
		this.wikiTitles = wikiDoc.getArray("titles");
		this.wikiTombstones = wikiDoc.getArray("tombstones");

		const twCursors = null //quill.getModule('cursors') || null
		this.twCursors = twCursors
		this._bindAwareness = (awareness) => {
			this.awareness = awareness
			if (this.awareness && twCursors) {
				// init remote cursors
				this.awareness.getStates().forEach((aw, clientId) => {
					updateCursor(twCursors, aw, clientId, wikiDoc, wikiTiddlers)
				})
				this.awareness.on('change', this._awarenessChange)
			}
		}
		this._awarenessChange = ({ added, removed, updated }) => {
			const awarenessStates = /** @type {Awareness} */ (this.awareness).getStates()
			added.forEach(id => {
				//updateCursor(twCursors, awarenessStates.get(id), id, wikiDoc, wikiTiddlers)
			})
			updated.forEach(id => {
				//updateCursor(twCursors, awarenessStates.get(id), id, wikiDoc, wikiTiddlers)
			})
			removed.forEach(id => {
				//twCursors.removeCursor(id.toString())
			})
		}
		this._storeTiddler = (yMap) => {
			let title = yMap.get('title'),
				fields = {};
			yMap.forEach((value,key) => {
				fields[key] = value.toString();
			});
			if($tw.node) {
				state.wiki.addTiddler(new $tw.Tiddler(fields,{title: title}));
			} else {
				state.syncer.storeTiddler(fields);
			}
		}
		this._tiddlersObserver = (events,transaction) => {
			mux(() => {
				if(transaction.origin !== this) {
					let changedTiddlers = new Map();
					events.forEach(event => {
						if(event.target == event.currentTarget) {
							event.changes.added && event.changes.added.forEach(item => {
								// tiddlersMap event, a tiddler was added
								let target = item.content.type,
								title = target.get('title');
								if(!changedTiddlers.has(title)){
									changedTiddlers.set(title,target);
								}
							});
						} else {
							// YMap or YText event, a tiddler was updated
							let target = event.target instanceof Y.Map? event.target: event.target.parent,
								title = target.get('title');
							if(!changedTiddlers.has(title)){
								changedTiddlers.set(title,target);
							}
						}
					});
					changedTiddlers.forEach((target,title) => {
						let username = transaction.origin.username || "binding";
						$tw.utils.log(`['${username}'] Stored ${this.url}#[[${title}]]`);
						this._storeTiddler(target);
					});
				}
			})
		}
		this._tombstonesObserver = (event,transaction) => {
			mux(() => {
				if(transaction.origin !== this) {
					event.changes.added && event.changes.added.forEach(item => {
						$tw.utils.each(item.content.arr,(title) => {
							// A tiddler was deleted
							let username = transaction.origin.username || "binding";
							$tw.utils.log(`['${username}'] Deleted ${this.url}#[[${title}]]`);
							state.wiki.deleteTiddler(title);
						});						
					});
				}
			})
		}
		this.wikiTiddlers.observeDeep(this._tiddlersObserver)
		this.wikiTombstones.observe(this._tombstonesObserver)
		this._updateSelection = () => {
			// always check selection
			if (this.awareness && twCursors) {
				const sel = state.wiki.getSelection()
				const aw = /** @type {any} */ (this.awareness.getLocalState())
				if (sel === null) {
					if (this.awareness.getLocalState() !== null) {
						this.awareness.setLocalStateField('cursor', /** @type {any} */ (null))
					}
				} else {
					const anchor = Y.createRelativePositionFromTypeIndex(wikiTiddlers, sel.index)
					const head = Y.createRelativePositionFromTypeIndex(wikiTiddlers, sel.index + sel.length)
					if (!aw || !aw.cursor || !Y.compareRelativePositions(anchor, aw.cursor.anchor) || !Y.compareRelativePositions(head, aw.cursor.head)) {
						this.awareness.setLocalStateField('cursor', {
							anchor,
							head
						})
					}
				}
				// update all remote cursor locations
				this.awareness.getStates().forEach((aw, clientId) => {
					updateCursor(twCursors, aw, clientId, wikiDoc, wikiTiddlers)
				})
			}
		}
		this._save = (tiddler) => {
			let title = tiddler.fields.title;
			if ($tw.browser && state.syncadaptor.isReadOnly) {
				state.syncer.enqueueLoadTiddler(title); 
			} else {
				let tiddlerIndex = this.wikiTitles.toArray().indexOf(title);
				let tsIndex = this.wikiTombstones.toArray().indexOf(title);
				let changedFields = {}, deletedFields = [],
					tiddlerFields = tiddler.getFieldStrings();
				$tw.utils.each(tiddlerFields,(field,name) => {
					if(tiddlerIndex == -1 || !this.wikiTiddlers.get(tiddlerIndex).has(name)) {
						changedFields[name] = field;
					} else {
						let oldValue = this.wikiTiddlers.get(tiddlerIndex).get(name).toString();
						if($tw.utils.hashString(oldValue) != $tw.utils.hashString(field) ){
							changedFields[name] = field;
						}
					}
				});
				if(Object.keys(changedFields).length > 0) {
					this.wikiDoc.transact(() => {
						$tw.utils.log(`['binding'] Updating ${this.url}#[[${title}]]`);
						if(tiddlerIndex == -1){
							this.wikiTiddlers.push([new Y.Map()]);
							this.wikiTitles.push([title]);
							tiddlerIndex = this.wikiTitles.toArray().indexOf(title);
						}
						if(tsIndex !== -1) {
							this.wikiTombstones.delete(tsIndex,1)
						}
						let tiddlerMap = this.wikiTiddlers.get(tiddlerIndex);
						tiddlerMap.forEach((value,key) => {
							if(Object.keys(tiddler.fields).indexOf(key) == -1) {
								tiddlerMap.delete(key);
							}
						})
						let textFields = ["draft.title","list","tags","text"];
						$tw.utils.each(changedFields,(field,name) => {
							if(textFields.indexOf(name) != -1 || name.startsWith("text")) {
								let yText = tiddlerMap.has(name)? tiddlerMap.get(name): new Y.Text();
								let oldDelta = new Delta().insert(yText.toString()),
									newDelta = new Delta().insert(field),
									diff = oldDelta.diff(newDelta);
								if(diff.ops.length > 0) {
									yText.applyDelta(diff.ops);
								}
								if (!tiddlerMap.has(name)) {
									tiddlerMap.set(name,yText);
								}
							} else {
								tiddlerMap.set(name,field);
							}
						});
					},this)
				}
			}
		}
		this._load = (title) => {
			$tw.utils.log(`['binding'] Loading ${this.url}#[[${title}]]`);
			let fields = {};
			let tiddlerIndex = this.wikiTitles.toArray().indexOf(title)
			let tsIndex = this.wikiTombstones.toArray().indexOf(title)
			if(tsIndex == -1 && tiddlerIndex !== -1) {
				this.wikiTiddlers.get(tiddlerIndex).forEach((value,key) => {
					fields[key] = value.toString()
				})
			}
			return fields;
		}
		this._delete = (title) => {
			if ($tw.browser && state.syncadaptor.isReadOnly) {
				state.syncer.enqueueLoadTiddler(title); 
			} else {
				let tiddlerIndex = this.wikiTitles.toArray().indexOf(title)
				let tsIndex = this.wikiTombstones.toArray().indexOf(title)
				if (tiddlerIndex !== -1 || tsIndex == -1) {
					this.wikiDoc.transact(() => {
						$tw.utils.log(`['binding'] Deleting ${this.url}#[[${title}]]`);
						if(tiddlerIndex !== -1 ) {
							this.wikiTitles.delete(tiddlerIndex,1)
							this.wikiTiddlers.delete(tiddlerIndex,1)
						}
						if(tsIndex == -1) {
							this.wikiTombstones.push([title])
						}
					},this);
				}
			}
		}
		if($tw.node) {
			mux(() => {
				// Compare all tiddlers in the wiki to their YDoc maps on node server startup
				this.wikiDoc.transact(() => {
					// Delete those that are in maps, but not in titles
					let titles = state.syncer.filterFn.call(state.wiki),
						maps = this.wikiTitles.toArray(),
						diff = maps.filter(x => titles.indexOf(x) === -1);
					diff.forEach((title) => {
						$tw.utils.log(`['binding'] Startup, deleting ${this.url}#[[${title}]]`);
						this._delete(title);
					});
					// Update the tiddlers that changed during server restart
					$tw.utils.each(titles,(title) => {
						var tiddler = state.wiki.getTiddler(title);
						if(tiddler) {
							$tw.utils.log(`['binding'] Startup, testing ${this.url}#[[${title}]]`);
							this._save(tiddler)
						}
					});
				},this);
			})
		} else {
			this._bindAwareness(awareness)
		}
	}
	bindAwareness (awareness) {
		this.awareness.destroy()
		this._bindAwareness(awareness)
	} 
	save (tiddler,callback) {
		try {
			this._save(tiddler)
			this._updateSelection()
		} catch (error) {
			return callback(error)
		}
		return callback(null)
	}
	load (title,callback) {
		let fields = null
		try{
			fields = this._load(title)
		} catch (error) {
			return callback(error)
		}
		return callback(null,fields)
	}
	delete (title,callback) {
		try{
			this._delete(title)
		} catch (error) {
			return callback(error)
		}
		return callback(null)
	}
	destroy () {
		this.wikiTiddlers.unobserve(this._tiddlersObserver)
		if(this.awareness) {
			this.awareness.off('change', this._awarenessChange)
		}
		if($tw.ybindings.has(this.wikiDoc.name)) {
			$tw.ybindings.delete(this.wikiDoc.name);
		}
	}
 }

exports.TiddlywikiBinding = TiddlywikiBinding;