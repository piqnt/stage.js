# O!
O! is a minimalistic game and a demo game for [Cut.js](http://cutjs.org/) library. You can [play it online or download mobile apps](http://piqnt.com/o/).

## Developer

### Prerequisites
O! is a JavaScript game so familiarity with JavaScript is required. It is also recommended that you have git and bower installed.

### Getting started

Use git or the download button (on the right) to download the game source code. Dependencies are only [Cut.js](https://github.com/piqnt/cut.js) and [Extra.js](https://github.com/piqnt/extra.js) which are included.

Open `src/index.html` with your browser, the game should start, if not check errors with your browser debugging utility.

### Graphics/Textures
The game graphics are packed in `media/base.png` texture (sprite-sheet) and image cutouts (sprites) are defined in `textures.js`.

### Architecture
The game consists of two main layers: model and view. Model consists of game logics and objects. View consists of Cut.js components which compose and renders graphics. View layer communicate with model by refrenceing it and extending model's uiXXX methods.

### Publish
Cut.js apps are compatible with modern browsers, they can also be published for mobile devices using specific loaders, for example there are PhoneGap/Corova loader (for iOS, etc.) and FastCanvas loader for Android.

### License
Source codes, expect graphics and images, are available under the MIT license, but please do not use/reuse the game graphics and images.
In short you are encouraged to publish/distribute this game with or without modification to source code but with alternative graphics.