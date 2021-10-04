/*\
title: $:/plugins/commons/yjs/utils/yutils.js
type: application/javascript
module-type: utils

Various yjs utility functions.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Setup external libraries
const map = require('../lib0/dist/map.cjs');
const WikiDoc = require('../wikidoc.js').WikiDoc;
const Y = require('../yjs.cjs');

// Y Docs
$tw.ydocs = $tw.ydocs || new Map();

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {Y.Doc}
 */
exports.getYDoc = function (docname, gc) {
	docname = docname || '/'
	return map.setIfUndefined($tw.ydocs, docname, () => {
		const doc = new WikiDoc(docname);
		// disable gc when using snapshots!
		doc.gc = gc;
		doc.name = docname;
		if (!!$tw.ypersistence) {
			$tw.ypersistence.bindState(docname, doc)
		}
		$tw.ydocs.set(docname, doc);
		return doc;
	})
}

/**
 * Initializes a wikiDoc and Yjs states
 */
exports.initWikiDoc = function (state) {
	if (!state.wiki) {
		return false;
	}
	// Setup the config api key.
	let tiddler = state.wiki.getTiddler('$:/config/tiddlyweb/host'),
		newFields = {
			title: '$:/config/tiddlyweb/host',
			key: tiddler && $tw.utils.uuid.validate(tiddler.fields.key) ? tiddler.fields.key : $tw.utils.uuid.v4()
		};
	state.wiki.addTiddler(new $tw.Tiddler(tiddler, newFields));

	// Setup the Y wikiDoc
	// disable gc when using snapshots!
	state.ygcEnabled = state.wiki.getTiddlerText("$:/config/yjs/gcEnabled", "yes") == "yes";
	state.wikiDoc = $tw.utils.getYDoc(state.boot.pathPrefix);
	state.wikiTitles = state.wikiDoc.getArray("wikiTitles");
	state.wikiTiddlers = state.wikiDoc.getArray("wikiTiddlers");
	state.wikiTombstones = state.wikiDoc.getArray("wikiTombstones");

	// Setup the observers
	state.wikiTiddlers.observeDeep((events, transaction) => {
		if (transaction.origin !== state.wiki) {
			debugger;
			events.forEach(event => {
				if (event.target == event.currentTarget) {
					event.changes.deleted && event.changes.deleted.forEach(item => {
						$tw.utils.log(`['${transaction.origin.id}'] Deleting tiddler: ${item.content.type.get('title')}`);
						// A tiddler was deleted
						state.wiki.deleteTiddler(item.content.type.get('title'));
					});
					event.changes.added && event.changes.added.forEach(item => {
						// A tiddler was updated
						let title = item.content.type.get("title");
						let fields = item.content.type.toJSON();
						$tw.utils.log(`['${transaction.origin.id}'] Updating tiddler: ${title}`);
						$tw.utils.log(JSON.stringify(fields, null, 2));
						// Save the tiddler, preferring any incoming fields over any missing created or modified fields
						state.wiki.addTiddler(new $tw.Tiddler(state.wiki.getCreationFields(), state.wiki.getModificationFields(), fields, {
							title: title
						}));
					});
				} else {
					// A tiddler was updated
					let title = event.target.get("title");
					let fields = event.target.toJSON();
					$tw.utils.log(`['${transaction.origin.id}'] Updating tiddler: ${title}`);
					$tw.utils.log(JSON.stringify(fields, null, 2));
					// Save the tiddler, preferring any incoming fields over any missing created or modified fields
					state.wiki.addTiddler(new $tw.Tiddler(state.wiki.getCreationFields(), state.wiki.getModificationFields(), fields, {
						title: title
					}));
				}
			});
		}
	});

	// Setup the Wiki change event listener
	state.wiki.addEventListener("change", (changes) => {
		state.wikiDoc.transact(() => {
			$tw.utils.each(changes, function (change, title) {
				let tiddlerIndex = state.wikiTitles.toArray().indexOf(title),
					tsIndex = state.wikiTombstones.toArray().indexOf(title);
				if (change.modified && state.wiki.tiddlerExists(title)) {
					let changedFields = {},
						tiddlerFields = state.wiki.getTiddler(title).getFieldStrings();
					$tw.utils.each(tiddlerFields, function (field, name) {
						if (tiddlerIndex == -1 || !$tw.wikiTiddlers.get(tiddlerIndex).has(name) ||
							$tw.utils.hashString(field) !== $tw.utils.hashString($tw.wikiTiddlers.get(tiddlerIndex).get(name))) {
							changedFields[name] = field;
						}
					});
					if (tiddlerIndex == -1) {
						state.wikiTiddlers.push([new Y.Map()]);
						state.wikiTitles.push([title]);
						tiddlerIndex = state.wikiTitles.toArray().indexOf(title);
					}
					if (tsIndex !== -1) {
						state.wikiTombstones.delete(tsIndex, 1)
					}
					let tiddlerMap = state.wikiTiddlers.get(tiddlerIndex);
					$tw.utils.each(tiddlerMap.toJSON(), (field, name) => {
						if (Object.keys(tiddlerFields).indexOf(name) == -1) {
							tiddlerMap.delete(name);
						}
					});
					$tw.utils.each(changedFields, (field, name) => {
						tiddlerMap.set(name, field);
					});
				} else if (change.deleted) {
					if (tiddlerIndex !== -1) {
						state.wikiTitles.delete(tiddlerIndex, 1);
						state.wikiTiddlers.delete(tiddlerIndex, 1);
					}
					if (tsIndex == -1) {
						state.wikiTombstones.push([title]);
					}
				}
			});
		}, state.wiki);
	});

	// Compare all tiddlers in the wiki to their YDoc maps on startup
	state.wikiDoc.transact(() => {
		// Delete those that are in wikiTitles, but not in the wiki
		let titles = state.wiki.getTiddlers({
				includeSystem: true
			}),
			maps = state.wikiTitles.toArray(),
			diff = maps.filter(x => titles.indexOf(x) === -1);
		diff.forEach((title) => {
			$tw.utils.log(`['${state.boot.pathPrefix || '/'}'] deleting Y.Map: ${title}`);
			let tiddlerIndex = state.wikiTitles.toArray().indexOf(title),
				tsIndex = state.wikiTombstones.toArray().indexOf(title);
			if (tiddlerIndex !== -1) {
				state.wikiTitles.delete(tiddlerIndex, 1);
				state.wikiTiddlers.delete(tiddlerIndex, 1);
			}
			if (tsIndex == -1) {
				state.wikiTombstones.push([title]);
			}
		});
		// Update the maps that changed after server restarts
		state.wiki.forEachTiddler({
			includeSystem: true
		}, function (title, tiddler) {
			let tiddlerIndex = state.wikiTitles.toArray().indexOf(title),
				tsIndex = state.wikiTombstones.toArray().indexOf(title);
			let changedFields = {},
				tiddlerFields = tiddler.getFieldStrings();
			$tw.utils.each(tiddlerFields, function (field, name) {
				if (tiddlerIndex == -1 || !$tw.wikiTiddlers.get(tiddlerIndex).has(name) ||
					$tw.utils.hashString(field) !== $tw.utils.hashString($tw.wikiTiddlers.get(tiddlerIndex).get(name))) {
					changedFields[name] = field;
				}
			});
			if (changedFields) {
				if (tiddlerIndex == -1) {
					state.wikiTiddlers.push([new Y.Map()]);
					state.wikiTitles.push([title]);
					tiddlerIndex = state.wikiTitles.toArray().indexOf(title);
				}
				if (tsIndex !== -1) {
					state.wikiTombstones.delete(tsIndex, 1)
				}
				$tw.utils.log(`['${state.boot.pathPrefix || '/'}'] updating Y.Map: ${title}`);
				let tiddlerMap = state.wikiTiddlers.get(tiddlerIndex);
				$tw.utils.each(tiddlerMap.toJSON(), (field, name) => {
					if (Object.keys(tiddlerFields).indexOf(name) == -1) {
						tiddlerMap.delete(name);
					}
				});
				$tw.utils.each(changedFields, (field, name) => {
					tiddlerMap.set(name, field);
				});
			}
		});
	}, state.wiki);
}