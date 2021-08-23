/*\
title: $:/plugins/joshuafontany/tw5-yjs/YjsStartup.js
type: application/javascript
module-type: startup

This module setup up the required objects
and initializes all the settings

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "YjsStartup";
exports.before = ["startup"];
exports.platforms = ["browser","node"];
exports.synchronous = true;

const Yjs = new require('./Yjs.js');

exports.startup = function() {
  if ($tw.browser) {
      // Initialise Yjs in the browser
      $tw.Yjs = new Yjs.YSyncer();
      // Load the Wiki
      $tw.Yjs.loadWiki();
  } else {
    // Initialise Yjs on node
    $tw.Yjs = new Yjs.YServer();
    // Load the RootWiki
    $tw.Yjs.loadWiki("RootWiki");
  }
}
