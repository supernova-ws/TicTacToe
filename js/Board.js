// TODO Как документировать аргументы в классе?
/**
 * Работа с доской
 *
 * @prop {String} snClass
 * @prop {number} fieldWidth
 * @prop {number} fieldHeight
 * @prop {number} winStreak
 * @prop {number} cellsTotal
 * @prop {number} cellsFree
 * @prop {Array[]} gameField
 * @constructor
 * @params params
 */
function Board(params) {
  this.snClass = this.constructor.name;
  !(params instanceof Object) ? params = {} : false;

  if(params._revive && typeof(params._revive) == "object" && params._revive.snClass == this.snClass) {
    //console.log('BOARD REVIVE');
    this.snRevive(params._revive);
    return;
  }

  this.fieldWidth = parseInt(params.width) ? parseInt(params.width) : 3;
  this.fieldHeight = parseInt(params.height) ? parseInt(params.height) : 3;
  this.winStreak = parseInt(params.winStreak) ? parseInt(params.winStreak) : 3;

  this.cellsTotal = this.fieldWidth * this.fieldHeight;
  this.cellsFree = this.cellsTotal;

  this.gameField = [];
  if(this.fieldWidth && this.fieldHeight) {
    for(var i = 0; i < this.fieldHeight; i++) {
      this.gameField[i] = [];
      for(var j = 0; j < this.fieldWidth; j++) {
        this.gameField[i][j] = TicTacToe.MARK_NONE;
      }
    }
  }
}

/**
 * Ставит отметку на доску, проверяет условия выигрыша и возвращает результат
 *
 * @param {Object} move
 * @param {number} move.y
 * @param {number} move.x
 * @param {number} move.mark
 * @returns {String}
 */
Board.prototype.placeMark = function (move){
  if((!move) || !(move instanceof Object)) {
    return 'error';
  }

  this.gameField[move.y][move.x] == TicTacToe.MARK_NONE ? this.cellsFree-- : false;
  this.gameField[move.y][move.x] = move.mark;

  $('[x=' + move.x + '][y=' + move.y + ']').addClass(move.mark == TicTacToe.MARK_X ? 'mark_x' : 'mark_o').attr('mark', move.mark);

  var win = [0,0,0,0];
  for(var i = 0; i < this.winStreak; i++) {
    // Проверяем главную диагональ \
    move.x == move.y && this.gameField[i][i] == move.mark ? win[TicTacToe.WIN_DIAGONAL_MAIN]++ : false;
    (move.x + move.y) == 2 && this.gameField[i][2 - i] == move.mark ? win[TicTacToe.WIN_DIAGONAL_SECONDARY]++ : false;

    // Проверяем вертикаль
    this.gameField[i][move.x] == move.mark ? win[TicTacToe.WIN_VERTICAL]++ : false;
    // Проверяем горизонталь
    this.gameField[move.y][i] == move.mark ? win[TicTacToe.WIN_HORIZONTAL]++ : false;
  }

  var max = Math.max.apply(null, win);
  if(max == 3) {
    //var winSelectorList = ['[x=' + move.x + ']', '[y=' + move.y + ']', '.diagonal_main', '.diagonal_secondary'];
    var winSelectorList = ['[x={1}]', '[y={0}]', '.diagonal_main', '.diagonal_secondary'];
    var winSelector = [];
    var winMethod = win.indexOf(max);

    winSelector.push(winSelectorList[winMethod].format(move.y, move.x, move.mark));
    $(winSelector.join('&nbsp;')).addClass('mark_win');

    return 'currentPlayerWin';
  }

  if(this.cellsFree <= 0) {
    return 'draw';
  } else {
    return 'nextMove';
  }
};

/**
 * Очищает доску
 */
Board.prototype.clearBoard = function() {
  $('.cell').removeClass('mark_x mark_o mark_win');

  this.cellsFree = this.fieldWidth * this.fieldHeight;
  this.gameField = this.gameField.zeroRecursive();
};

/**
 * Возвращает отметку в ячейке по указанным координатам или TicTacToe.MARK_OUTSIDE - если координаты за пределами доски
 *
 * @param {number} y
 * @param {number} x
 * @returns {number}
 */
Board.prototype.getCellMark = function(y, x) {
  return this.gameField[y] && typeof(this.gameField[y][x]) != 'undefined' ? this.gameField[y][x] : TicTacToe.MARK_OUTSIDE;
};

Board.prototype.renderBoard = function() {
  var htmlCell;
  var htmlBoard = $('#gameField').html('');

  var gameField = this.gameField;
  for(var y in gameField) {
    if(gameField.hasOwnProperty(y)) {
      for(var x in gameField[y]) {
        if(gameField[y].hasOwnProperty(x)) {
          x = parseInt(x);
          y = parseInt(y);

          htmlCell = $('<div class="cell">Y:{0} X:{1}</div>'.format(y, x)).attr('x', x).attr('y', y);
          x == y ? htmlCell.addClass('diagonal_main') : false;
          (x + y) == (this.fieldWidth - 1) ? htmlCell.addClass('diagonal_secondary') : false;
          htmlBoard.append(htmlCell);

          if(gameField[y][x] != TicTacToe.MARK_NONE) {
            $('[x=' + x + '][y=' + y + ']').addClass(gameField[y][x] == TicTacToe.MARK_X ? 'mark_x' : 'mark_o').attr('mark', gameField[y][x]);
          }
        }
      }
    }
  }

  htmlBoard.width(htmlCell.outerWidth(true) * this.fieldWidth).css('min-width', htmlBoard.width());
  htmlBoard.height(htmlCell.outerHeight(true) * this.fieldHeight);
};

/**
 * Возвращает массив пустых ячеек
 *
 * @returns {Object[]}
 */
Board.prototype.getEmptyCells = function() {
  var emptyCells = [];
  var gameField = this.gameField;

  for(var y in gameField) {
    if(gameField.hasOwnProperty(y)) {
      for(var x in gameField[y]) {
        if(gameField[y].hasOwnProperty(x) && gameField[y][x] == TicTacToe.MARK_NONE) {
          emptyCells.push({x: x, y: y});
        }
      }
    }
  }

  return emptyCells;
};

/**
 * Производит ревайв объекта - восстанавливает его свойства после отключения страницы
 * @param jsonObject
 */
Board.prototype.snRevive = function (jsonObject) {
  jsonObject instanceof Object ? $.extend(this, jsonObject) : false;
  //this.cellsFree = 8;
  //this.cellsTotal = 9;
  //this.gameField = [
  //  [1, 0, 2],
  //  [0, 2, 0],
  //  [1, 0, 1],
  //];
};
