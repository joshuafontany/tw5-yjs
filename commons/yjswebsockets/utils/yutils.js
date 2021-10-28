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
 * Gets a Y.Doc by uuid, whether in memory or on disk
 *
 * @param {string} docid - the uuid of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {Y.Doc}
 */
exports.getYDoc = function (docid,gc) {
	docid = docid || ''
	return map.setIfUndefined($tw.ydocs, docid, () => {
		const doc = new WikiDoc(docid);
		// disable gc when using snapshots!
		doc.gc = gc;
		doc.name = docid;
		$tw.ydocs.set(docid,doc);
		return doc;
	})
}

/**
 * Gets a Y-Tiddlywiki binding by name, whether in memory or on disk
 *
 * @param {string} docid - the Y.Doc to bind
 * @param {state} state - state || $tw
 * @param {Y.awareness} awareness - state || $tw
 * @return {TiddlywikiBinding}
 */
exports.getYBinding = function (docid,state,awareness) {
	if(!typeof docid == "string" || !state) return null;
	return map.setIfUndefined($tw.ybindings, docid, () => {
		const binding = new TiddlywikiBinding(docid,state,awareness);
		$tw.ybindings.set(docid,binding);
		return binding;
	});
}