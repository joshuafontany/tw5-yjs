# Configuration

Configuration for the plugin is set in the `settings.json` file in the
`settings` sub-folder of the folder where the primary wiki's `tiddlywiki.info` file is
located.

Everything is optional, if there are any missing pieces default values will be
used. If the json isn't formatted correctly than default values will be used.

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
}
```