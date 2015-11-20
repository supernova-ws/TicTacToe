var l = {};

var localStoragePresent = typeof(localStorage) !== "undefined";

var MARK_NONE = 0;
var MARK_X = 1;
var MARK_O = 2;
var PLAYER_UNDEFINED = 0;
var PLAYER_LOCAL = 1;
var PLAYER_COMPUTER = 2;

var WIN_VERTICAL = 0;
var WIN_HORIZONTAL = 1;
var WIN_DIAGONAL_MAIN = 2;
var WIN_DIAGONAL_SECONDARY = 3;

Math.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 *
 * @param {number} mark - Какой меткой инициализировать игрока
 * @param {?Player} otherPlayer - Опциональный параметр - кто уже есть
 * @constructor
 */
function Player(mark, otherPlayer) {
  this.type = !otherPlayer || !otherPlayer.type || otherPlayer.type == PLAYER_COMPUTER ? PLAYER_LOCAL : PLAYER_COMPUTER;
  this.mark = !otherPlayer || !otherPlayer.mark || otherPlayer.mark != mark ? mark : (otherPlayer.mark == MARK_X ? MARK_O : MARK_X);

  this.toString = function() {
    return JSON.stringify(this);
  };

  if(this.type == PLAYER_LOCAL) {
    this.waitForMove = function() {
      // TODO Allow player to move
    };

    this.checkMove = function(cell) {
      var game = window.round;
      var x = parseInt(cell.attr('x'));
      var y = parseInt(cell.attr('y'));

      if(game.gameField[y] && !game.gameField[y][x]) {
        sn_sound_play('other_moved');
        window.round.makeMove({x: x, y: y, mark: game.playerCurrent.mark});
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
      var gameField = window.round.gameField;
      var emptyCells = [];

      for(var y in gameField) {
        if(gameField.hasOwnProperty(y)) {
          for(var x in gameField[y]) {
            if(gameField[y].hasOwnProperty(x) && gameField[y][x] == MARK_NONE) {
              emptyCells.push({x: x, y: y});
            }
          }
        }
      }

      var cellIndex = Math.randomInt(0, emptyCells.length - 1);

      return $.extend(emptyCells[cellIndex], {mark: this.mark});
    }
  }
}

/**
 *
 * @param {!number} newPlayerX
 * @constructor
 */
function Game(newPlayerX) {
  if(localStoragePresent && localStorage.tictactoe) {
    $.extend(this, JSON.parse(localStorage.tictactoe));

    this.playerX = new Player(MARK_X, this.playerO);
    this.playerO = new Player(MARK_O, this.playerX);

    this.playerCurrent = this.playerCurrent == MARK_X ? this.playerX : this.playerO;
  } else {
    this.gameField = [];

    this.playerX = new Player(newPlayerX);
    this.playerO = new Player(newPlayerX == MARK_X ? MARK_O : MARK_X, this.playerX);

    this.playerCurrent = this.playerX;

    this.playerIsZero = 0;
  }

  this.localPlayer = this.playerX.type == PLAYER_LOCAL ? this.playerX : this.playerO;

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
          if(gameField[y].hasOwnProperty(x) && gameField[y][x] != MARK_NONE) {
            $('[x=' + x + '][y=' + y + ']').addClass(gameField[y][x] == MARK_X ? 'mark_x' : 'mark_o').attr('mark', gameField[y][x]);
          }
        }
      }
    }

    $('#mark_o').attr('checked', this.playerIsZero ? true : false);
  };

  this.makeMove = function(move) {
    if((move) && (move instanceof Object)) {
      this.gameField[move.y][move.x] == MARK_NONE ? this.fields-- : false;
      this.gameField[move.y][move.x] = move.mark;

      $('[x=' + move.x + '][y=' + move.y + ']').addClass(this.playerCurrent.mark == MARK_X ? 'mark_x' : 'mark_o').attr('mark', move.mark);

      var win = [0,0,0,0];
      for(var i = 0; i < 3; i++) {
        // Проверяем главную диагональ \
        move.x == move.y && this.gameField[i][i] == move.mark ? win[WIN_DIAGONAL_MAIN]++ : false;
        (move.x + move.y) == 2 && this.gameField[i][2 - i] == move.mark ? win[WIN_DIAGONAL_SECONDARY]++ : false;

        // Проверяем вертикаль
        this.gameField[i][move.x] == move.mark ? win[WIN_VERTICAL]++ : false;
        // Проверяем горизонталь
        this.gameField[move.y][i] == move.mark ? win[WIN_HORIZONTAL]++ : false;
      }

      var max = Math.max.apply(null, win);
      if(max == 3) {
        var winSelector = '';
        var winMethod = win.indexOf(max);
        switch(winMethod) {
          case WIN_VERTICAL:
            winSelector = '[x=' + move.x + ']';
            break;
          case WIN_HORIZONTAL:
            winSelector = '[y=' + move.y + ']';
            break;
          case WIN_DIAGONAL_MAIN:
            winSelector = '.diagonal_main';
            break;
          case WIN_DIAGONAL_SECONDARY:
            winSelector = '.diagonal_secondary';
            break;
        }
        $(winSelector).addClass('mark_win');

        // Звук победы
        sn_sound_play('win');

        alert(l.message_player_win[this.playerCurrent.type]);
        this.resetField();

        return;
      }

      if(this.fields <= 0) {
        sn_sound_play('game_over');
        alert(l.message_player_win[PLAYER_UNDEFINED]);
        this.resetField();
      } else {
        this.playerCurrent = this.playerCurrent.mark == MARK_X ? this.playerO : this.playerX;
        $('#game_message').text(l.message_player[this.playerCurrent.type]);

        if(localStoragePresent) {
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

    this.localPlayer = this.playerX.type == PLAYER_LOCAL ? this.playerX : this.playerO;
    this.playerCurrent = this.playerX;
    $('#game_message').text(l.message_player[this.playerCurrent.type]);

    if(localStoragePresent) {
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

    if(this.playerIsZero && this.playerO.type != PLAYER_LOCAL) {
      this.playerO = new Player(MARK_O);
      this.playerX = new Player(MARK_X, this.playerO);
    } else {
      this.playerX = new Player(MARK_X);
      this.playerO = new Player(MARK_O, this.playerX);
    }

    //console.log(this.toString());

    this.resetField();
  }
}

var round = new Game(PLAYER_LOCAL);

$(document).on('click', '.cell', function(){
  round.localPlayer.checkMove($(this));
});

$(document).on('change', '#mark_o', function(){
  round.changeSide($(this));
});

$(document).on('click', '#game_reset', function(){
  round.resetField();
});

$(document).ready(function() {
  round.renderStorage();
  round.playerCurrent.waitForMove();
});
