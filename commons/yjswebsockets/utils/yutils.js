/*\
title: $:/plugins/commons/yjs/utils/yutils.js
type: application/javascript
module-type: utils

Various yjs utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Setup external libraries
const map = require('../lib0/dist/map.cjs');
const TiddlywikiBinding = require('../y-tiddlywiki.js').TiddlywikiBinding;
const WikiDoc = require('../wikidoc.js').WikiDoc;

// Y Maps
$tw.ydocs = $tw.ydocs || new Map();
$tw.ybindings = $tw.ybindings || new Map();

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {Y.Doc}
 */
exports.getYDoc = function (docname, gc) {
	docname = docname || ''
	return map.setIfUndefined($tw.ydocs, docname, () => {
		const doc = new WikiDoc(docname);
		// disable gc when using snapshots!
		doc.gc = gc;
		doc.name = docname;
		$tw.ydocs.set(docname,doc);
		return doc;
	})
}

/**
 * Gets a Y-Tiddlywiki binding by name, whether in memory or on disk
 *
 * @param {Y.Doc} doc - the Y.Doc to bind
 * @param {state} state - state || $tw
 * @param {Y.awareness} awareness - state || $tw
 * @return {TiddlywikiBinding}
 */
exports.getYBinding = function (doc,state,awareness) {
	if(!doc || !state) return null;
	return map.setIfUndefined($tw.ybindings, doc.name, () => {
		const binding = new TiddlywikiBinding(doc,state,awareness);
		$tw.ybindings.set(doc.name,binding);
		return binding;
	})
}