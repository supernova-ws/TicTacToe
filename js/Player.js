/**
 *
 * @param {number} mark - Какой меткой инициализировать игрока
 * @param {?Player} otherPlayer - Опциональный параметр - кто уже есть
 * @constructor
 */
function Player(params) {
  this.snClass = this.constructor.name;
  !(params instanceof Object) ? params = {} : false;

  if(params.revive && typeof(params.revive) == "object" && params.revive.snClass == this.snClass) {
    this.snRevive(params.revive);
    return;
  }

  this._gameRound = params.round;

  this.mark = parseInt(params.mark) ? parseInt(params.mark) : TicTacToe.MARK_X;
  this.type = parseInt(params.type) ? parseInt(params.type) : TicTacToe.PLAYER_LOCAL;

  // this.brain =

  //this.type = !otherPlayer || !otherPlayer.type || otherPlayer.type == TicTacToe.PLAYER_COMPUTER ? TicTacToe.PLAYER_LOCAL : TicTacToe.PLAYER_COMPUTER;
  //this.mark = !otherPlayer || !otherPlayer.mark || otherPlayer.mark != mark ? mark : (otherPlayer.mark == TicTacToe.MARK_X ? TicTacToe.MARK_O : TicTacToe.MARK_X);

  // console.log(JSON.stringify(this, ['mark', 'type']));

  if(this.type == TicTacToe.PLAYER_LOCAL) {
    this.waitForMove = function() {
      // TODO Allow player to move
//console.log('Waiting input');
    };

    this.checkMove = function(cell) {
      // var game = window.round;
      var game = this._gameRound;
      var x = parseInt(cell.attr('x'));
      var y = parseInt(cell.attr('y'));

      if(game.board.checkCell(y, x) == TicTacToe.MARK_NONE) {
      //if(game.gameField[y] && game.gameField[y][x] == TicTacToe.MARK_NONE) {
        sn_sound_play('other_moved');
        game.makeMove({x: x, y: y, mark: game.playerCurrent.mark});
      } else {
        // Сообщение об ошибке
        sn_sound_play('fail');
        return false;
      }
    }
  } else {
    this.waitForMove = function() {
      this._gameRound.makeMove(this.makeMove());
    };

    this.makeMove = function() {
      //var emptyCells = window.round.board.getEmptyCells();
      var emptyCells = this._gameRound.board.getEmptyCells();
      var cellIndex = Math.randomInt(0, emptyCells.length - 1);

      return $.extend(emptyCells[cellIndex], {mark: this.mark});
    }
  }
}

Player.prototype.toJSON = function(key) {
  var shit = $.extend({}, this);
  for(var i in shit) {
    if(shit.hasOwnProperty(i) && i.charAt(0) == '_') {
      shit[i] = undefined;
    }
  }
  // console.log(shit._gameRound instanceof TicTacToe);
  // shit._gameRound = undefined;
  return shit;
};

Player.prototype.snRevive = function (jsonObject) {
  jsonObject instanceof Object ? $.extend(this, jsonObject) : false;
};
