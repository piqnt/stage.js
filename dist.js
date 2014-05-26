/*
 * CutJS ${version}
 * Copyright (c) 2013-2014 Ali Shakiba, Piqnt LLC and other contributors
 * Available under the MIT license
 * @license
 */
(function() {

${contents}

  if (typeof define === "function" && define.amd) { // AMD
    define('Cut', [], function() {
      return Cut;
    });

  } else if (typeof module !== 'undefined') { // CommonJS
    module.exports = Cut;

  } else { // Other
    arguments[0].Cut = Cut;
  }

})(this);
