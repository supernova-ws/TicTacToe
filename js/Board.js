/**
 *
 * @param fieldHeight
 * @param fieldWidth
 * @param round
 * @constructor
 */
var Board = function (fieldHeight, fieldWidth, round) {
//function Board(fieldHeight, fieldWidth, round) {
  !fieldWidth ? fieldWidth = 3 : false;
  !fieldHeight ? fieldHeight = 3 : false;

  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;

  this.fieldsEmpty = this.fields = this.fieldWidth * this.fieldHeight;

  this.gameField = [];
  if(this.fieldWidth && this.fieldHeight) {
    for(var i = 0; i < this.fieldHeight; i++) {
      this.gameField[i] = [];
      for(var j = 0; j < this.fieldWidth; j++) {
        this.gameField[i][j] = TicTacToe.MARK_NONE;
      }
    }
  }
  this.gameFieldEmpty = $.extend(true, [], this.gameField);

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
      $(winSelector.join(' ')).addClass('mark_win');

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

  this.gameField = $.extend(true, [], this.gameFieldEmpty);
  this.fields = this.fieldsEmpty;
  // round.fields = round.fieldsEmpty;
};

Board.prototype.checkCell = function(y, x) {
  return this.gameField[y] && typeof(this.gameField[y][x]) != 'undefined' ? this.gameField[y][x] : TicTacToe.MARK_OUTSIDE;
};

Board.prototype.renderBoard = function() {
  var gameField = this.gameField;
  for(var y in gameField) {
    if(gameField.hasOwnProperty(y)) {
      for(var x in gameField[y]) {
        if(gameField[y].hasOwnProperty(x) && gameField[y][x] != TicTacToe.MARK_NONE) {
          $('[x=' + x + '][y=' + y + ']').addClass(gameField[y][x] == TicTacToe.MARK_X ? 'mark_x' : 'mark_o').attr('mark', gameField[y][x]);
        }
      }
    }
  }
};

Board.prototype.snRetrieve = function (jsonObject) {
  jsonObject instanceof Object ? $.extend(this, jsonObject) : false;
};

//Board.prototype.toString = function() {
//  return JSON.stringify(this, function(key, value) {
//    if (key == 'round') {
//      return undefined; // удаляем все строковые свойства
//    }
//    //if (key == 'board') {
//    //  return undefined; // удаляем все строковые свойства
//    //}
//    //if(key == 'playerCurrent') {
//    //  //console.log(value);
//    //  return value.mark;
//    //}
//    //return value.toString();
//  });
//};

