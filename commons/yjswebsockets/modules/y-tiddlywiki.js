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

 const { createMutex } = require('./lib0/dist/mutex.cjs');
 const Y = require('./yjs.cjs');
 const { Awareness } = require('./awareness.cjs');
 
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
		* @param {Y.Doc} wikiDoc
		* @param {state} state
		* @param {Awareness} [awareness]
		*/
	constructor (wikiDoc, state, awareness) {
		const mux = createMutex()
		this.mux = mux
		this.wikiDoc = wikiDoc
		const wikiTiddlers = this.wikiDoc.getArray("wikiTiddlers");
		this.wikiTiddlers = wikiTiddlers;
		this.wikiTitles = this.wikiDoc.getArray("wikiTitles");
		this.wikiTombstones = this.wikiDoc.getArray("wikiTombstones");

		const twCursors = null //quill.getModule('cursors') || null
		this.twCursors = twCursors
		this.awareness = awareness
		this._awarenessChange = ({ added, removed, updated }) => {
			const states = /** @type {Awareness} */ (awareness).getStates()
			added.forEach(id => {
				updateCursor(twCursors, states.get(id), id, wikiDoc, wikiTiddlers)
			})
			updated.forEach(id => {
				updateCursor(twCursors, states.get(id), id, wikiDoc, wikiTiddlers)
			})
			removed.forEach(id => {
				twCursors.removeCursor(id.toString())
			})
		}
		this._saveTiddler = (title,fields) => {
			if($tw.node) {
				state.wiki.addTiddler(new $tw.Tiddler(fields,{title: title}));
			} else {
				state.syncer.storeTiddler(fields);
			}
		}
		this._tiddlersObserver = (events,transaction) => {
			mux(() => {
				if(transaction.origin !== this) {
					events.forEach(event => {
						if(event.target == event.currentTarget) {
							event.changes.added && event.changes.added.forEach(item => {
								// A tiddler was added
								let title = item.content.type.get('title'),
									fields = item.content.type.toJSON();
								$tw.utils.log(`['${transaction.origin.username}|${this.wikiDoc.name}'] Saved: ${title}`);
								this._saveTiddler(title,fields);
							});
						} else {
							// A tiddler was updated
							let title = event.target.get('title'),
								fields = event.target.toJSON();
							$tw.utils.log(`['${transaction.origin.username}|${this.wikiDoc.name}'] Saved: ${title}`);
							this._saveTiddler(title,fields);
						}
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
							$tw.utils.log(`['${transaction.origin.username}|${this.wikiDoc.name}'] Deleted: ${title}`);
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
			if (awareness && twCursors) {
				const sel = state.wiki.getSelection()
				const aw = /** @type {any} */ (awareness.getLocalState())
				if (sel === null) {
					if (awareness.getLocalState() !== null) {
						awareness.setLocalStateField('cursor', /** @type {any} */ (null))
					}
				} else {
					const anchor = Y.createRelativePositionFromTypeIndex(wikiTiddlers, sel.index)
					const head = Y.createRelativePositionFromTypeIndex(wikiTiddlers, sel.index + sel.length)
					if (!aw || !aw.cursor || !Y.compareRelativePositions(anchor, aw.cursor.anchor) || !Y.compareRelativePositions(head, aw.cursor.head)) {
						awareness.setLocalStateField('cursor', {
							anchor,
							head
						})
					}
				}
				// update all remote cursor locations
				awareness.getStates().forEach((aw, clientId) => {
					updateCursor(twCursors, aw, clientId, wikiDoc, wikiTiddlers)
				})
			}
		}
		this._save = (tiddler) => {
			let title = tiddler.fields.title;
			let tiddlerIndex = this.wikiTitles.toArray().indexOf(title);
			let tsIndex = this.wikiTombstones.toArray().indexOf(title);
			let changedFields = {},
				tiddlerFields = tiddler.getFieldStrings();
			$tw.utils.each(tiddlerFields,(field,name) => {
				if(tiddlerIndex == -1 || !this.wikiTiddlers.get(tiddlerIndex).has(name) || 
					$tw.utils.hashString(field) !== $tw.utils.hashString(this.wikiTiddlers.get(tiddlerIndex).get(name))) {
					changedFields[name] = field;
				}
			});
			if(Object.keys(changedFields).length > 0) {
				this.wikiDoc.transact(() => {
					$tw.utils.log(`['binding'] updating: ${title}`);
					if(tiddlerIndex == -1){
						this.wikiTiddlers.push([new Y.Map()]);
						this.wikiTitles.push([title]);
						tiddlerIndex = this.wikiTitles.toArray().indexOf(title);
					}
					if(tsIndex !== -1) {
						this.wikiTombstones.delete(tsIndex,1)
					}
					let tiddlerMap = this.wikiTiddlers.get(tiddlerIndex);
					$tw.utils.each(tiddlerMap.toJSON(),(field,name) => {
						if(Object.keys(tiddler.fields).indexOf(name) == -1) {
							tiddlerMap.delete(name);
						}
					});
					$tw.utils.each(changedFields,(field,name) => {
						tiddlerMap.set(name,field);
					});		
				},this)
			}
		}
		this._load = (title) => {
			$tw.utils.log(`['binding'] loading: ${title}`);
			let fields = null;
			let tiddlerIndex = this.wikiTitles.toArray().indexOf(title)
			let tsIndex = this.wikiTombstones.toArray().indexOf(title)
			if(tsIndex == -1 && tiddlerIndex !== -1) {
				fields = this.wikiTiddlers.get(tiddlerIndex).toJSON()
			}
			return fields;
		}
		this._delete = (title) => {
			let tiddlerIndex = this.wikiTitles.toArray().indexOf(title)
			let tsIndex = this.wikiTombstones.toArray().indexOf(title)
			if (tiddlerIndex !== -1 || tsIndex == -1) {
				this.wikiDoc.transact(() => {
					$tw.utils.log(`['binding'] deleting: ${title}`);
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
		if($tw.node) {
			mux(() => {
				// Compare all tiddlers in the wiki to their YDoc maps on startup
				this.wikiDoc.transact(() => {
					// Delete those that are in maps, but not in titles
					let titles = state.syncer.filterFn.call(state.wiki),
						maps = this.wikiTitles.toArray(),
						diff = maps.filter(x => titles.indexOf(x) === -1);
					diff.forEach((title) => {
						$tw.utils.log(`['${this.wikiDoc.name}'] Startup, deleting: ${title}`);
						this._delete(title);
					});
					// Update the tiddlers that changed during server restart
					$tw.utils.each(titles,(title) => {
						var tiddler = state.wiki.getTiddler(title);
						if(tiddler) {
							$tw.utils.log(`['${this.wikiDoc.name}'] Startup, checking: ${title}`);
							this._save(tiddler)
						}
					});
				},this);
			})
		} else if (twCursors !== null && awareness) {
			// init remote cursors
			awareness.getStates().forEach((aw, clientId) => {
				updateCursor(twCursors, aw, clientId, wikiDoc, wikiTiddlers)
			})
			awareness.on('change', this._awarenessChange)
		}
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
		try{
			this._load(title)
		} catch (error) {
			return callback(error)
		}
		return callback(null)
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