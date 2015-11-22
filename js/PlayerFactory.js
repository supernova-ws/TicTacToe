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

  //this._gameRound = params._gameRound;

  params.type = parseInt(params.type) ? parseInt(params.type) : TicTacToe.PLAYER_LOCAL;
  //console.log('this._gameRound.playerIsZero');
  //console.log(this._gameRound.playerIsZero);

  if(params.type == TicTacToe.PLAYER_LOCAL) {
    params.mark = params._gameRound.playerIsZero ? TicTacToe.MARK_O : TicTacToe.MARK_X;
  } else {
    params.mark = params._gameRound.playerIsZero ? TicTacToe.MARK_X : TicTacToe.MARK_O;
  }

  //params.mark = this._gameRound.playerIsZero && (params.type == TicTacToe.PLAYER_LOCAL) ? TicTacToe.MARK_O : TicTacToe.MARK_X;

  //console.log();
  //console.log(
  //  (params.type == TicTacToe.PLAYER_LOCAL ? 'TicTacToe.PLAYER_LOCAL' : 'TicTacToe.PLAYER_COMPUTER')
  //  + ' '
  //  + (params.mark == TicTacToe.MARK_X ? 'MARK_X' : 'MARK_O')
  //);

  //this.playerLocal = PlayerFactory.getPlayer({_gameRound: this, mark: TicTacToe.MARK_X, type: this.playerIsZero ? TicTacToe.PLAYER_COMPUTER : TicTacToe.PLAYER_LOCAL});
  //this.playerOther = PlayerFactory.getPlayer({_gameRound: this, mark: TicTacToe.MARK_O, type: this.playerIsZero ? TicTacToe.PLAYER_LOCAL : TicTacToe.PLAYER_COMPUTER});

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
