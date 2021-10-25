/*\
title: $:/plugins/commons/yjs/node-wsadaptor.js
type: application/javascript
module-type: syncadaptor

A sync adaptor module for synchronising Yjs websockets with the local filesystem via node.js APIs

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get a reference to the file system
const FileSystemAdaptor = require("$:/plugins/tiddlywiki/filesystem/filesystemadaptor.js").adaptorClass,
	CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host",
	DEFAULT_HOST_TIDDLER = "$protocol$//$host$/";

function WebsocketAdaptor(options) {
	this.wiki = options.wiki;
	this.boot = options.boot || $tw.boot;
	this.pathPrefix = this.getPathPrefix();
	this.logger = new $tw.utils.Logger("wsadaptor",{colour: "blue"});

	// Attach a core filesystemadaptor to this syncadaptor
    this.fsadaptor = new FileSystemAdaptor(options);

    // disable gc when using snapshots!
	this.gcEnabled = this.wiki.getTiddlerText("$:/config/yjs/gcEnabled","yes") == "yes";

    /**
	 * @type {{bindState: function(string,WikiDoc):void, writeState:function(string,WikiDoc):Promise<any>, provider: any}|null}
	 */
/*  $tw.utils.log(`Persisting Y documents to './leveldb/${this.pathPrefix}'`)
    const LeveldbPersistence = require('./y-leveldb.cjs').LeveldbPersistence
    const ldb = new LeveldbPersistence(`./leveldb/${this.pathPrefix}`)
    this.persistence = {
        provider: ldb,
        bindState: async (docName,ydoc) => {
            const persistedYdoc = await ldb.getYDoc(docName)
            const newUpdates = Y.encodeStateAsUpdate(ydoc)
            ldb.storeUpdate(docName,newUpdates)
            Y.applyUpdate(ydoc,Y.encodeStateAsUpdate(persistedYdoc))
            ydoc.on('update',update => {
                ldb.storeUpdate(docName,update)
            })
        },
        writeState: async (docName, ydoc) => {}
    } */

	// Setup the Y wikiDoc
	let wikiDoc = $tw.utils.getYDoc(this.pathPrefix);
	// bind to the persistence provider
	//this.persistence.bindState(this.pathPrefix,wikiDoc);
}

WebsocketAdaptor.prototype.name = "wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = false;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
    this.fsadaptor.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.setYBinding = function(state,awareness) {
	$tw.utils.getYBinding(this.pathPrefix,state,awareness);
}

WebsocketAdaptor.prototype.isReady = function() {
	return $tw.ydocs.has(this.pathPrefix) && $tw.ybindings.has(this.pathPrefix);
};

WebsocketAdaptor.prototype.getHost = function() {
	let text = this.wiki.getTiddlerText(CONFIG_HOST_TIDDLER,DEFAULT_HOST_TIDDLER),
		substitutions = [
			{name: "protocol", value: document.location.protocol},
			{name: "host", value: document.location.host}
		];
	for(let t=0; t<substitutions.length; t++) {
		let s = substitutions[t];
		text = $tw.utils.replaceString(text,new RegExp("\\$" + s.name + "\\$","mg"),s.value);
	}
	return text;
}

WebsocketAdaptor.prototype.getPathPrefix = function() {
	let hostTiddler = this.wiki.getTiddler(CONFIG_HOST_TIDDLER),
		host = hostTiddler? hostTiddler.fields.text: DEFAULT_HOST_TIDDLER,
		origin = hostTiddler? hostTiddler.fields.origin: DEFAULT_HOST_TIDDLER.replace(/\/$/, '');
	return host.replace(/\/$/,'').replace(origin,'');
}

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	return this.fsadaptor.getTiddlerInfo(tiddler);
};

/*
Return null (updates from the Yjs binding are automatically stored in the wiki)
*/
/* WebsocketAdaptor.prototype.getUpdatedTiddlers = function(syncer,callback) {
	callback(null,null);
} */

/*
Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
*/
WebsocketAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
    let self = this;
    $tw.ybindings.get(this.pathPrefix).save(tiddler,function(err){
		if(err) {
			self.logger.log(err);
		}
		self.fsadaptor.saveTiddler(tiddler,callback,options);
	})
};

/*
Load a tiddler and invoke the callback with (err,tiddlerFields)

We don't need to implement loading for the file system adaptor, because all the tiddler files 
will have been loaded during the boot process, and all updates to thw WikiDoc are pushed to the wiki.
But we still need to support syncer.enqueueLoadTiddler().
*/
WebsocketAdaptor.prototype.loadTiddler = function(title,callback) {
    $tw.ybindings.get(this.pathPrefix).load(title,function(err,fields){
		if(err) {
			callback(err);
		}
		callback(null,fields);
	});
};

/*
Delete a tiddler and invoke the callback with (err)
*/
WebsocketAdaptor.prototype.deleteTiddler = function(title,callback,options) {
    let self = this;
    $tw.ybindings.get(this.pathPrefix).delete(title,function(err){
		if(err) {
			self.logger.log(err);
		}
		self.fsadaptor.deleteTiddler(title,callback,options);
	});
};

if($tw.node) {
	exports.adaptorClass = WebsocketAdaptor;
}