# Configuration

Configuration for the plugin is set in the `settings.json` file in the
`settings` sub-folder of the folder where the `tiddlywiki.info` file is
located.

Everything is optional, if there are any missing pieces default values will be
used. If the json isn't formatted correctly than default values will be used.

Some options are only available when using the secure server version. They are
marked in the explanations below.

## Example settings.json file

```
{
  "servername": "Yjs.wiki",
  "port": 8080,
  "host": "127.0.0.1",
  "path-prefix": "",
  "admin": "(authenticated)",
  "readers": "(anon)",
  "writers": "(authenticated)",
  "username": "",
  "password": "",
  "credentials": "",
  "tls-key": "",
  "tls-cert": "",
  "tls-passphrase": "",
  "debug-level": "none",
  "root-render-type": "text/plain",
  "root-serve-type": "text/html",
  "root-tiddler": "$:/core/save/all",
  "system-tiddler-render-template": "$:/core/templates/wikified-tiddler",
  "system-tiddler-render-type": "text/plain",
  "tiddler-render-template": "$:/core/templates/server/static.tiddler.html",
  "tiddler-render-type": "text/html",

  "basePath": "cwd",
  "wikisPath": "./editions",

  "disableFileWatchers": "no",
  "suppressBrowser": false,

  "required-plugins": [
    "$:/plugins/joshuafontany/yjs",
    "$:/plugins/tiddlywiki/filesystem"
  ]
}
```

''Note:'' All paths can be either absolute or relative. Relative paths are
relative to the path listed in `basePath`, if none is listed they are
relative to the folder with tiddlywiki.js in it.

''Note for windows:'' All the example paths here are how they would appear on
linux or osx. On windows the paths would look like
`C:\Users\inmysocks\TiddlyWiki\Wikis`. To make the examples what you would use
in windows replace `/home` with `C:\Users` and change the `/` into `\`.

## What each part is

- `wikisPath` the name of the default wikis folder to use. If relative it is
  relative to `basePath`. Defaults to `./editions`. With the default base path 
  of `cwd` and a command launched from the TiddlyWiki5 install directory, this
  points to the `./editions` directory within the TiddlyWiki5 repository.
- `basePath` relative paths for everything other than serving files are
  relative to this path. If you want a portable setup this must be set to
  `cwd`, if you set it as `./` the paths are relative to the users home
  directory. It defaults to the current working directory. If this is set to a
  relative path it is relative to the user home directory.

- `disableFileWatchers` if this is set to `yes` than the file system monitor
  component is disabled. This may help with some setups that use network drives
  to store tiddlers.
- `suppressBrowser` is only used if you are using the single executable
  version. If it is set to `true` than the browser isn't opened automatically
  when the server is started.
- `scripts` a list of scripts that you can call from inside the wiki using the
  `runScript` websocket message.
- `wikis` a list of child wikis to serve. The path to the wikis is determined
  by the name given. In the example above the wiki located at
  `/home/inmysocks/TiddlyWiki/Wikis/OneWiki` would be served on
  `localhost:8080/OneWiki` and the wiki located at
  `/home/inmysocks/TiddlyWiki/Wikis/TestWiki` would be served on
  `localhost:8080/OokTech/TestWiki`. You may have as many levels and wikis as
  you want.