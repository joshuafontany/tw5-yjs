/*\
title: $:/plugins/commons/yjs/browser-wsadaptor.js
type: application/javascript
module-type: syncadaptor

A sync adaptor for syncing changes from/to a browser using Yjs websockets

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const WebsocketSession = require('./wssession.js').WebsocketSession,
	Y = require('./yjs.cjs'),
	CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host",
	DEFAULT_HOST_TIDDLER = "$protocol$//$host$/";

function WebsocketAdaptor(options) {
	this.wiki = options.wiki;
	this.pathPrefix = this.getPathPrefix();
	this.host = this.getHost();
	this.key = this.getKey();
	this.logger = new $tw.utils.Logger("wsadaptor");
	// disable gc when using snapshots!
	this.gcEnabled = this.wiki.getTiddlerText("$:/config/yjs/gcEnabled","yes") == "yes";
	this.session = null;

	this.hasStatus = false;
	this.isLoggedIn = false;
	this.isReadOnly = false;
	this.isAnonymous = true;

	/**
	 * @type {{bindState: function(string,WikiDoc):void, writeState:function(string,WikiDoc):Promise<any>, provider: any}|null}
	 */
	$tw.utils.log('Persisting Y documents to y-indexeddb')
	this.persistence = {
		provider: require('./y-indexeddb.cjs').IndexeddbPersistence,
		idbs: new Map(),
		bindState: (docName,ydoc) => {
			let indexeddbProvider = new this.persistence.provider(docName,ydoc);
			indexeddbProvider.on('destroy',() => {
				this.persistence.idbs.delete(docName);
			});
			this.persistence.idbs.set(docName,indexeddbProvider);
		},
		writeState: (docName,ydoc) => {}
	}

	// Setup the Y wikiDoc
	this.wikiDoc = $tw.utils.getYDoc(this.pathPrefix);
	// bind to the persistence provider
	//this.persistence.bindState(this.pathPrefix,this.wikiDoc);
}

// Syncadaptor properties

// REQUIRED
// The name of the syncadaptor
WebsocketAdaptor.prototype.name = "wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = false;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	/* 
		Return the vector clock of the tiddler?
	*/
	return {

	};
}

WebsocketAdaptor.prototype.isReady = function() {
	return !!this.wikiDoc && $tw.ybindings.has(this.pathPrefix);
}

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
	let text = this.wiki.getTiddlerText(CONFIG_HOST_TIDDLER,DEFAULT_HOST_TIDDLER);
	text = text.replace(/\/$/,'').replace(/\$protocol\$\/\/\$host\$/,'');
	return text;
}

WebsocketAdaptor.prototype.getKey = function() {
	let key = $tw.utils.uuid.NIL,
		tiddler = this.wiki.getTiddler(CONFIG_HOST_TIDDLER);
	if(tiddler) {
		key = $tw.utils.uuid.validate(tiddler.fields.key) && tiddler.fields.key;
	}
	return key;
}

/*
Get the current status of the user
*/
WebsocketAdaptor.prototype.getStatus = function(callback) {
	// Get status
	let self = this,
		params = "?wiki=" + this.key + "&session=" + (window.sessionStorage.getItem("ws-session") || $tw.utils.uuid.NIL);
	this.logger.log("Getting status");
	$tw.utils.httpRequest({
		url: this.host + "status" + params,
		callback: function(err,data) {
			self.hasStatus = true;
			if(err) {
				return callback(err);
			}
			// Decode the status JSON
			let json = null;
			try {
				json = JSON.parse(data);
			} catch (e) {
			}
			if(json) {
				// Check if we're logged in
				self.isLoggedIn = !!json.username;
				self.isReadOnly = !!json["read_only"];
				self.isAnonymous = !!json.anonymous;

				if(self.session && json["session_id"] && self.session.id == json["session_id"]) {
					self.session.connect()
				} else if(json["session_id"]) {
					// Destroy the old session
					self.session && self.session.destroy();
					// Setup the session
					let options = {
						id: json["session_id"],
						key: self.key,
						pathPrefix: self.pathPrefix,
						username: json.username,
						isAnonymous: self.isAnonymous,
						isLoggedIn: self.isLoggedIn,
						isReadOnly: self.isReadOnly,
						expires: json["session_expires"],
						client: true,
						connect: true,
						ip: json.ip,
						url: new URL(self.host)
					}
					options.url.searchParams.append("wiki", self.key);
					options.url.searchParams.append("session", json["session_id"]);
					self.session = new WebsocketSession(options);
					// Set the session id
					window.sessionStorage.setItem("ws-session", self.session.id)
					// Bind after the doc has been synced
					self.session.once('synced',function(state,session) {
						$tw.utils.getYBinding(self.wikiDoc,$tw,session.awareness);
					});
					// Error handler
					self.session.once('error',function(event,session) {
						// Invalid session or connection rejected
						$tw.rootWidget.dispatchEvent({
							type: "tm-logout"
						});
					});

				}
			}
			// Invoke the callback if present
			if(callback) {
				callback(null,self.isLoggedIn,self.session.username,self.isReadOnly,self.isAnonymous);
			}
		}
	});
};

/*
Dispay a password prompt
*/
WebsocketAdaptor.prototype.displayLoginPrompt = function(syncer) {
	var self = syncer;
	var promptInfo = $tw.passwordPrompt.createPrompt({
		serviceName: $tw.language.getString("LoginToTiddlySpace"),
		callback: function(data) {
			self.login(data.username,data.password,function(err,isLoggedIn) {
				self.syncFromServer();
			});
			return true; // Get rid of the password prompt
		}
	});
};

/*
Attempt to login and invoke the callback(err)
*/
WebsocketAdaptor.prototype.login = function(username,password,callback) {
	let options = {
		url: this.host + "challenge/tw5-yjs-login",
		type: "POST",
		data: {
			user: username,
			password: password
		},
		callback: function(err) {
			callback(err);
		}
	};
	this.logger.log("Logging in:",options);
	$tw.utils.httpRequest(options);

};

/*
*/
WebsocketAdaptor.prototype.logout = function(callback) {
	let self = this,
		params = "?wiki=" + this.key + "&session=" + (window.sessionStorage.getItem("ws-session") || $tw.utils.uuid.NIL);
	if(this.session) {
		this.session.destroy();
		this.session = null;
	}
	let options = {
		url: this.host + "logout" + params,
		type: "POST",
		data: {},
		callback: function(err,data) {
			window.sessionStorage.setItem("ws-session", $tw.utils.uuid.NIL);
			callback(err);
		}
	};
	this.logger.log("Logging out:",options);
	$tw.utils.httpRequest(options);
};

/*
Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
*/
WebsocketAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
	let adaptorInfo = options.tiddlerInfo? options.tiddlerInfo.adaptorInfo: this.getTiddlerInfo(tiddler.fields.title);
	$tw.ybindings.get(this.pathPrefix).save(tiddler,function(err){
		if(err) {
			callback(err);
		}
		// report the Revision
		callback(null,adaptorInfo,null);
	});
}

/*
Load a tiddler and invoke the callback with (err,tiddlerFields)

We don't need to implement loading for the ws adaptor, because all updates to the WikiDoc are automatically pushed to the wiki.
*/
WebsocketAdaptor.prototype.loadTiddler = function(title,callback) {
	callback(null,null);
};

/*
Delete a tiddler and invoke the callback with (err)
*/
WebsocketAdaptor.prototype.deleteTiddler = function(title,callback,options) {
	$tw.ybindings.get(this.pathPrefix).delete(title,function(err){
		if(err) {
			callback(err);
		}
		// report the Revision
		callback(null,null);
	});
}

if($tw.browser) {
	exports.adaptorClass = WebsocketAdaptor
}
