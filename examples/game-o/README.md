O! is a minimalistic game and a demo game for [CutJS](http://cutjs.org/). You can [play it online or download mobile apps](http://piqnt.com/o/).

After downloading the game source code, open `index.html` with your browser, the game should start, if not check errors with your browser debugging utility.

#### Graphics
The game graphics are packed in `main.png` texture atlas and defined in `textures.js`.

#### Architecture
The game consists of two main layers: model and view. Model consists of game logics and objects. View consists of CutJS components which compose game UI. View layer communicates with model by keeping a reference to it and extending its uiXXX methods.

#### Publishing
CutJS apps are compatible with modern browsers, they can also be published for mobile devices using specific loaders, for example there are PhoneGap/Corova loader (for iOS, etc.) and FastCanvas loader for Android.

#### License
Source codes, expect graphics and images, are available under the MIT license, but please do not use/reuse the game graphics and images.
In short you are encouraged to publish/distribute this game with or without modification to source code but with alternative graphics.
