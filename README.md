# Voice Search

A chrome extension for searching the web with voice.

![Searching Google with voice](src/assets/images/large-promo-tile.jpg?raw=true "Searching Google with voice")


## Download

From chrome webstore - [https://chrome.google.com/webstore/detail/audate-voice-search/agmgoemhckhccgibmoigonndjhjllcoh](https://chrome.google.com/webstore/detail/audate-voice-search/agmgoemhckhccgibmoigonndjhjllcoh)


## Contribute

1. Clone the repository

``` git clone https://github.com/justiceo/audate```

2. Install dependencies

```
npm install [--legacy-peer-deps]
```

3. Make changes, then create a new extension using

```
npm run package
```

This generates the directory `dist/audate`, which you can load as an unpacked extension. You can also watch this guide for loading unpacked extensions https://www.youtube.com/watch?v=oswjtLwCUqg.

4. To create a new release:

Update version in 

1. package.json
2. src/assets/manifest.json
3. src/main.ts

Then execute

```
npm run package-prod
```

