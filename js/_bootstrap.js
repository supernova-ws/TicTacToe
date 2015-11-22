/**
 * Bootstrap
 */

/**
 * Locale holder
 *
 * @type {Object} l
 */
var l = {};

/**
 * Возвращает случайное целое из диапазона [min, max]
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
Math.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Простенькая процедура форматирования
 * Заменяет в строке {0}, {1} итд соответственно первым, вторым итд аргументом функции
 * Фигурные скобки экранируются дублированием
 *
 * @returns {string}
 */
String.prototype.format = function () {
  var _args = arguments;
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m == "{{") { return "{"; }
    if (m == "}}") { return "}"; }
    return _args[n];
  });
};

/**
 * Рекурсивное обнуление массива
 *
 * @returns {Array}
 */
Array.prototype.zeroRecursive = function () {
  return this.map(function(item){
    return item instanceof Array ? item.zeroRecursive() : 0;
  });
};

/**
 * POP-ает случайный элемент
 *
 * @returns {*}
 */
Array.prototype.popRandom = function () {
  return this.length ? this.splice(Math.randomInt(0, this.length - 1), 1)[0] : undefined;
};

var round;

$(document)
  .on('change', '#mark_o, input[name=computerSkill]', function() {
    round.restartGame();
  })
  .on('click', '#game_reset', function() {
    round.restartGame();
  })
  .on('click', '.cell', function() {
    round.playerLocal.checkMove($(this));
  });


$(document).ready(function() {
  round = new TicTacToe();
});
