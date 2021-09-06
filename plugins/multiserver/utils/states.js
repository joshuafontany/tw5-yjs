/*\
title: $:/plugins/commons/multiserver/utils/states.js
type: application/javascript
module-type: utils-node

Various static utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const fs = require('fs'),
    path = require('path'),
    widget = require("$:/core/modules/widgets/widget.js");

// Multi Wiki methods

/*
    This function loads a wiki into a named state object.
*/
exports.loadStateWiki = function(serveInfo,pathPrefix,wikisPrefix) {
    // Load the wiki, preferring the $tw.config.editionsEnvVar path to $tw.config.editionsPath
    // This lets users serve editions with the same name as those in the tiddlywiki repository
    // and the user can choose to `includeWikis` a wiki from the repo to serve those tiddlers.
    let state = null,
        wikiName = typeof serveInfo === "string"? serveInfo: serveInfo.name,
        wikiPath = $tw.utils.findStateWiki(serveInfo);
    // Make sure it isn't loaded already
    if(wikiPath && !$tw.utils.hasStateWiki(wikiName)) {
/*         try { */
            //setup the tiddlywiki state instance
            let encodedName = encodeURIComponent(wikiName);
            state = {
                boot: {
                    files: [],
                    wikiInfo: null,
                    wikiPath: wikiPath,
                    wikiTiddlersPath: null
                },
                pathPrefix: pathPrefix? `/${pathPrefix}/${wikisPrefix}/${encodedName}`: `/${wikisPrefix}/${encodedName}`,
                rootWidget: null,
                route: new RegExp(pathPrefix? `^/${pathPrefix}/${wikisPrefix}/(${encodedName})/?(.+)?$`: `^/${wikisPrefix}/(${encodedName})/?(.+)?$`),
                wiki: new $tw.Wiki(),
                wikiName: wikiName
            };
            // Load the boot tiddlers (from $tw.loadTiddlersNode)
            $tw.utils.each($tw.loadTiddlersFromPath($tw.boot.bootPath),function(tiddlerFile) {
                state.wiki.addTiddlers(tiddlerFile.tiddlers);
            });
            // Load the core tiddlers
            state.wiki.addTiddler($tw.loadPluginFolder($tw.boot.corePath));
            // Load any extra plugins
            $tw.utils.each($tw.boot.extraPlugins,function(name) {
                if(name.charAt(0) === "+") { // Relative path to plugin
                    var pluginFields = $tw.loadPluginFolder(name.substring(1));
                    if(pluginFields) {
                        state.wiki.addTiddler(pluginFields);
                    }
                } else {
                    var parts = name.split("/"),
                        type = parts[0];
                    if(parts.length  === 3 && ["plugins","themes","languages"].indexOf(type) !== -1) {
                        $tw.utils.loadStatePlugins(state,[parts[1] + "/" + parts[2]],$tw.config[type + "Path"],$tw.config[type + "EnvVar"]);
                    }
                }
            });
            // Load the tiddlers from the wiki directory
            state.boot.wikiInfo = $tw.utils.loadStateWikiTiddlersNode(state,wikiPath);
            // Unpack plugin tiddlers
            state.wiki.readPluginInfo();
            state.wiki.registerPluginTiddlers("plugin",$tw.safeMode ? ["$:/core"] : undefined);
            state.wiki.unpackPluginTiddlers();
            // Process "safe mode"
            if($tw.safeMode) {
                state.wiki.processSafeMode();
            }
            /* // Register typed modules from the tiddlers we've just loaded
            state.wiki.defineTiddlerModules();
            // And any modules within plugins, but don't overwrite the RootWiki modules!
            state.wiki.eachShadow(function(tiddler,title) {
                // Don't define the module if it is overidden by an ordinary tiddler or it is already defined
                if(!$tw.utils.hop($tw.modules.titles,title) && !state.wiki.tiddlerExists(title) && tiddler.hasField("module-type")) {
                    // Define the module
                    $tw.modules.define(tiddler.fields.title,tiddler.fields["module-type"],tiddler.fields.text);
                }
            }); */
            // Create a root widget for attaching event handlers. By using it as the parentWidget for another widget tree, one can reuse the event handlers
            state.rootWidget = new widget.widget({
                type: "widget",
                children: []
            },{
                    wiki: state.wiki,
                    document: $tw.fakeDocument
            });
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
            state.wiki.addTiddler(new $tw.Tiddler({
                title: '$:/status/WikiName',
                text: wikiName,
                route: state.pathPrefix
            }));
            // Setup the config prefix path. For backwards compatibility we use $:/config/tiddlyweb/host
            state.wiki.addTiddler(new $tw.Tiddler({
                title: '$:/config/tiddlyweb/host',
                text: `$protocol$//$host$${state.pathPrefix}/`
            }));
            // Set the wiki as loaded
            $tw.utils.setStateWiki(wikiName,state);
            $tw.hooks.invokeHook('wiki-loaded',wikiName);
 /*        } catch (err) {debugger;
            $tw.utils.error(err);
        } */
    }
    return state;
};

/*
    name: Name of the wiki to find
    paths: array of file paths to search for it
    Returns the path of the wiki folder, 
    searching from the end of the paths array
*/
exports.findStateWiki = function(serveInfo) {
    if (typeof serveInfo === "string" && serveInfo !== "RootWiki" || serveInfo.name !== "RootWiki") {
        let wikiPath = typeof serveInfo === "string"? serveInfo: serveInfo.path;
        let paths = $tw.getLibraryItemSearchPaths($tw.config.editionsPath,$tw.config.editionsEnvVar);
        // Send the core library path to the end of the paths array, so it is searched last
        paths.push(paths.shift());
        var pathIndex = 0;
        do {
            var finalPath = path.resolve(paths[pathIndex],wikiPath)
            if(fs.existsSync(finalPath) && fs.statSync(finalPath).isDirectory()) {
                return finalPath;
            }
        } while(++pathIndex < paths.length);
        $tw.utils.log("findWikiState error, serveInfo: "+JSON.stringify(serveInfo,null,2));
    }
	return null;
}
    
/*
    state: a tiddlywiki state instance  
    path: path of wiki directory
    options:
        parentPaths: array of parent paths that we mustn't recurse into
        readOnly: true if the tiddler file paths should not be retained
*/
exports.loadStateWikiTiddlersNode = function(state,wikiPath,options) {
    options = options || {};
    let parentPaths = options.parentPaths || [],
        wikiInfoPath = path.resolve(wikiPath,$tw.config.wikiInfo),
        wikiInfo,
        pluginFields;
    // Bail if we don't have a wiki info file
    if(fs.existsSync(wikiInfoPath)) {
        wikiInfo = JSON.parse(fs.readFileSync(wikiInfoPath,"utf8"));
    } else {
        $tw.utils.log(`loadStateWikiTiddlersNode error, unable to find '${wikiInfoPath}'`);
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
                let subWikiInfo = $tw.utils.loadStateWikiTiddlersNode(state,resolvedIncludedWikiPath,{
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
    $tw.utils.log(`Warning for Wiki '${state.wikiName}': Cannot find plugin '${name}'`);
};

// Wiki State methods

exports.getStateWiki = function(wikiName) {
    let state = null;
    if (wikiName == "RootWiki") {
        state = $tw;
    } else if ($tw.states.has(wikiName)) {
        state = $tw.states.get(wikiName);
    }
    return state;
}

exports.setStateWiki = function(wikiName,state) {
    if (wikiName !== "RootWiki") {
        $tw.states.set(wikiName,state)
    }
}

exports.hasStateWiki = function(wikiName,state) {
    if (wikiName == "RootWiki") {
        return true;
    } else {
        return $tw.states.has(wikiName)
    }
}