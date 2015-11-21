/**
 *
 * @param {number} mark - Какой меткой инициализировать игрока
 * @param {?Player} otherPlayer - Опциональный параметр - кто уже есть
 * @constructor
 */
function Player(mark, otherPlayer) {
  this.type = !otherPlayer || !otherPlayer.type || otherPlayer.type == TicTacToe.PLAYER_COMPUTER ? TicTacToe.PLAYER_LOCAL : TicTacToe.PLAYER_COMPUTER;
  this.mark = !otherPlayer || !otherPlayer.mark || otherPlayer.mark != mark ? mark : (otherPlayer.mark == TicTacToe.MARK_X ? TicTacToe.MARK_O : TicTacToe.MARK_X);

  this.toString = function() {
    return JSON.stringify(this);
  };

  if(this.type == TicTacToe.PLAYER_LOCAL) {
    this.waitForMove = function() {
      // TODO Allow player to move
//console.log('Waiting input');
    };

    this.checkMove = function(cell) {
      var game = window.round;
      var x = parseInt(cell.attr('x'));
      var y = parseInt(cell.attr('y'));

      if(game.board.checkCell(y, x) == TicTacToe.MARK_NONE) {
      //if(game.gameField[y] && game.gameField[y][x] == TicTacToe.MARK_NONE) {
        sn_sound_play('other_moved');
        game.makeMove({x: x, y: y, mark: game.playerCurrent.mark});
      } else {
        // todo Сообщение об ошибке
        sn_sound_play('fail');
        return false;
      }
    }
  } else {
    this.waitForMove = function() {
      window.round.makeMove(this.makeMove());
    };

    this.makeMove = function() {
      //var game = window.round;
      // TODO - DI
      var gameField = window.round.board.gameField;
      var emptyCells = [];

      for(var y in gameField) {
        if(gameField.hasOwnProperty(y)) {
          for(var x in gameField[y]) {
            if(gameField[y].hasOwnProperty(x) && gameField[y][x] == TicTacToe.MARK_NONE) {
              emptyCells.push({x: x, y: y});
            }
          }
        }
      }
//console.log(TicTacToe.MARK_NONE);
      var cellIndex = Math.randomInt(0, emptyCells.length - 1);

//console.log('cellIndex');
//console.log(cellIndex);

      return $.extend(emptyCells[cellIndex], {mark: this.mark});
    }
  }
}
