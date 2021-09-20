/*\
title: $:/plugins/commons/yjs/node-wsadaptor.js
type: application/javascript
module-type: syncadaptor

A sync adaptor module for synchronising with the local filesystem via node.js APIs

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get a reference to the file system
const fs = $tw.node ? require("fs") : null,
	path = $tw.node ? require("path") : null,
    FileSystemAdaptor = require("$:/plugins/tiddlywiki/filesystem/filesystemadaptor.js").adaptorClass;

function WebsocketAdaptor(options) {
	var self = this;
	this.wiki = options.wiki;
	this.boot = options.boot || $tw.boot;
	this.logger = new $tw.utils.Logger("node-wsadaptor",{colour: "blue"});

	// Attach a core filesystemadaptor to this syncadaptor
    this.fsadaptor = new FileSystemAdaptor(options);

	// Initialise Yjs on node
	this.gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0';

	// Setup the YDoc for the wiki
	let wikiDoc = $tw.utils.getYDoc(wikiName);
	let wikiTitles = wikiDoc.getArray("wikiTitles");
	let wikiTiddlers = wikiDoc.getArray("wikiTiddlers");
	let wikiTombstones = wikiDoc.getArray("wikiTombstones");
	//Attach the persistence provider here

	// Attach a y-tiddlywiki provider here
	// This leaves each wiki's syncadaptor free to sync to disk or other storage

	// Setup the observers
	let stashTiddler = function(title) {
		let targetIndex = wikiTitles.toArray().indexOf(title);
		if(targetIndex !== -1) {
		// Save the tiddler
		let target = wikiTiddlers.get(targetIndex),
			fields = target.toJSON();
		state.wiki.addTiddler(new $tw.Tiddler(state.wiki.getCreationFields(),fields,{title: title},state.wiki.getModificationFields()));
		}
	}
	wikiTiddlers.observeDeep((events,transaction) => {
		if (transaction.origin !== state.wiki) {
		let targets = [];
		events.forEach(event => {
			if (event.target == event.currentTarget) {
			// A tiddler was added
			event.changes.added.forEach(added => {
				$tw.utils.log(added.content.type.toJSON());
				let title = added.content.type.get('title');
				if(targets.indexOf(title) == -1) {
				targets.push(title);
				}
			});
			} else {
			// A tiddler was modified
			$tw.utils.log(event.target.toJSON());
			let title = event.target.get("title");
			if(targets.indexOf(title) == -1) {
				targets.push(title);
			}
			}
		});
		targets.forEach((title) => {
			$tw.utils.log(`['${transaction.origin}'] Updating tiddler: ${title}`);
			stashTiddler(title);
		})
		}
	});
	wikiTombstones.observe((event,transaction) => {
		if (transaction.origin !== state.wiki) {
		event.delta.forEach(delta => {
			if(delta.insert) {
			delta.insert.forEach(item => {
				$tw.utils.log(`['${transaction.origin}'] Deleting tiddler: ${item}`);
				// A tiddler was deleted
				state.wiki.deleteTiddler(item)
			});
			}
		});
		}
	});

	// Setup the Wiki change event listener
	state.wiki.addEventListener("change",function(changes) {
		// Filter the changes to match the syncer settings
		let filteredChanges = state.syncer.getSyncedTiddlers(function(callback) {
		$tw.utils.each(changes,function(change,title) {
			var tiddler = state.wiki.tiddlerExists(title) && state.wiki.getTiddler(title);
			callback(tiddler,title);
		});
		});
		if(filteredChanges.length > 0) {
		let filteredTiddlers = {}
		$tw.utils.each(changes,function(change,title) {
			let changedFields = {},
			tiddlerIndex = wikiTitles.toArray().indexOf(title),
			tiddler = state.wiki.tiddlerExists(title) && state.wiki.getTiddler(title);
			if(tiddler && change.modified) {
			let tiddlerFields = tiddler.getFieldStrings();
			$tw.utils.each(tiddlerFields,function(field,name) {
				if(tiddlerIndex == -1 || !wikiTiddlers.get(tiddlerIndex).has(name) || 
				$tw.utils.hashString(field) !== $tw.utils.hashString(wikiTiddlers.get(tiddlerIndex).get(name))) {
				changedFields[name] = field;
				}
			});
			} else if(change.deleted && tiddlerIndex !== -1) {
			changedFields = null;
			}
			filteredTiddlers[title] = changedFields;
		});
		wikiDoc.transact(() => {
			$tw.utils.each(filteredTiddlers,function(changedFields,title) {
			let change = changes[title];
			let tiddler = state.wiki.tiddlerExists(title) && state.wiki.getTiddler(title);
			let tiddlerIndex = wikiTitles.toArray().indexOf(title);
			let tsIndex = wikiTombstones.toArray().indexOf(title);
			if(tiddler && change.modified) {
				let tiddlerMap = tiddlerIndex == -1? new Y.Map(): wikiTiddlers.get(tiddlerIndex);
				$tw.utils.each(changedFields,(field,name) => {
				tiddlerMap.set(name,field);
				});
				$tw.utils.each(tiddlerMap.toJSON(),(field,name) => {
				if(Object.keys(tiddler.fields).indexOf(name) == -1) {
					tiddlerMap.delete(name);
				}
				});
				if(tiddlerIndex == -1){
				wikiTiddlers.push([tiddlerMap]);
				wikiTitles.push([title]);
				}
				if(tsIndex !== -1) {
				wikiTombstones.delete(tsIndex,1)
				}
			} else if(change.deleted) {
				if (tiddlerIndex !== -1 ) {
				wikiTitles.delete(tiddlerIndex,1);
				wikiTiddlers.delete(tiddlerIndex,1);
				}
				if (tsIndex == -1) {
				wikiTombstones.push([title]);
				}
			}
			})
		},state.wiki);
		}
	})
}

WebsocketAdaptor.prototype.name = "node-wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = false;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.isReady = function() {
	return this.session && this.session.isReady();
};

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	//Returns the existing fileInfo for the tiddler. To regenerate, call getTiddlerFileInfo().
	var title = tiddler.fields.title;
	return this.boot.files[title];
};

/*
Return a fileInfo object for a tiddler, creating it if necessary:
  filepath: the absolute path to the file containing the tiddler
  type: the type of the tiddler file (NOT the type of the tiddler -- see below)
  hasMetaFile: true if the file also has a companion .meta file

The boot process populates this.boot.files for each of the tiddler files that it loads.
The type is found by looking up the extension in $tw.config.fileExtensionInfo (eg "application/x-tiddler" for ".tid" files).

It is the responsibility of the filesystem adaptor to update this.boot.files for new files that are created.
*/
WebsocketAdaptor.prototype.getTiddlerFileInfo = function(tiddler,callback) {
	// Always generate a fileInfo object when this fuction is called
	var title = tiddler.fields.title, newInfo, pathFilters, extFilters,
		fileInfo = this.boot.files[title];
	if(this.wiki.tiddlerExists("$:/config/FileSystemPaths")) {
		pathFilters = this.wiki.getTiddlerText("$:/config/FileSystemPaths","").split("\n");
	}
	if(this.wiki.tiddlerExists("$:/config/FileSystemExtensions")) {
		extFilters = this.wiki.getTiddlerText("$:/config/FileSystemExtensions","").split("\n");
	}
	newInfo = $tw.utils.generateTiddlerFileInfo(tiddler,{
		boot: this.boot,
		directory: this.boot.wikiTiddlersPath,
		pathFilters: pathFilters,
		extFilters: extFilters,
		wiki: this.wiki,
		fileInfo: fileInfo
	});
	callback(null,newInfo);
};


/*
Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
*/
WebsocketAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
	var self = this;
	var syncerInfo = options.tiddlerInfo || {};
	this.getTiddlerFileInfo(tiddler,function(err,fileInfo) {
		if(err) {
			return callback(err);
		}
		$tw.utils.saveTiddlerToFile(tiddler,fileInfo,function(err,fileInfo) {
			if(err) {
				if ((err.code == "EPERM" || err.code == "EACCES") && err.syscall == "open") {
					fileInfo = fileInfo || self.boot.files[tiddler.fields.title];
					fileInfo.writeError = true;
					self.boot.files[tiddler.fields.title] = fileInfo;
					$tw.syncer.logger.log("Sync failed for \""+tiddler.fields.title+"\" and will be retried with encoded filepath",encodeURIComponent(fileInfo.filepath));
					return callback(err);
				} else {
					return callback(err);
				}
			}
			// Store new boot info only after successful writes
			self.boot.files[tiddler.fields.title] = fileInfo;
			// Cleanup duplicates if the file moved or changed extensions
			var options = {
				adaptorInfo: syncerInfo.adaptorInfo || {},
				bootInfo: fileInfo || {},
				title: tiddler.fields.title
			};
			$tw.utils.cleanupTiddlerFiles(options,function(err,fileInfo) {
				if(err) {
					return callback(err);
				}
				return callback(null,fileInfo);
			});
		});
	});
};

/*
Load a tiddler and invoke the callback with (err,tiddlerFields)

We don't need to implement loading for the file system adaptor, because all the tiddler files will have been loaded during the boot process.
*/
WebsocketAdaptor.prototype.loadTiddler = function(title,callback) {
	callback(null,null);
};

/*
Delete a tiddler and invoke the callback with (err)
*/
WebsocketAdaptor.prototype.deleteTiddler = function(title,callback,options) {
	var self = this,
		fileInfo = this.boot.files[title];
	// Only delete the tiddler if we have writable information for the file
	if(fileInfo) {
		$tw.utils.deleteTiddlerFile(fileInfo,function(err,fileInfo) {
			if(err) {
				if ((err.code == "EPERM" || err.code == "EACCES") && err.syscall == "unlink") {
					// Error deleting the file on disk, should fail gracefully
					$tw.syncer.displayError("Server desynchronized. Error deleting file for deleted tiddler \"" + title + "\"",err);
					return callback(null,fileInfo);
				} else {
					return callback(err);
				}
			}
			// Remove the tiddler from self.boot.files & return null adaptorInfo
			delete self.boot.files[title];
			return callback(null,null);
		});
	} else {
		callback(null,null);
	}
};

if(fs) {
	//exports.adaptorClass = WebsocketAdaptor;
}
