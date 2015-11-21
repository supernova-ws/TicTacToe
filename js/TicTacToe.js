/**
 *
 * @param {!number} newPlayerX
 * @constructor
 */

//function TicTacToe(newPlayerX) {
var TicTacToe = function (newPlayerX) {
  // TODO - разобраться со статическими методами в JS - и, если нужно, позаменять везде TicTacToe.XXX на this.XXX

  //!fieldWidth ? fieldWidth = 3 : false;
  //!fieldHeight ? fieldHeight = 3 : false;

  //this.fieldsEmpty = this.fields = fieldWidth * fieldHeight;
  //this.gameField = [];
  //if(fieldWidth && fieldHeight) {
  //  for(var i = 0; i < fieldHeight; i++) {
  //    this.gameField[i] = [];
  //    for(var j = 0; j < fieldWidth; j++) {
  //      this.gameField[i][j] = TicTacToe.MARK_NONE;
  //    }
  //  }
  //}
  //this.gameFieldEmpty = $.extend(true, [], this.gameField);

  this.localStoragePresent = typeof(localStorage) !== "undefined";
  this.board = new Board(fieldHeight, fieldWidth, this);

  // TODO - включить обратно
  if(this.localStoragePresent && localStorage.tictactoe) {
    this.snRetrieve();
  } else {
    this.playerX = new Player(newPlayerX);
    this.playerO = new Player(newPlayerX == TicTacToe.MARK_X ? TicTacToe.MARK_O : TicTacToe.MARK_X, this.playerX);

    this.playerCurrent = this.playerX;

    this.playerIsZero = 0;
  }

  this.localPlayer = this.playerX.type == TicTacToe.PLAYER_LOCAL ? this.playerX : this.playerO;

  /**
   * Функция актуализирует состояние фронт-енда в соответствии с данными из стораджа
   */
  this.renderStorage = function() {
    this.board.renderBoard();

    $('#mark_o').attr('checked', this.playerIsZero ? true : false);
  };

  this.makeMove = function(move) {
    var result = this.board.makeMove(move);
    switch(result) {
      case 'currentPlayerWin': {
        // Звук победы
        sn_sound_play('win');

        alert(l.message_player_win[this.playerCurrent.type]);
        this.resetField();

        break;
      }

      case 'draw': {
        sn_sound_play('game_over');

        alert(l.message_player_win[TicTacToe.PLAYER_UNDEFINED]);
        this.resetField();
        break;
      }

      case 'nextMove': {
        this.playerCurrent = this.playerCurrent.mark == TicTacToe.MARK_X ? this.playerO : this.playerX;
        $('#game_message').text(l.message_player[this.playerCurrent.type]);

        this.snStore();

        this.playerCurrent.waitForMove();
        break;
      }

      default: {
        sn_sound_play('fail');
        alert('Поворот не туда!');

        break;
      }
    }
    //if((move) && (move instanceof Object)) {
    //
    //  this.gameField[move.y][move.x] == TicTacToe.MARK_NONE ? this.fields-- : false;
    //  this.gameField[move.y][move.x] = move.mark;
    //
    //  $('[x=' + move.x + '][y=' + move.y + ']').addClass(this.playerCurrent.mark == TicTacToe.MARK_X ? 'mark_x' : 'mark_o').attr('mark', move.mark);
    //
    //  var win = [0,0,0,0];
    //  for(var i = 0; i < 3; i++) {
    //    // Проверяем главную диагональ \
    //    move.x == move.y && this.gameField[i][i] == move.mark ? win[TicTacToe.WIN_DIAGONAL_MAIN]++ : false;
    //    (move.x + move.y) == 2 && this.gameField[i][2 - i] == move.mark ? win[TicTacToe.WIN_DIAGONAL_SECONDARY]++ : false;
    //
    //    // Проверяем вертикаль
    //    this.gameField[i][move.x] == move.mark ? win[TicTacToe.WIN_VERTICAL]++ : false;
    //    // Проверяем горизонталь
    //    this.gameField[move.y][i] == move.mark ? win[TicTacToe.WIN_HORIZONTAL]++ : false;
    //  }
    //
    //  var max = Math.max.apply(null, win);
    //  if(max == 3) {
    //    var winSelector = [];
    //    var winMethod = win.indexOf(max);
    //    switch(winMethod) {
    //      case TicTacToe.WIN_VERTICAL:
    //        winSelector.push('[x=' + move.x + ']');
    //        break;
    //      case TicTacToe.WIN_HORIZONTAL:
    //        winSelector.push('[y=' + move.y + ']');
    //        break;
    //      case TicTacToe.WIN_DIAGONAL_MAIN:
    //        winSelector.push('.diagonal_main');
    //        break;
    //      case TicTacToe.WIN_DIAGONAL_SECONDARY:
    //        winSelector.push('.diagonal_secondary');
    //        break;
    //    }
    //    $(winSelector.join(' ')).addClass('mark_win');
    //
    //    // Звук победы
    //    sn_sound_play('win');
    //
    //    alert(l.message_player_win[this.playerCurrent.type]);
    //    this.resetField();
    //
    //    return;
    //  }
    //
    //  if(this.fields <= 0) {
    //    sn_sound_play('game_over');
    //    alert(l.message_player_win[TicTacToe.PLAYER_UNDEFINED]);
    //    this.resetField();
    //  } else {
    //    this.playerCurrent = this.playerCurrent.mark == TicTacToe.MARK_X ? this.playerO : this.playerX;
    //    $('#game_message').text(l.message_player[this.playerCurrent.type]);
    //
    //    if(this.localStoragePresent) {
    //      localStorage.tictactoe = this.toString();
    //    }
    //
    //    this.playerCurrent.waitForMove();
    //  }
    //} else {
    //  sn_sound_play('fail');
    //  alert('Поворот не туда!');
    //}
  };

  this.snStore = function() {
    if(!this.localStoragePresent) {
      return;
    }

    localStorage.tictactoe = JSON.stringify(this);
  };

  //this.snRetrieve = function () {
  //  //console.log(localStorage.tictactoe);
  //
  //  var jsonParsed = JSON.parse(localStorage.tictactoe);
  //
  //  $.extend(this, jsonParsed);
  //
  //  this.board.snRetrieve(jsonParsed.board);
  //
  //  this.playerX = new Player(TicTacToe.MARK_X, jsonParsed.playerO);
  //  this.playerO = new Player(TicTacToe.MARK_O, jsonParsed.playerX);
  //
  //  this.playerCurrent = jsonParsed.playerCurrent.mark == TicTacToe.MARK_X ? this.playerX : this.playerO;
  //};

  /**
   * Функция обнуляет игру
   */
  this.resetField = function() {
    this.board.resetField();

    this.localPlayer = this.playerX.type == TicTacToe.PLAYER_LOCAL ? this.playerX : this.playerO;
    this.playerCurrent = this.playerX;
    $('#game_message').text(l.message_player[this.playerCurrent.type]);

    if(this.localStoragePresent) {
      localStorage.tictactoe = '';
    }

    this.playerCurrent.waitForMove();
  };

  /**
   *
   * @param checkbox
   */
  this.changeSide = function(checkbox) {
    this.playerIsZero = $(checkbox).is(':checked') ? 1 : 0;

    if(this.playerIsZero && this.playerO.type != TicTacToe.PLAYER_LOCAL) {
      this.playerO = new Player(TicTacToe.MARK_O);
      this.playerX = new Player(TicTacToe.MARK_X, this.playerO);
    } else {
      this.playerX = new Player(TicTacToe.MARK_X);
      this.playerO = new Player(TicTacToe.MARK_O, this.playerX);
    }

    //console.log(this.toString());

    this.resetField();
  };

  //console.log(this.gameField);
};

TicTacToe.WIN_VERTICAL = 0;
TicTacToe.WIN_HORIZONTAL = 1;
TicTacToe.WIN_DIAGONAL_MAIN = 2;
TicTacToe.WIN_DIAGONAL_SECONDARY = 3;

TicTacToe.MARK_OUTSIDE = -1;
TicTacToe.MARK_NONE = 0;
TicTacToe.MARK_X = 1;
TicTacToe.MARK_O = 2;

TicTacToe.PLAYER_UNDEFINED = 0;
TicTacToe.PLAYER_LOCAL = 1;
TicTacToe.PLAYER_COMPUTER = 2;

TicTacToe.prototype.snRetrieve = function () {
  // console.log('Retrieving: ' + localStorage.tictactoe);

  //var jsonParsed = JSON.parse(localStorage.tictactoe, function(key, value) {
  //  // console.log(key);
  //  switch(key) {
  //    case 'board':
  //      //aField = new Board();
  //      //return aField.snRetrieve(value);
  //
  //    default:
  //      return value;
  //  }
  //});
  //

  var jsonParsed = JSON.parse(localStorage.tictactoe);

  var oldField = this.board;
  $.extend(this, jsonParsed);
  this.board = oldField;

  this.board.snRetrieve(jsonParsed.board);

  this.playerX = new Player(TicTacToe.MARK_X, jsonParsed.playerO);
  this.playerO = new Player(TicTacToe.MARK_O, jsonParsed.playerX);

  this.playerCurrent = jsonParsed.playerCurrent.mark == TicTacToe.MARK_X ? this.playerX : this.playerO;
};
