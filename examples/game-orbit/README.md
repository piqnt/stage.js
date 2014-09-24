# [Orbit](http://play.cutjs.org/examples/game-orbit/)

Orbit is a cross-platform demo game for [CutJS](http://cutjs.org/)—the best HTML5 engine for cross-platform game development!  To package this game for mobile devices [Cordova 3](http://cordova.apache.org/) is used.

[Play it here](http://play.cutjs.org/examples/game-orbit/)

Basically the game consists of following files:
- `www/index.html` the page viewing the game
- `www/app.js` game code including logic and ui
- `www/textures.js` definition of game graphic textures
- `www/js/cut-*.js` CutJS files
- `www/media/*` graphic image files

To prepare the project for Cordova few more files are also needed:
- Copy `cut-loader.web.js` to `www/js/cut-loader.js`
- Copy `cut-loader.fc.js` to `merges/android/js/cut-loader.js`
- Copy `cut-loader.cordova.js` to `merges/ios/js/cut-loader.js`

For other platforms do similar to iOS.

Now all you need is to build your project.  But first make sure you have [installed NPM](https://www.google.com/search?q=install+node.js+npm) and then install Cordova 3 CLI:
```
npm install -g cordova
```

You don't need to create a new Cordova project, but if you like just copy above files after creating it.

#### iOS

First, add iOS platform to your Cordova project:
```
cordova platform add ios
```

Then, use Cordova `prepare` command to prepare your iOS project using `www` and `merges` folders and Cordova `config.xml` file:
```
cordova prepare ios
```

You iOS project is ready and available in `platforms/ios`, you can run or build it using Cordova or your own development kit.

For other platforms you can follow similar steps.

#### Android

Android is also similar but requires an additional step. First, add Android platform to your Cordova project:
```
cordova platform add android
```

HTML5 Canvas usually doesn't perform well on Android, but there is a Corova plugin called [FastCanvas](https://github.com/phonegap/phonegap-plugin-fast-canvas) which we can use to shim it with a native GLSurface.
Install [this edition](https://github.com/piqnt/phonegap-plugin-fast-canvas) of FastCanvas which is updated and optimized for CutJS:
```
cordova plugin add https://github.com/piqnt/phonegap-plugin-fast-canvas
```
Note that FastCanvas takes up entire screen and covers the HTML page.

Then, prepare your Android project:
```
cordova prepare android
```

Now your Android project is ready, again, you can run or build it using Cordova or your own development kit.

### Arts

Graphic SVG files are included in `arts` folder.  You can export them manually or use [svgexport](https://github.com/shakiba/svgexport).

First, install svgexport:
```
npm install svgexport -g
```

Once svgexport is installed, you can export arts:
```
svgexport art/game.json
svgexport art/ios.json
svgexport art/android.json
```
