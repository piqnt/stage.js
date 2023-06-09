
## V1 [Work in Progress] Upgrade and Breaking Changes

Since the initial development of Stage.js in 2013, web technology has changed a lot. The new version of Stage.js is updated to take advantage of new web technologies to simplify the API, and there are backward incompatible changes in the new version.

#### Importing and Starting
The first important change is using ES classes and exports. Now all classes are exported under `Stage` namespace, and `Stage` is not a function or a type anymore. In addition, preloading images and creating textures are separated from creating and mounting an app, and you need to use `await` to wait for the preloading to finish.

- Use `stage = Stage.mount()` to create and mount a new app, instead of `Stage(function(stage){ }))`.
- Use `await Stage.atlas({ })` to preload images and create textures before using them, instead of `Stage({ })`.
- Use `Stage.Node` as the base class for your custom nodes, instead of `Stage`.

#### Build
The second change is build-files. There are multiple build outputs for ES, CommonJS, and UMD.

FastContext support is dropped in this version, and there is one build file for all platforms. FastContext was used to take advantage of native GPU rendering in Android devices when browser Canvas rendering was not GPU optimized, however this is not needed anymore.

#### Relative Paths
The second important change is that relative image paths for textures are not resolved relative to the script anymore. You need to use absolute paths or resolve them yourself using a build tool.

#### Other API Changes
There are also smaller API changes:
- 'Stage.Image` and `Stage.image()` are renamed to `Stage.Sprite` and `Stage.sprite()` (to avoid overlapping with native Image class).
- `Stage.Math` is renamed to `Stage.math` and extends native `Math` (to avoid overlapping with native Math class).

For a complete list of changes, see [CHANGELOG.md](CHANGELOG.md).
