/**
 *
 * @param {!number} newPlayerX
 * @constructor
 */

// function TicTacToe(newPlayerX) {
var TicTacToe = function (newPlayerX) {
  // TODO - разобраться со статическими методами в JS - и, если нужно, позаменять везде TicTacToe.XXX на this.XXX

  !fieldWidth ? fieldWidth = 3 : false;
  !fieldHeight ? fieldHeight = 3 : false;

  this.fieldsEmpty = this.fields = fieldWidth * fieldHeight;
  this.gameField = [];
  if(fieldWidth && fieldHeight) {
    for(var i = 0; i < fieldHeight; i++) {
      this.gameField[i] = [];
      for(var j = 0; j < fieldWidth; j++) {
        this.gameField[i][j] = TicTacToe.MARK_NONE;
      }
    }
  }
  this.gameFieldEmpty = $.extend(true, [], this.gameField);

  this.localStoragePresent = typeof(localStorage) !== "undefined";
  if(this.localStoragePresent && localStorage.tictactoe) {
    $.extend(this, JSON.parse(localStorage.tictactoe));

    this.playerX = new Player(TicTacToe.MARK_X, this.playerO);
    this.playerO = new Player(TicTacToe.MARK_O, this.playerX);

    this.playerCurrent = this.playerCurrent == TicTacToe.MARK_X ? this.playerX : this.playerO;
  } else {
    this.playerX = new Player(newPlayerX);
    this.playerO = new Player(newPlayerX == TicTacToe.MARK_X ? TicTacToe.MARK_O : TicTacToe.MARK_X, this.playerX);

    this.playerCurrent = this.playerX;

    this.playerIsZero = 0;
  }

  this.localPlayer = this.playerX.type == TicTacToe.PLAYER_LOCAL ? this.playerX : this.playerO;

  this.toString = function() {
    return JSON.stringify(this, function(key, value) {
      if (key == 'localPlayer') {
        return undefined; // удаляем все строковые свойства
      }
      if(key == 'playerCurrent') {
        //console.log(value);
        return value.mark;
      }
      return value;
    });
  };

  /**
   * Функция актуализирует состояние фронт-енда в соответствии с данными из стораджа
   */
  this.renderStorage = function() {
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

    $('#mark_o').attr('checked', this.playerIsZero ? true : false);
  };

  this.makeMove = function(move) {
    if((move) && (move instanceof Object)) {

      this.gameField[move.y][move.x] == TicTacToe.MARK_NONE ? this.fields-- : false;
      this.gameField[move.y][move.x] = move.mark;

      $('[x=' + move.x + '][y=' + move.y + ']').addClass(this.playerCurrent.mark == TicTacToe.MARK_X ? 'mark_x' : 'mark_o').attr('mark', move.mark);

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

        // Звук победы
        sn_sound_play('win');

        alert(l.message_player_win[this.playerCurrent.type]);
        this.resetField();

        return;
      }

      if(this.fields <= 0) {
        sn_sound_play('game_over');
        alert(l.message_player_win[TicTacToe.PLAYER_UNDEFINED]);
        this.resetField();
      } else {
        this.playerCurrent = this.playerCurrent.mark == TicTacToe.MARK_X ? this.playerO : this.playerX;
        $('#game_message').text(l.message_player[this.playerCurrent.type]);

        if(this.localStoragePresent) {
          localStorage.tictactoe = this.toString();
        }

        this.playerCurrent.waitForMove();
      }
    } else {
      sn_sound_play('fail');
      alert('Поворот не туда!');
    }
  };

  /**
   * Функция обнуляет игру
   */
  this.resetField = function() {
    $('.cell').removeClass('mark_x mark_o mark_win');

    this.gameField = $.extend(true, [], this.gameFieldEmpty);
    round.fields = round.fieldsEmpty;

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

TicTacToe.MARK_NONE = 0;
TicTacToe.MARK_X = 1;
TicTacToe.MARK_O = 2;

TicTacToe.PLAYER_UNDEFINED = 0;
TicTacToe.PLAYER_LOCAL = 1;
TicTacToe.PLAYER_COMPUTER = 2;

//TicTacToe.WIN_VERTICAL = TicTacToe.prototype.WIN_VERTICAL = 0;
//TicTacToe.WIN_HORIZONTAL = TicTacToe.prototype.WIN_HORIZONTAL = 1;
//TicTacToe.WIN_DIAGONAL_MAIN = TicTacToe.prototype.WIN_DIAGONAL_MAIN = 2;
//TicTacToe.WIN_DIAGONAL_SECONDARY = TicTacToe.prototype.WIN_DIAGONAL_SECONDARY = 3;
//
//TicTacToe.MARK_NONE = TicTacToe.prototype.MARK_NONE = 0;
//TicTacToe.MARK_X = TicTacToe.prototype.MARK_X = 1;
//TicTacToe.MARK_O = TicTacToe.prototype.MARK_O = 2;
//
//TicTacToe.PLAYER_UNDEFINED = TicTacToe.prototype.PLAYER_UNDEFINED = 0;
//TicTacToe.PLAYER_LOCAL = TicTacToe.prototype.PLAYER_LOCAL = 1;
//TicTacToe.PLAYER_COMPUTER = TicTacToe.prototype.PLAYER_COMPUTER = 2;
