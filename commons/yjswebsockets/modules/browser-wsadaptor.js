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
	DEFAULT_HOST_TIDDLER = "$protocol$//$host$/";

function WebsocketAdaptor(options) {
	this.wiki = options.wiki;
	this.host = this.getHost();
	this.pathPrefix = this.getPathPrefix();
	this.key = this.getKey();
	this.logger = new $tw.utils.Logger("wsadaptor");
	// disable gc when using snapshots!
	this.gcEnabled = this.wiki.getTiddlerText("$:/config/yjs/gcEnabled","yes") == "yes";
	this.session = null;

	this.hasStatus = false;
	this.isLoggedIn = false;
	this.isReadOnly = false;
	this.isAnonymous = true;

	// Setup the Y wikiDoc
	let wikiDoc = $tw.utils.getYDoc(this.pathPrefix);
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
	return {};
}

WebsocketAdaptor.prototype.isReady = function() {
	return $tw.ybindings.has(this.pathPrefix) && this.session && this.session.synced;
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
	let hostTiddler = this.wiki.getTiddler(CONFIG_HOST_TIDDLER),
		host = hostTiddler? hostTiddler.fields.text: DEFAULT_HOST_TIDDLER,
		origin = hostTiddler? hostTiddler.fields.origin: DEFAULT_HOST_TIDDLER.replace(/\/$/, '');
	return host.replace(origin,'').replace(/\/$/,'');
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
			let username = self.wiki.getTiddlerText($tw.syncer.titleUserName,null), json = null;
			try {
				json = JSON.parse(data);
			} catch (e) {
			}
			if(json.session) {
				// Check if we're logged in
				username = json.username;
				self.isLoggedIn = !!json.username;
				self.isReadOnly = !!json["read_only"];
				self.isAnonymous = !!json.anonymous;

				if(!self.session || self.session.id !== json.session) {
					// Destroy the old session
					self.session && self.session.destroy();
					// Set the session id
					window.sessionStorage.setItem("ws-session", json.session)
					// Setup the session
					let options = {
						id: json.session,
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
					options.url.searchParams.append("session", json.session);
					self.session = new WebsocketSession(options);
				} else if (!self.session.isReady()) {
					self.session.connect();
				}
				if(!self.session.synced) {
					// Bind after the doc has been synced
					self.session.once('status',function(msg,session) {
						self.logger.log(`[${session.username}] Session ${msg.status}`);
						if(msg.status == "synced") {
							self.setYBinding($tw,session.awareness);
						}
						if(callback) {
							// Invoke the callback if present
							return callback(null,self.isLoggedIn,username,self.isReadOnly,self.isAnonymous);
						}
					});
					// Warn of disconnections
					self.session.on('status', function(msg,session){
						if(msg.status == "aborted") {
							self.logger.alert($tw.language.getString("Error/NetworkErrorAlert"));
						} else if (msg.status == "synced") {
							self.logger.clearAlerts();
						}
					})
				} else if(callback) {
					// Invoke the callback if present
					return callback(null,self.isLoggedIn,username,self.isReadOnly,self.isAnonymous);
				}
			} else if(callback) {
				// Invoke the callback if present
				return callback(null,self.isLoggedIn,username,self.isReadOnly,self.isAnonymous);
			}
		}
	});
};

/*
Dispay a password prompt
*/
WebsocketAdaptor.prototype.displayLoginPrompt = function(syncer) {
	var promptInfo = $tw.passwordPrompt.createPrompt({
		serviceName: $tw.language.getString("LoginToTiddlySpace"),
		callback: function(data) {
			syncer.login(data.username,data.password,function(err,isLoggedIn) {
				syncer.syncFromServer();
			});
			return true; // Get rid of the password prompt
		}
	});
};

/*
Attempt to login and invoke the callback(err)
*/
/*
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

WebsocketAdaptor.prototype.logout = function(callback) {
	let self = this,
		params = "?wiki=" + this.key + "&session=" + (window.sessionStorage.getItem("ws-session") || $tw.utils.uuid.NIL);
	let options = {
		url: this.host + "logout" + params,
		type: "GET",
		data: {},
		callback: function(err,data) {
			if(self.session) {
				self.session.destroy();
				self.session = null;
			}
			window.sessionStorage.setItem("ws-session", $tw.utils.uuid.NIL);
			if(err) {
				self.logger.log(err);
			}
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
*/
WebsocketAdaptor.prototype.logout = function(callback) {
	if(this.session) {
		this.session.destroy();
		this.session = null;
	}
	window.sessionStorage.setItem("ws-session", $tw.utils.uuid.NIL);
	callback(null);
}

/*
Return null (updates from the Yjs binding are automatically stored in the wiki)
*/
WebsocketAdaptor.prototype.getUpdatedTiddlers = function(syncer,callback) {
	if(!this.isReady()) {
		syncer.getStatus(function(err,isLoggedIn) {
			callback(null,null);
		});
	} else {
		callback(null,null);
	}
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
		callback(null,null);
	});
}

if($tw.browser) {
	exports.adaptorClass = WebsocketAdaptor
}
