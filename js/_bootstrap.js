/**
 * Bootstrap
 */

/**
 * Locale holder
 *
 * @type {Object} l
 */
var l = {};

Math.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

String.prototype.format = function () {
  var _args = arguments;
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m == "{{") { return "{"; }
    if (m == "}}") { return "}"; }
    return _args[n];
  });
};

Array.prototype.zeroRecursive = function () {
  return this.map(function(item){
    return item instanceof Array ? item.zeroRecursive() : 0;
  });
};

var round;

// localStorage.TicTacToe = '';
// console.log();

$(document).on('change', '#mark_o, input[name=computerSkill]', function(){
  round.changeSide();
});
$(document).on('click', '#game_reset', function(){
  round.changeSide();
});

$(document).on('click', '.cell', function() {
  round.playerLocal.checkMove($(this));
});


$(document).ready(function() {
  round = new TicTacToe();
});
