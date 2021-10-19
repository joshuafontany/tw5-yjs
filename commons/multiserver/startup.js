/*\
title: $:/plugins/commons/multiserver/startup.js
type: application/javascript
module-type: startup

Initialise the multiserver settings and root config tiddler

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "multiwiki-startup";
exports.platforms = ["node"];
exports.before = ["startup"];
exports.after = ["info"];
exports.synchronous = true;

if($tw.node) {

const fs = require('fs'),
    path = require('path'),
    CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host",
    DEFAULT_HOST_TIDDLER = "$protocol$//$host$/";

exports.startup = function() {
    // Initialise the multiserver settings
    let settings;
    try {
        settings = JSON.parse(fs.readFileSync(path.join($tw.boot.wikiPath, "settings", "multiserver.json")));
    } catch (err) {
        $tw.utils.log("Server Settings Error - using default values.");
        settings = {};
    }
    $tw.boot.settings = $tw.utils.extend($tw.wiki.getTiddlerData("$:/config/commons/multiserver", {}), settings);
    // Init the root state
    $tw.boot.origin = $tw.boot.settings.origin || DEFAULT_HOST_TIDDLER.replace(/\/$/, '');
    $tw.boot.pathPrefix = $tw.boot.settings["path-prefix"] || "";
    $tw.boot.regexp = null;
    $tw.boot.serveInfo = {
        name: $tw.boot.pathPrefix,
        path: $tw.boot.pathPrefix || "./"
    };
    // Setup the config tiddler. For backwards compatibility we use $:/config/tiddlyweb/host
    let tiddler = $tw.wiki.getTiddler(CONFIG_HOST_TIDDLER),
    newFields = {
        title: CONFIG_HOST_TIDDLER,
        text: `${$tw.boot.origin}${$tw.boot.pathPrefix}/`,
        origin: $tw.boot.origin
    };
    $tw.wiki.addTiddler(new $tw.Tiddler(tiddler,newFields));
};

}
