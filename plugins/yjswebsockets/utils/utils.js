/*\
title: $:/plugins/commons/yjs/utils/utils.js
type: application/javascript
module-type: utils

Various yjs utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Setup external libraries
const map = require('../lib0/dist/map.cjs');
const WikiDoc = require('../wikidoc.js').WikiDoc;

// YDocs
$tw.YDocs = new Map();

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {Y.Doc}
 */
exports.getYDoc = function(docname,gc = $tw.node? $tw.wsServer && $tw.wsServer.gcEnabled: $tw.syncadaptor && $tw.syncadaptor.gcEnabled) {
    return map.setIfUndefined($tw.YDocs, docname, () => {
        const doc = new WikiDoc(docname);
        // disable gc when using snapshots!
        doc.gc = gc;
        doc.name = docname;
        if ($tw.node? $tw.wsServer && $tw.wsServer.persistence !== null: $tw.syncadaptor && $tw.syncadaptor.persistence !== null) {
            $tw.node? $tw.wsServer.persistence.bindState(docname,doc): $tw.syncadaptor.persistence.bindState(docname,doc);
        }
        $tw.YDocs.set(docname,doc);
        return doc;
    })
}