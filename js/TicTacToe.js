/**
 *
 * @param {!number} newPlayerX
 * @constructor
 */

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

TicTacToe.COMPUTER_CE = 1;
TicTacToe.COMPUTER_LE = 2;
TicTacToe.COMPUTER_LG = 3;

//var TicTacToe = function (newPlayerX) {
/**
 * Конструктор игры
 *
 * @param params
 * @constructor
 */
function TicTacToe(params) {
  this.snClass = this.constructor.name;
  params = $.extend(params instanceof Object ? params : {}, {_gameRound: this});

  this.localStoragePresent = typeof(localStorage) !== "undefined";

  if(!this.gameLoad(params)) {
    this.computerSkill = TicTacToe.COMPUTER_CE;
    this.playerIsZero = 0;

    this.gameReset(params);
  }

  this.gameRender();

  this.playerCurrent.waitForMove();
}

TicTacToe.prototype.gameReset = function(params) {
  this.board = new Board({height: fieldHeight, width: fieldWidth, winStreak: winStreak});

  this.playerLocal = PlayerFactory.getPlayer({_gameRound: this, type: TicTacToe.PLAYER_LOCAL});
  this.playerOther = PlayerFactory.getPlayer({_gameRound: this, type: TicTacToe.PLAYER_COMPUTER});

  this.playerCurrent = this.playerLocal.mark == TicTacToe.MARK_X ? this.playerLocal : this.playerOther;

  this.snStore();
};

/**
 *
 */
TicTacToe.prototype.changeSide = function() {
  this.manageInput();
  this.gameReset();
  this.gameRender();

  this.playerCurrent.waitForMove();
};


/**
 *
 * @param move
 */
TicTacToe.prototype.makeMove = function(move) {
  var result = this.board.placeMark(move);

  switch(result) {
    case 'currentPlayerWin': {
      // Звук победы
      sn_sound_play('win');

      alert(l.message_player_win[this.playerCurrent.type]);
      this.changeSide();

      break;
    }

    case 'draw': {
      sn_sound_play('game_over');

      alert(l.message_player_win[TicTacToe.PLAYER_UNDEFINED]);
      this.changeSide();
      break;
    }

    case 'nextMove': {
      this.playerCurrent.mark != this.playerLocal.mark ? sn_sound_play('other_moved') : false;

      this.playerCurrent = this.playerCurrent.mark == this.playerLocal.mark ? this.playerOther : this.playerLocal;

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
//TicTacToe.prototype.resetField = function() {
//  this.board.resetField();
//
//  this.playerCurrent = this.playerLocal;
//  $('#game_message').text(l.message_player[this.playerCurrent.type]);
//
//  if(this.localStoragePresent) {
//    localStorage.TicTacToe = '';
//  }
//
//  this.playerCurrent.waitForMove();
//};

/**
 * Функция актуализирует состояние фронт-енда в соответствии с состоянием объекта
 */
TicTacToe.prototype.gameRender = function() {
  this.board.renderBoard();

  $('#mark_o').attr('checked', this.playerIsZero ? true : false);
  $('input:radio[name=computerSkill]').val([this.computerSkill]);
};

/**
 * Читает данные из формы
 */
TicTacToe.prototype.manageInput = function() {
  this.playerIsZero = $('#mark_o').is(':checked') ? 1 : 0;
  this.computerSkill = parseInt($('input:radio[name=computerSkill]:checked').val());
};

function testStringify(key, value) {
  result = undefined;
  //console.log('key = "{0}", key type = {1}, type = "{2}"'.format(key, typeof(key), typeof(value)));
  //console.log(value instanceof Array);
  //console.log(value);
  if(typeof(key) == 'number' || key.charAt(0) != '_') {
    if(value instanceof Array) {
      result = JSON.parse(JSON.stringify(value)); // Fix for Opera 12
    } else {
      result = value;
    }
    result = value;
  }

  return result;
}

TicTacToe.prototype.snStore = function() {
  if(!this.localStoragePresent) {
    return;
  }

  localStorage.TicTacToe = JSON.stringify(this, testStringify);
  console.log('Storing: ' + localStorage.TicTacToe);
  //console.log('Storing: ' + JSON.stringify(this, testStringify));
  //localStorage.TicTacToe = '';
};
TicTacToe.prototype.gameLoad = function (params) {
  if(!this.localStoragePresent || !localStorage.TicTacToe) {
    return false;
  }

  console.log('Retrieving: ' + localStorage.TicTacToe);

  var _that = this;

  var _jsonParsed = JSON.parse(localStorage.TicTacToe, function(key, value) {
    if(key && typeof(value) == 'object' && value.snClass && window[value.snClass] && typeof(window[value.snClass].prototype.snRevive) == 'function') {
      return new window[value.snClass]({_revive: $.extend({_gameRound: _that}, value)});
    } else {
      return value;
    }
  });

  $.extend(this, _jsonParsed);

  // TODO - Убрать, когда будут нормальные фабрики
  this.playerLocal = PlayerFactory.getPlayer($.extend({_gameRound: this}, _jsonParsed.playerLocal));
  this.playerOther = PlayerFactory.getPlayer($.extend({_gameRound: this}, _jsonParsed.playerOther));

  this.playerCurrent = _jsonParsed.playerCurrent.mark == this.playerLocal.mark ? this.playerLocal : this.playerOther;

  console.log(this.playerCurrent);

  console.log('Revived');

  return true;
};
