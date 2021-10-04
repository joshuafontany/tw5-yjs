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

 const { createMutex } = require('./lib0/dist/mutex.js');
 const Y = require('./yjs.cjs');
 const { Awareness } = require('./awareness.cjs');
 
 /**
  * Removes the pending '\n's if it has no attributes.
  */
 export const normQuillDelta = delta => {
   if (delta.length > 0) {
	 const d = delta[delta.length - 1]
	 const insert = d.insert
	 if (d.attributes === undefined && insert !== undefined && insert.slice(-1) === '\n') {
	   delta = delta.slice()
	   let ins = insert.slice(0, -1)
	   while (ins.slice(-1) === '\n') {
		 ins = ins.slice(0, -1)
	   }
	   delta[delta.length - 1] = { insert: ins }
	   if (ins.length === 0) {
		 delta.pop()
	   }
	   return delta
	 }
   }
   return delta
 }
 
 /**
  * @param {any} quillCursors
  */
 const updateCursor = (quillCursors, aw, clientId, doc, type) => {
   try {
	 if (aw && aw.cursor && clientId !== doc.clientID) {
	   const user = aw.user || {}
	   const color = user.color || '#ffa500'
	   const name = user.name || `User: ${clientId}`
	   quillCursors.createCursor(clientId.toString(), name, color)
	   const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(aw.cursor.anchor), doc)
	   const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(aw.cursor.head), doc)
	   if (anchor && head && anchor.type === type) {
		 quillCursors.moveCursor(clientId.toString(), { index: anchor.index, length: head.index - anchor.index })
	   }
	 } else {
	   quillCursors.removeCursor(clientId.toString())
	 }
   } catch (err) {
	 console.error(err)
   }
 }
 
 export class TiddlywikiBinding {
   /**
	* @param {Y.Doc} wikiDoc
	* @param {$tw.Wiki} wiki
	* @param {Awareness} [awareness]
	*/
   constructor (wikiDoc, wiki, awareness) {
	 const mux = createMutex()
	 this.mux = mux
	 this.wikiDoc = wikiDoc
	 this.wiki = wiki
	 const wikiTiddlers = this.wikiDoc.getArray("wikiTiddlers");
	 this.wikiTiddlers = wikiTiddlers;
	 this.wikiTitles = this.wikiDoc.getArray("wikiTitles");
	 this.wikiTombstones = this.wikiDoc.getArray("wikiTombstones");

	 const twCursors = null //quill.getModule('cursors') || null
	 this.twCursors = twCursors
	 // This object contains all attributes used in the quill instance
	 this._negatedUsedFormats = {}
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
	 this._tiddlersObserver = (events,transaction) => {
		mux(() => {
			if(transaction.origin !== this) {
				events.forEach(event => {
					if(event.target == event.currentTarget) {
						event.changes.deleted && event.changes.deleted.forEach(item => {
							//$tw.utils.log(`['${transaction.origin}'] Deleting tiddler: ${item.content.type.get('title')}`);
							// A tiddler was deleted
							this.wiki.deleteTiddler(item.content.type.get('title'));
						});
						event.changes.added && event.changes.added.forEach(item => {
							// A tiddler was updated
							let title = item.content.type.get('title');
							//$tw.utils.log(`['${transaction.origin}'] Updating tiddler: ${title}`);
							$tw.syncer.titlesToBeLoaded[title] = true;
						});
					} else {
						// A tiddler was updated
						let title = event.target.get('title');
						$tw.utils.log(`['${transaction.origin}'] Updating tiddler: ${title}`);
						$tw.syncer.titlesToBeLoaded[title] = true;
					}
				});
				$tw.syncer.processTaskQueue();
			}
			const eventDelta = event.delta
			// We always explicitly set attributes, otherwise concurrent edits may
			// result in quill assuming that a text insertion shall inherit existing
			// attributes.
			const delta = []
			for (let i = 0; i < eventDelta.length; i++) {
			const d = eventDelta[i]
			if (d.insert !== undefined) {
				delta.push(Object.assign({}, d, { attributes: Object.assign({}, this._negatedUsedFormats, d.attributes || {}) }))
			} else {
				delta.push(d)
			}
			}
			wiki.updateContents(delta, 'yjs')
		})
	 }
	 this.wikiTiddlers.observeDeep(this._tiddlersObserver)
	 this._quillObserver = (eventType, delta) => {
	   if (delta && delta.ops) {
		 // update content
		 const ops = delta.ops
		 ops.forEach(op => {
		   if (op.attributes !== undefined) {
			 for (let key in op.attributes) {
			   if (this._negatedUsedFormats[key] === undefined) {
				 this._negatedUsedFormats[key] = false
			   }
			 }
		   }
		 })
		 mux(() => {
		   wikiTiddlers.applyDelta(ops)
		 })
	   }
	   // always check selection
	   if (awareness && twCursors) {
		 const sel = wiki.getSelection()
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
	 wiki.on('editor-change', this._quillObserver)
	 mux(() => {
	   // This indirectly initializes _negatedUsedFormats.
	   // Make sure that this call this after the _quillObserver is set.
	   wiki.setContents(wikiTiddlers.toDelta())
	 })
	 // init remote cursors
	 if (twCursors !== null && awareness) {
	   awareness.getStates().forEach((aw, clientId) => {
		 updateCursor(twCursors, aw, clientId, wikiDoc, wikiTiddlers)
	   })
	   awareness.on('change', this._awarenessChange)
	 }
   }
   destroy () {
	this.wikiTiddlers.unobserve(this._tiddlersObserver)
	 this.wiki.off('editor-change', this._quillObserver)
	 if (this.awareness) {
	   this.awareness.off('change', this._awarenessChange)
	 }
   }
 }

exports.TiddlywikiBinding = TiddlywikiBinding;