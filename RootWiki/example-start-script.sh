#!/usr/bin/env bash

# You need to use the full path here, ~/TiddlyWiki/Plugins doesn't work
export TIDDLYWIKI_PLUGIN_PATH="/c/tw/plugins"
export TIDDLYWIKI_THEME_PATH="/c/tw/themes"
export TIDDLYWIKI_EDITION_PATH="/c/tw/editions"

# The two 'node ./tiddlywiki.js' arguments are the path to the folder that contains the
# tiddlywiki.info file for the RootWiki and the server command for the Yjs plugin.
node /c/tw/TiddlyWiki5/tiddlywiki.js "/c/tw/editions/joshuafontany.github.io" --ws-server