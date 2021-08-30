/*\
title: $:/plugins/joshuafontany/tw5-yjs/utils/utils-node.js
type: application/javascript
module-type: utils-node

Various static utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const path = require('path');

// Wikis map
$tw.wikiStates = new Map();

// Multi-Wiki methods

/*
    This checks to make sure there is a tiddlwiki.info file in a wiki folder,
    or a readable file at the given wikiPath. It does not check if they are valid.
*/
exports.wikiExists = function(wikiPath) {
    let exists = false, wikiStats = undefined;
    // Make sure that the wiki actually exists
    wikiStats = fs.statSync(wikiPath,{throwIfNoEntry: false});
    if (wikiStats) {
        exists = wikiStats.isFile() || fs.existsSync(path.resolve(wikiPath,$tw.config.wikiInfo));
    }
    return exists;
};

/*
    This function loads a wiki into a named state object.
*/
exports.loadWikiState = function(serveInfo,prefix) {
    let state = null,
        wikiName = typeof serveInfo === "string"? path.basename(serveInfo,path.extname(serveInfo) || ".html"): serveInfo.name,
        wikiPath = typeof serveInfo === "string"? serveInfo: serveInfo.path;
    // Make sure it isn't loaded already
    if(!$tw.wikiStates.has(wikiName) && $tw.utils.wikiExists(wikiPath)) {
        try {
            //setup the tiddlywiki state instance
            state = {boot: null, pathPrefix: null, wiki: null};
            //Create new Wiki objects
            state.boot = {wikiPath: wikiPath};
            state.pathPrefix = prefix + "/wikis/" + encodeURIComponent(wikiName);
            state.wiki = new $tw.Wiki();
            // Load the boot tiddlers (from $tw.loadTiddlersNode)
            $tw.utils.each($tw.loadTiddlersFromPath($tw.boot.bootPath),function(tiddlerFile) {
                state.wiki.addTiddlers(tiddlerFile.tiddlers);
            });
            // Load the core tiddlers
            state.wiki.addTiddler($tw.loadPluginFolder($tw.boot.corePath));
            // Load the tiddlers from the wiki directory
            state.boot.wikiInfo = $tw.utils.loadWikiStateTiddlers(state,wikiPath);
            // Create a root widget for attaching event handlers. By using it as the parentWidget for another widget tree, one can reuse the event handlers
            state.rootWidget = new widget.widget(
                {
                    type: "widget",
                    children: []
                },{
                    wiki: state.wiki,
                    document: $tw.fakeDocument
                }
            );
            // Execute any startup actions
            state.rootWidget.invokeActionsByTag("$:/tags/StartupAction");
            state.rootWidget.invokeActionsByTag("$:/tags/StartupAction/Node");
            // Attach the syncadaptor & syncer
            // Find a working syncadaptor
            state.syncadaptor = undefined;
            $tw.modules.forEachModuleOfType("syncadaptor",function(title,module) {
                if(!state.syncadaptor && module.adaptorClass) {
                    state.syncadaptor = new module.adaptorClass({boot: state.boot, wiki: state.wiki});
                }
            });
            // Set up the syncer object if we've got a syncadaptor
            if(state.syncadaptor) {
                state.syncer = new $tw.Syncer({wiki: state.wiki, syncadaptor: state.syncadaptor});
            }
            // Name the wiki
            state.wikiName = wikiName;
            const fields = {
                title: '$:/status/WikiName',
                text: wikiName,
            };
            state.wiki.addTiddler(new $tw.Tiddler(fields));
            // Set the wiki as loaded
            $tw.wikiStates.set(wikiName,state);
            $tw.hooks.invokeHook('wiki-loaded',wikiName);
        } catch (err) {
            console.error(err);
        }
    }
    return state;
};
    
/*
    state: a tiddlywiki state instance  
    path: path of wiki directory
    options:
        parentPaths: array of parent paths that we mustn't recurse into
        readOnly: true if the tiddler file paths should not be retained
*/
exports.loadWikiStateTiddlers = function(state,wikiPath,options) {
    options = options || {};
    let parentPaths = options.parentPaths || [],
        wikiInfoPath = path.resolve(wikiPath,$tw.config.wikiInfo),
        wikiInfo,
        pluginFields;
    // Bail if we don't have a wiki info file
    if(fs.existsSync(wikiInfoPath)) {
        wikiInfo = JSON.parse(fs.readFileSync(wikiInfoPath,"utf8"));
    } else {
        return null;
    }
    // Save the path to the tiddlers folder for the filesystemadaptor
    let config = wikiInfo.config || {};
    if(state.boot.wikiPath == wikiPath) {
        state.boot.wikiTiddlersPath = path.resolve(state.boot.wikiPath,config["default-tiddler-location"] || $tw.config.wikiTiddlersSubDir);
    }
    // Load any included wikis
    if(wikiInfo.includeWikis) {
        parentPaths = parentPaths.slice(0);
        parentPaths.push(wikiPath);
        $tw.utils.each(wikiInfo.includeWikis,function(info) {
        if(typeof info === "string") {
            info = {path: info};
        }
        let resolvedIncludedWikiPath = path.resolve(wikiPath,info.path);
        if(parentPaths.indexOf(resolvedIncludedWikiPath) === -1) {
            let subWikiInfo = $tw.loadWikiTiddlers(state,resolvedIncludedWikiPath,{
            parentPaths: parentPaths,
            readOnly: info["read-only"]
            });
            // Merge the build targets
            wikiInfo.build = $tw.utils.extend([],subWikiInfo.build,wikiInfo.build);
        } else {
            $tw.utils.error("Cannot recursively include wiki " + resolvedIncludedWikiPath);
        }
        });
    }
    // Load any plugins, themes and languages listed in the wiki info file
    $tw.utils.loadStatePlugins(state,wikiInfo.plugins,$tw.config.pluginsPath,$tw.config.pluginsEnvVar);
    $tw.utils.loadStatePlugins(state,wikiInfo.themes,$tw.config.themesPath,$tw.config.themesEnvVar);
    $tw.utils.loadStatePlugins(state,wikiInfo.languages,$tw.config.languagesPath,$tw.config.languagesEnvVar);
    // Load the wiki files, registering them as writable
    let resolvedWikiPath = path.resolve(wikiPath,$tw.config.wikiTiddlersSubDir);
    $tw.utils.each($tw.loadTiddlersFromPath(resolvedWikiPath),function(tiddlerFile) {
        if(!options.readOnly && tiddlerFile.filepath) {
            $tw.utils.each(tiddlerFile.tiddlers,function(tiddler) {
                state.boot.files[tiddler.title] = {
                filepath: tiddlerFile.filepath,
                type: tiddlerFile.type,
                hasMetaFile: tiddlerFile.hasMetaFile,
                isEditableFile: config["retain-original-tiddler-path"] || tiddlerFile.isEditableFile || tiddlerFile.filepath.indexOf(state.boot.wikiTiddlersPath) !== 0
                };
            });
        }
        state.wiki.addTiddlers(tiddlerFile.tiddlers);
    });
    if(state.boot.wikiPath == wikiPath) {
        // Save the original tiddler file locations if requested
        let output = {}, relativePath, fileInfo;
        for(let title in state.boot.files) {
            fileInfo = state.boot.files[title];
            if(fileInfo.isEditableFile) {
                relativePath = path.relative(state.boot.wikiTiddlersPath,fileInfo.filepath);
                fileInfo.originalpath = relativePath;
                output[title] =
                path.sep === "/" ?
                relativePath :
                relativePath.split(path.sep).join("/");
            }
        }
        if(Object.keys(output).length > 0){
        state.wiki.addTiddler({title: "$:/config/OriginalTiddlerPaths", type: "application/json", text: JSON.stringify(output)});
        }
    }
    // Load any plugins within the wiki folder
    let wikiPluginsPath = path.resolve(wikiPath,$tw.config.wikiPluginsSubDir);
    if(fs.existsSync(wikiPluginsPath)) {
        let pluginFolders = fs.readdirSync(wikiPluginsPath);
        for(let t=0; t<pluginFolders.length; t++) {
            pluginFields = $tw.loadPluginFolder(path.resolve(wikiPluginsPath,"./" + pluginFolders[t]));
            if(pluginFields) {
                state.wiki.addTiddler(pluginFields);
            }
        }
    }
    // Load any themes within the wiki folder
    let wikiThemesPath = path.resolve(wikiPath,$tw.config.wikiThemesSubDir);
    if(fs.existsSync(wikiThemesPath)) {
        let themeFolders = fs.readdirSync(wikiThemesPath);
        for(let t=0; t<themeFolders.length; t++) {
            pluginFields = $tw.loadPluginFolder(path.resolve(wikiThemesPath,"./" + themeFolders[t]));
            if(pluginFields) {
                state.wiki.addTiddler(pluginFields);
            }
        }
    }
    // Load any languages within the wiki folder
    let wikiLanguagesPath = path.resolve(wikiPath,$tw.config.wikiLanguagesSubDir);
    if(fs.existsSync(wikiLanguagesPath)) {
        let languageFolders = fs.readdirSync(wikiLanguagesPath);
        for(let t=0; t<languageFolders.length; t++) {
            pluginFields = $tw.loadPluginFolder(path.resolve(wikiLanguagesPath,"./" + languageFolders[t]));
            if(pluginFields) {
                state.wiki.addTiddler(pluginFields);
            }
        }
    }
    return wikiInfo;
};
    
/*
    state: a tiddlywiki state instance
    plugins: Array of names of plugins (eg, "tiddlywiki/filesystemadaptor")
    libraryPath: Path of library folder for these plugins (relative to core path)
    envVar: Environment variable name for these plugins
*/
exports.loadStatePlugins = function(state,plugins,libraryPath,envVar) {
    if(plugins) {
        var pluginPaths = $tw.getLibraryItemSearchPaths(libraryPath,envVar);
        for(var t=0; t<plugins.length; t++) {
            $tw.utils.loadStatePlugin(state,plugins[t],pluginPaths);
        }
    }
};

/*
    state: a tiddlywiki state instance
    name: Name of the plugin to load
    paths: array of file paths to search for it
*/
exports.loadStatePlugin = function(state,name,paths) {
    var pluginPath = $tw.findLibraryItem(name,paths);
    if(pluginPath) {
        var pluginFields = $tw.loadPluginFolder(pluginPath);
        if(pluginFields) {
            state.wiki.addTiddler(pluginFields);
            return;
        }
    }
    console.log("Warning: Cannot find plugin '" + name + "'");
};

/*
    Given a wiki name this gets the current tiddlywiki state object
*/
exports.getWikiState = function(wikiName) {
    let state = null;
    if (wikiName == "RootWiki") {
        state = $tw;
    } else if ($tw.wikiStates.has(wikiName)) {
        state = $tw.wikiStates.get(wikiName);
    }
    return state;
}