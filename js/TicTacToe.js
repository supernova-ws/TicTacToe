/**
 *
 * @param {!number} newPlayerX
 * @constructor
 */

//localStorage.TicTacToe = '';

function TicTacToe(params) {
  this.snClass = this.constructor.name;
  !(params instanceof Object) ? params = {} : false;
//var TicTacToe = function (newPlayerX) {
  // TODO - разобраться со статическими методами в JS - и, если нужно, позаменять везде TicTacToe.XXX на this.XXX

  //console.log(this.constructor.name);
  //console.log(Function.prototype.name);
  //console.log(Function.prototype.name === undefined);

  this.localStoragePresent = typeof(localStorage) !== "undefined";

  if(this.localStoragePresent && localStorage.TicTacToe) {
    this.snRevive();
//console.log('this.playerCurrent');
//console.log(this.playerCurrent);
  } else {
    this.board = new Board({height: fieldHeight, width: fieldWidth, winStreak: winStreak});

    this.playerX = new Player({round: this} );
    this.playerO = new Player({round: this, mark: TicTacToe.MARK_O, type: TicTacToe.PLAYER_COMPUTER});

    this.playerCurrent = this.playerX;

    this.playerIsZero = 0;
  }

  this.localPlayer = this.playerX.type == TicTacToe.PLAYER_LOCAL ? this.playerX : this.playerO;

  this.board.renderBoard();

  this.renderStorage();
  this.playerCurrent.waitForMove();
}

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

TicTacToe.prototype.makeMove = function(move) {
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
};

/**
 * Функция обнуляет игру
 */
TicTacToe.prototype.resetField = function() {
  this.board.resetField();

  this.localPlayer = this.playerX.type == TicTacToe.PLAYER_LOCAL ? this.playerX : this.playerO;
  this.playerCurrent = this.playerX;
  $('#game_message').text(l.message_player[this.playerCurrent.type]);

  if(this.localStoragePresent) {
    localStorage.TicTacToe = '';
  }

  this.playerCurrent.waitForMove();
};


/**
 *
 * @param checkbox
 */
TicTacToe.prototype.changeSide = function(checkbox) {
  this.playerIsZero = $(checkbox).is(':checked') ? 1 : 0;

  this.playerX = new Player({round: this, mark: TicTacToe.MARK_X, type: this.playerIsZero ? TicTacToe.PLAYER_COMPUTER : TicTacToe.PLAYER_LOCAL});
  this.playerO = new Player({round: this, mark: TicTacToe.MARK_O, type: this.playerIsZero ? TicTacToe.PLAYER_LOCAL : TicTacToe.PLAYER_COMPUTER});

  this.resetField();
};

/**
 * Функция актуализирует состояние фронт-енда в соответствии с данными из стораджа
 */
TicTacToe.prototype.renderStorage = function() {
  this.board.renderBoard();

  $('#mark_o').attr('checked', this.playerIsZero ? true : false);
};

TicTacToe.prototype.snStore = function() {
  if(!this.localStoragePresent) {
    return;
  }

  console.log('Storing: ' + JSON.stringify(this));

  localStorage.TicTacToe = JSON.stringify(this);
};

TicTacToe.prototype.snRevive = function () {
  if(!this.localStoragePresent) {
    return;
  }

  console.log('Retrieving: ' + localStorage.TicTacToe);

  var that = this;

  var jsonParsed = JSON.parse(localStorage.TicTacToe, function(key, value) {
    if(key && typeof(value) == 'object' && value.snClass && window[value.snClass] && typeof(window[value.snClass].prototype.snRevive) == 'function') {
      return new window[value.snClass]({revive: $.extend({_gameRound: that}, value)});
    } else {
      return value;
    }
  });

  $.extend(this, jsonParsed);

  //console.log('jsonParsed.playerX');
  //console.log(jsonParsed.playerX);
  //console.log('this.playerX');
  //console.log(this.playerX);

  // TODO - Убрать, когда будут нормальные игроки
  this.playerX = new Player($.extend({round: this}, jsonParsed.playerX));
  this.playerO = new Player($.extend({round: this}, jsonParsed.playerO));

  //this.playerX = new Player(TicTacToe.MARK_X, jsonParsed.playerO);
  //this.playerO = new Player(TicTacToe.MARK_O, jsonParsed.playerX);

  this.playerCurrent = jsonParsed.playerCurrent.mark == TicTacToe.MARK_X ? this.playerX : this.playerO;
};
