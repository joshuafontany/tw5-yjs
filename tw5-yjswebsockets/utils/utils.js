/*\
title: $:/plugins/joshuafontany/tw5-yjs/utils.js
type: application/javascript
module-type: utils-node

Various static utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Setup external libraries

exports.uuid = {
    NIL: require('./external/uuid/index.js').NIL,
    validate: require('./external/uuid/index.js').validate
};