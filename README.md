# CDN Provider
NodeJS library to easly get a CDN (or file only cloud).

It will create a http server to privide the directories and files in the directory that you specified.

## How to install
```
npm i cdnprovider 
```

## How to use
```js
const provider = require('cdnprovider');

provider.provide('shared', 900);
```

## Methods
`provide` :
```js
provide(directorypath, port);
```