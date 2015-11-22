/**
 * Прототип всех игроков
 *
 * @param params
 * @param {TicTacToe} params._gameRound Ссылка на родительский объект
 * @param {Object} params._revive Указатель необходимости провести ревайв объекта
 * @param {number} params.mark Значок игрока
 * @param {number} params.type Тип игрока - компьютер или игрок
 * @constructor
 *
 * @prop {string} snClass
 * @prop {TicTacToe} _gameRound
 * @prop {number} mark
 * @prop {type} mark
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
/**
 * Производит ревайв объекта - восстанавливает его свойства после отключения страницы
 * @param jsonObject
 */
Player.prototype.snRevive = function (jsonObject) {
  jsonObject instanceof Object ? $.extend(this, jsonObject) : false;
};

/**
 * Метод разрешает игроку сделать ход
 */
Player.prototype.waitForMove = function() {
  // TODO Allow player to move
//console.log('Waiting input');
};


/**
 * Игрок-человек
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
/**
 * Проверка допустимости хода локального игрока
 *
 * @param cell
 * @returns {boolean}
 */
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
 * Игрок-компьютер сложности CE
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

  move = $.extend(emptyCells[cellIndex], {mark: this.mark});

  this._gameRound.makeMove(move);
};

/**
 * Игрок-компьютер сложности LG
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

  this._gameRound.makeMove(move);
};

/**
 * Игрок-компьютер сложности LE
 *
 * @param params
 * @constructor
 * @augments Player
 */
function PlayerComputerLE(params) {
  Player.apply(this, arguments);
}
PlayerComputerLE.prototype = Object.create(Player.prototype);
PlayerComputerLE.prototype.constructor = PlayerComputerLE;
// TODO - переделать в прототип
function maxProperty(obj) {
  var result = {
    maxLaneLength: 0,
    items: [],
  };

  for(var i in obj) {
    if(!obj.hasOwnProperty(i)) {
      continue;
    }

    if(obj[i].length > result.maxLaneLength) {
      result.maxLaneLength = obj[i].length;
      result.items = []; // {lane: }
    }
    if(obj[i].length == result.maxLaneLength) {
      result.items.push(i);
    }
  }

  return result;
}
PlayerComputerLE.prototype.waitForMove = function() {
//console.log('COMPUTER_LE');
  var move;

  var board = this._gameRound.board;
  var cells = board.gameField;

  // Ассоциативная память компьютера
  var brainMemory = {
    me: {
      whoIs: 'me',

      all: [],

      corner: [],
      side: [],
      middle: [],

      count: {
        d1: [],
        d2: [],
        x0: [],
        x1: [],
        x2: [],
        y0: [],
        y1: [],
        y2: [],
      },
    },
    enemy: {},
    noOne: {},
  };
  brainMemory.enemy = $.extend(true, {}, brainMemory.me, {whoIs: 'enemy'});
  brainMemory.noOne = $.extend(true, {}, brainMemory.me, {whoIs: 'noOne'});

  // Шорткаты
  var me = brainMemory.me, enemy = brainMemory.enemy, noOne = brainMemory.noOne;

  var who;
  for(var y = 0; y < board.fieldHeight; y++) {
    for(var x = 0; x < board.fieldWidth; x++) {
      who = cells[y][x] == TicTacToe.MARK_NONE ? noOne : (cells[y][x] == this.mark ? me : enemy);

      who.all.push({x: x, y: y});

      x + y == 0 || x + y == 4 || (x + y == 2 && (x ? !y : y)) ? who.corner.push({x: x, y: y}) : false;
      x + y == 1 || x + y == 3 ? who.side.push({x: x, y: y}) : false;
      y == x && x == 1 ? who.middle.push({x: x, y: y}) : false;

      who.count['x' + x].push({x: x, y: y});
      who.count['y' + y].push({x: x, y: y});
      y == x ? who.count.d1.push({x: x, y: y}) : false;
      y + x == 2 ? who.count.d2.push({x: x, y: y}) : false;
    }
  }

  var maxY = board.fieldHeight - 1;
  var maxX = board.fieldWidth - 1;
  var max, where, aMove;

  // Правило - выигрыш
  max = maxProperty(me.count);
  if(max.maxLaneLength == 2) {
    // Есть две своих в ряд
    while((where = max.items.popRandom()) && !move) {
      if(noOne.count[where].length) {
        // Есть выигрышный ход!
        move = noOne.count[where].pop();
//console.log('win move = ' + JSON.stringify(move));
      }
    }
  }

  // Правило - блок
  if(!move) {
    max = maxProperty(enemy.count);
    if(max.maxLaneLength == 2) {
      // Есть две вражеских в ряд
      while((where = max.items.popRandom()) && !move) {
        if(noOne.count[where].length) {
          // Есть выигрышный ход!
          move = noOne.count[where].pop();
//console.log('block move = ' + JSON.stringify(move));
        }
      }
    }
  }

  // Правило - вилка // todo
  // Правило - недопущение вилки // todo

  // Правило - играть в центр, если не первый ход
  if(!move && board.cellsFree < board.cellsTotal && noOne.middle.length) {
    move = noOne.middle.pop();
//console.log('middle move = ' + JSON.stringify(move));
  }

  // Правило - играть против угла оппонента, если только один угол занят. Иначе - нам любой угол оппозитный
  if(!move && noOne.corner.length > 0 && enemy.corner.length == 1) {
    // Надо найти оппозитный угол
    aMove = {x: maxX - enemy.corner[0].x, y: maxY - enemy.corner[0].y};
    // Если он свободный - это наш ход
    if(board.getCellMark(aMove.y, aMove.x) == TicTacToe.MARK_NONE) {
      move = aMove;
//console.log('opposite corner move = ' + JSON.stringify(move));
    }
  }

  // Правило - играть любой свободный угол
  if(!move && noOne.corner.length > 0) {
    move = noOne.corner.popRandom();
//console.log('simple corner move = ' + JSON.stringify(move));
  }

  // Правило - играть любую свободную сторону
  if(!move && noOne.side.length > 0) {
    move = noOne.side.popRandom();
//console.log('simple side move = ' + JSON.stringify(move));
  }

  if(!move) {
    alert('Невозможная ошибка - нет хода!');
  }

  move = $.extend(move, {mark: this.mark});

  this._gameRound.makeMove(move);
};
