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
  this.host = this.getHost();
  this.pathPrefix = this.getPathPrefix();
  this.key = this.getKey();
  this.hasStatus = false;
  this.session = null;
  this.logger = new $tw.utils.Logger("browser-wsadaptor");
  this.isLoggedIn = false;
  this.isReadOnly = false;
  this.isAnonymous = true;

  // Initialise Yjs in the browser
  /**
   * @type {{bindState: function(string,WikiDoc):void, writeState:function(string,WikiDoc):Promise<any>, provider: any}|null}
   */
  this.persistence = null;
  this.gcEnabled = true;
  this.doc = $tw.utils.getYDoc(this.pathPrefix);
}

// Syncadaptor properties

// REQUIRED
// The name of the syncadaptor
WebsocketAdaptor.prototype.name = "browser-wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = false;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.isReady = function() {
  return this.hasStatus && this.session && this.session.isReady();
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
  text.replace(/\/$/, '');
  text.replace(/\$protocol\$\/\/\$host\$/, '');
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

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
  /* 
    Return the vector clock of the tiddler?
  */
  return {

  };
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

        if(this.session && json["session_id"] && this.session.id == json["session_id"]) {
          this.session.connect()
        } else if(json["session_id"]) {
          // Destroy the old session
          this.session && this.session.destroy();
          // Setup the session
          let options = {
            id: json["session_id"],
            doc: self.doc,
            pathPrefix: this.pathPrefix,
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
          options.url.searchParams.append("wiki", this.key);
          options.url.searchParams.append("session", json["session_id"]);
          self.session = new WebsocketSession(options);
          // Set the session id
          window.sessionStorage.setItem("ws-session", self.session.id)
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
  this.session.destroy()
  this.session = null;
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
Get an array of skinny tiddler fields from the yjs doc?
*/
WebsocketAdaptor.prototype.getUpdatedTiddlers = function(syncer,callback) {
    callback(null,null);
};

// REQUIRED
// This does whatever is necessary to actually store a tiddler
WebsocketAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
  let title = tiddler.fields.title;
  let adaptorInfo = options.tiddlerInfo? options.tiddlerInfo.adaptorInfo: this.getTiddlerInfo(title);
  // Save to the YDoc here
  let wikiTitles = this.doc.getArray("wikiTitles");
  let wikiTiddlers = this.doc.getArray("wikiTiddlers");
  let wikiTombstones = this.doc.getArray("wikiTombstones");
  let tiddlerIndex = wikiTitles.toArray().indexOf(title);
  let tsIndex = wikiTombstones.toArray().indexOf(title);

  let changedFields = {},
  tiddlerFields = tiddler.getFieldStrings();
  
  $tw.utils.each(tiddlerFields,function(field,name) {
    if(tiddlerIndex == -1 || !wikiTiddlers.get(tiddlerIndex).has(name) || 
      $tw.utils.hashString(field) !== $tw.utils.hashString(wikiTiddlers.get(tiddlerIndex).get(name))) {
      changedFields[name] = field;
    }
  });
  this.doc.transact(() => {
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
  },this.wiki)
  // report the Revision
  callback(null,adaptorInfo,null);
}

// REQUIRED
// This does whatever is necessary to load a tiddler.
// Used for lazy loading
WebsocketAdaptor.prototype.loadTiddler = function(title,callback) {
  try {
    let wikiTitles = this.doc.getArray("wikiTitles");
    let wikiTiddlers = this.doc.getArray("wikiTiddlers"); 
    let wikiTombstones = this.doc.getArray("wikiTombstones");
    let tiddlerIndex = wikiTitles.toArray().indexOf(title);
    let tsIndex = wikiTombstones.toArray().indexOf(title);
    if(tsIndex == -1 && tiddlerIndex !== -1) {
      // Invoke the callback
      callback(null,wikiTiddlers.get(tiddlerIndex).toJSON());
    } else {
      callback(null,null);
    }
  } catch (error) {
    $tw.utils.warning(error);
    callback($tw.language.getString("Error/XMLHttpRequest") + ": 0");
  }
}

// REQUIRED
// This does whatever is necessary to delete a tiddler
WebsocketAdaptor.prototype.deleteTiddler = function(title,callback,options) {
  let wikiTitles = this.doc.getArray("wikiTitles");
  let wikiTiddlers = this.doc.getArray("wikiTiddlers");
  let wikiTombstones = this.doc.getArray("wikiTombstones");
  let tiddlerIndex = wikiTitles.toArray().indexOf(title);
  let tsIndex = wikiTombstones.toArray().indexOf(title);
  this.doc.transact(() => {
    if (tiddlerIndex !== -1 ) {
      wikiTitles.delete(tiddlerIndex,1);
      wikiTiddlers.delete(tiddlerIndex,1);
    }
    if (tsIndex == -1) {
      wikiTombstones.push([title]);
    }
  },this.wiki);
  callback(null,null);
}

// Only set up the websockets if we are in the browser and have websockets.
if($tw.browser && window.location.hostname) {
  //setupSkinnyTiddlerLoading()
  exports.adaptorClass = WebsocketAdaptor
}
