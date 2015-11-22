/**
 *
 * @param {number} mark - Какой меткой инициализировать игрока
 * @param {?Player} otherPlayer - Опциональный параметр - кто уже есть
 * @constructor
 */
function Player(params) {
  this.snClass = this.constructor.name;
  !(params instanceof Object) ? params = {} : false;

  if(params._revive && typeof(params._revive) == "object" && params._revive.snClass == this.snClass) {
    this.snRevive(params._revive);
    return;
  }

  this._gameRound = params._gameRound;
  //this.prototype._gameRound = params._gameRound;

  this.mark = parseInt(params.mark) ? parseInt(params.mark) : TicTacToe.MARK_X;
  this.type = parseInt(params.type) ? parseInt(params.type) : TicTacToe.PLAYER_LOCAL;
}
//Player.prototype.toJSON = function(key) {
//  if(key.charAt(0) == '_') {
//    return undefined;
//  }
//
//  var shit = $.extend({}, this);
//  for(var i in shit) {
//    if(shit.hasOwnProperty(i) && i.charAt(0) == '_') {
//      shit[i] = undefined;
//    }
//  }
//  // console.log(shit._gameRound instanceof TicTacToe);
//  // shit._gameRound = undefined;
//  return shit;
//};
Player.prototype.snRevive = function (jsonObject) {
//console.log(jsonObject);
  jsonObject instanceof Object ? $.extend(this, jsonObject) : false;
};

Player.prototype.waitForMove = function() {
  // TODO Allow player to move
//console.log('Waiting input');
};


/**
 *
 * @param params
 * @constructor
 * @augments Player
 */
function PlayerHumanLocal(params) {
  Player.apply(this, arguments);
}
PlayerHumanLocal.prototype = Object.create(Player.prototype);
PlayerHumanLocal.prototype.constructor = PlayerHumanLocal;
PlayerHumanLocal.prototype.checkMove = function(cell) {
  //console.log('LOCAL');

  var game = this._gameRound;

  if(game.playerCurrent.mark == this.mark) {
    var x = parseInt(cell.attr('x'));
    var y = parseInt(cell.attr('y'));

    if(game.board.getCellMark(y, x) == TicTacToe.MARK_NONE) {
      game.makeMove({x: x, y: y, mark: this.mark});
      return false;
    } else {
      // Сообщение об ошибке
      sn_sound_play('fail');
      return false;
    }
  } else {
    // Сообщение об ошибке
    sn_sound_play('fail');
    return false;
  }
};


/**
 *
 * @param params
 * @constructor
 * @augments Player
 */
function PlayerComputerCE(params) {
  Player.apply(this, arguments);
}
PlayerComputerCE.prototype = Object.create(Player.prototype);
PlayerComputerCE.prototype.constructor = PlayerComputerCE;
PlayerComputerCE.prototype.waitForMove = function() {
  //console.log('COMPUTER_CE');

  var emptyCells = this._gameRound.board.getEmptyCells();
  var cellIndex = Math.randomInt(0, emptyCells.length - 1);

//  sn_sound_play('other_moved');

  move = $.extend(emptyCells[cellIndex], {mark: this.mark});

  this._gameRound.makeMove(move);
};

/**
 *
 * @param params
 * @constructor
 * @augments Player
 */
function PlayerComputerLG(params) {
  Player.apply(this, arguments);
}
PlayerComputerLG.prototype = Object.create(Player.prototype);
PlayerComputerLG.prototype.constructor = PlayerComputerLG;
PlayerComputerLG.prototype.waitForMove = function() {
  //console.log('COMPUTER_LG');

  var emptyCells = this._gameRound.board.getEmptyCells();

  move = $.extend(emptyCells[0], {mark: this.mark});

//  sn_sound_play('other_moved');

  this._gameRound.makeMove(move);
};
