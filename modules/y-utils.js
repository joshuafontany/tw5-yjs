/*\
title: $:/plugins/commons/yjs/y-utils.js
type: application/javascript
module-type: utils

Various yjs utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Setup external libraries
const Y = require('yjs');
const map = require('lib0/dist/map.cjs');

// Y Maps
$tw.ydocs = $tw.ydocs || new Map();

/**
 * Gets a Y.Doc by uuid/name
 *
 * @param {string} docid - the uuid of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {Y.Doc}
 */
exports.getYDoc = function (docid,gc) {
	return map.setIfUndefined($tw.ydocs, docid, () => {
		const doc = new Y.Doc(docid);
		// disable gc when using snapshots!
		doc.gc = gc;
		doc.name = docid;
		$tw.ydocs.set(docid,doc);
		return doc;
	})
}