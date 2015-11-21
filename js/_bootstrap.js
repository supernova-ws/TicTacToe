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

var round;

$(document).on('click', '.cell', function(){
  round.localPlayer.checkMove($(this));
});

$(document).on('change', '#mark_o', function(){
  round.changeSide($(this));
});

$(document).on('click', '#game_reset', function(){
  round.resetField();
});

$(document).ready(function() {
  round = new TicTacToe(TicTacToe.PLAYER_LOCAL);

  round.renderStorage();
  round.playerCurrent.waitForMove();
});
