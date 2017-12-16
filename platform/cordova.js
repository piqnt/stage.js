module.exports = require('../lib/');

module.exports.internal = {};

require('../lib/canvas');
module.exports.internal.Image = require('../lib/image');
require('../lib/anim');
require('../lib/str');
require('../lib/layout');
require('../lib/addon/tween');
module.exports.Mouse = require('../lib/addon/mouse');
module.exports.Math = require('../lib/util/math');
module.exports._extend = require('../lib/util/extend');
module.exports._create = require('../lib/util/create');

require('../lib/loader/cordova');