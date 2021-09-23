/*\
title: $:/plugins/commons/yjs/utils/uuid.js
type: application/javascript
module-type: utils

Various static utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Setup external libraries

if($tw.node) {
    exports.uuid = require('../external/uuid/index.js');
} else {
    exports.uuid = {
        NIL: require('../external/uuid/index.js').NIL,
        validate: require('../external/uuid/index.js').validate
    };
}