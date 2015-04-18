module.exports = require('../lib/');

require('../lib/canvas');
require('../lib/image');
require('../lib/anim');
require('../lib/str');
require('../lib/layout');
require('../lib/addon/tween');
module.exports.Mouse = require('../lib/addon/mouse');
module.exports.Math = require('../lib/util/math');
module.exports._extend = require('../lib/util/extend');
module.exports._create = require('../lib/util/create');

require('../lib/loader/cordova');