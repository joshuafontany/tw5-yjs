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
	CONFIG_API_TIDDLER = "$:/config/tiddlyweb/api",
	CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host",
	CONFIG_ORIGIN_TIDDLER = "$:/config/tiddlyweb/origin",
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
	let wikiDoc = $tw.utils.getYDoc(this.pathPrefix);
	// bind to the persistence provider
	//this.persistence.bindState(this.pathPrefix,wikiDoc);
}

// Syncadaptor properties

// REQUIRED
// The name of the syncadaptor
WebsocketAdaptor.prototype.name = "wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = false;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.setYBinding = function(state,awareness) {
	let binding = $tw.utils.getYBinding(this.pathPrefix,state,awareness);
	if(binding.awareness !== awareness) {
		binding.bindAwareness(awareness);
	}
}

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	/* 
		Return the vector clock of the tiddler?
	*/
	return {

	};
}

WebsocketAdaptor.prototype.isReady = function() {
	return $tw.ydocs.has(this.pathPrefix) && $tw.ybindings.has(this.pathPrefix);
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
	let text = this.wiki.getTiddlerText(CONFIG_HOST_TIDDLER,DEFAULT_HOST_TIDDLER),
		origin = this.wiki.getTiddlerText(CONFIG_ORIGIN_TIDDLER,DEFAULT_HOST_TIDDLER.replace(/\/$/, ''));
	text = text.replace(/\/$/,'').replace(origin,'');
	return text;
}

WebsocketAdaptor.prototype.getKey = function() {
	let key = this.wiki.getTiddlerText(CONFIG_API_TIDDLER,$tw.utils.uuid.NIL);
	return $tw.utils.uuid.validate(key) && key;
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
						authenticatedUsername: json.authenticatedUsername,
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
					// Bind and syncFromServer after the doc has been synced
					self.session.once('synced',function(state,session) {
						self.setYBinding($tw,session.awareness);
						// Invoke the callback if present
						if(callback) {
							return callback(null,self.isLoggedIn,self.session.username,self.isReadOnly,self.isAnonymous);
						}
					});
					self.session.once('disconnected',function(state,session) {
						// Invalid session or connection rejected
						$tw.rootWidget.dispatchEvent({
							type: "tm-logout"
						});
						// if(callback) {
						// 	return callback(null,self.isLoggedIn,self.session.username,self.isReadOnly,self.isAnonymous);
						// }
					});
					// Error handler
					self.session.once('error',function(event,session) {
						// Invalid session or connection rejected
						$tw.rootWidget.dispatchEvent({
							type: "tm-logout"
						});
					});
				}
			} else if(callback) {
				return callback(null,self.isLoggedIn,self.session.username,self.isReadOnly,self.isAnonymous);
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
		url: this.host + "challenge/tw5-login",
		type: "POST",
		data: {
			user: username,
			password: password,
			tiddlyweb_redirect: "/status" // workaround to marginalize automatic subsequent GET
		},
		callback: function(err) {
			callback(err);
		},
		headers: {
			"accept": "application/json",
			"X-Requested-With": "TiddlyWiki"
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
	let options = {
		url: this.host + "logout" + params,
		type: "POST",
		data: {},
		callback: function(err,data) {
			if(self.session) {
				self.session.destroy();
				self.session = null;
			}
			window.sessionStorage.setItem("ws-session", $tw.utils.uuid.NIL);
			self.logger.log(err);
			callback(null);
		},
		headers: {
			"accept": "application/json",
			"X-Requested-With": "TiddlyWiki"
		}
	};
	this.logger.log("Logging out:",options);
	$tw.utils.httpRequest(options);
};

/*
Return null (updates from the Yjs binding are automatically stored in the wiki)
*/
WebsocketAdaptor.prototype.getUpdatedTiddlers = function(syncer,callback) {
	callback(null,null);
	syncer.processTaskQueue();
}

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

We do need to implement loading for the ws adaptor, because readOnly users shouldn't be able to change the wikistate.
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
