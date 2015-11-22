/**
 *
 * @constructor
 */
function PlayerFactory() {
}

/**
 *
 * @param params
 * @returns {Player}
 */
PlayerFactory.getPlayer = function (params) {
  !(params instanceof Object) ? params = {} : false;

  params.type = parseInt(params.type) ? parseInt(params.type) : TicTacToe.PLAYER_LOCAL;

  if(params.type == TicTacToe.PLAYER_LOCAL) {
    params.mark = params._gameRound.playerIsZero ? TicTacToe.MARK_O : TicTacToe.MARK_X;
  } else {
    params.mark = params._gameRound.playerIsZero ? TicTacToe.MARK_X : TicTacToe.MARK_O;
  }

  //console.log(
  //  (params.type == TicTacToe.PLAYER_LOCAL ? 'TicTacToe.PLAYER_LOCAL' : 'TicTacToe.PLAYER_COMPUTER')
  //  + ' '
  //  + (params.mark == TicTacToe.MARK_X ? 'MARK_X' : 'MARK_O')
  //);

  // TODO - Сделать нормально по классам

  if(params.type == TicTacToe.PLAYER_LOCAL) {
    return new PlayerHumanLocal(params);
  } else {
    switch(params._gameRound.computerSkill) {
      case TicTacToe.COMPUTER_LG:
        return new PlayerComputerLG(params);
      //case TicTacToe.COMPUTER_LE:
      //  return new PlayerComputerLE(params);
      case TicTacToe.COMPUTER_CE:
        return new PlayerComputerCE(params);
      default:
        return new PlayerComputerCE(params);
    }
  }

};
