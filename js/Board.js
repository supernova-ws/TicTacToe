// TODO Как документировать аргументы в классе?
/**
 * Работа с доской
 *
 * @constructor
 * @params params
 */
//var Board = function (params) {
function Board(params) {
  this.snClass = this.constructor.name;
  !(params instanceof Object) ? params = {} : false;

  if(params.revive && typeof(params.revive) == "object" && params.revive.snClass == this.snClass) {
    this.snRevive(params.revive);
    return;
  }

  // this.snClass = 'Board';

  this.fieldWidth = parseInt(params.width) ? parseInt(params.width) : 3;
  this.fieldHeight = parseInt(params.height) ? parseInt(params.height) : 3;
  this.winStreak = parseInt(params.winStreak) ? parseInt(params.winStreak) : 3;

  this.fields = this.fieldWidth * this.fieldHeight;

  this.gameField = [];
  if(this.fieldWidth && this.fieldHeight) {
    for(var i = 0; i < this.fieldHeight; i++) {
      this.gameField[i] = [];
      for(var j = 0; j < this.fieldWidth; j++) {
        this.gameField[i][j] = TicTacToe.MARK_NONE;
      }
    }
  }
  //this.gameFieldEmpty = $.extend(true, [], this.gameField);
  //this.fieldsEmpty = this.fields = this.fieldWidth * this.fieldHeight;
};

Board.prototype.makeMove = function (move){
  if((!move) || !(move instanceof Object)) {
    return 'error';
  }

  {
    this.gameField[move.y][move.x] == TicTacToe.MARK_NONE ? this.fields-- : false;
    this.gameField[move.y][move.x] = move.mark;

    $('[x=' + move.x + '][y=' + move.y + ']').addClass(move.mark == TicTacToe.MARK_X ? 'mark_x' : 'mark_o').attr('mark', move.mark);

    var win = [0,0,0,0];
    for(var i = 0; i < 3; i++) {
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
      var winSelector = [];
      var winMethod = win.indexOf(max);
      switch(winMethod) {
        case TicTacToe.WIN_VERTICAL:
          winSelector.push('[x=' + move.x + ']');
          break;
        case TicTacToe.WIN_HORIZONTAL:
          winSelector.push('[y=' + move.y + ']');
          break;
        case TicTacToe.WIN_DIAGONAL_MAIN:
          winSelector.push('.diagonal_main');
          break;
        case TicTacToe.WIN_DIAGONAL_SECONDARY:
          winSelector.push('.diagonal_secondary');
          break;
      }
      $(winSelector.join('&nbsp;')).addClass('mark_win');

      return 'currentPlayerWin';
    }

    if(this.fields <= 0) {
      return 'draw';
    } else {
      return 'nextMove';
    }
  }
};

Board.prototype.resetField = function() {
  $('.cell').removeClass('mark_x mark_o mark_win');

  //this.gameField = $.extend(true, [], this.gameFieldEmpty);
  //this.fields = this.fieldsEmpty;
  this.fields = this.fieldWidth * this.fieldHeight;
  this.gameField = this.gameField.zeroRecursive();
};

Board.prototype.checkCell = function(y, x) {
  return this.gameField[y] && typeof(this.gameField[y][x]) != 'undefined' ? this.gameField[y][x] : TicTacToe.MARK_OUTSIDE;
};

Board.prototype.renderBoard = function() {
  var htmlCell;
  var htmlBoard = $('#game_field').html('');
  //htmlBoard.html('');
  //var atemp = $('<div class="cell">&nbsp;</div>');
  //console.log(atemp.width());


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

  //console.log(htmlCell.width() * this.fieldWidth);

  htmlBoard.width(htmlCell.outerWidth(true) * this.fieldWidth);
  htmlBoard.height(htmlCell.outerHeight(true) * this.fieldHeight);
};

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

Board.prototype.snRevive = function (jsonObject) {
  jsonObject instanceof Object ? $.extend(this, jsonObject) : false;
};
