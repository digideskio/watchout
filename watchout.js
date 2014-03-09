(function(){
  var Player, axes, createEnemies, gameBoard, gameOptions, gameStats, play, players, render, updateBestScore, updateScore,
    __bind

  __bind = function(fn, context){
    return function(){
      fn.apply(context, arguments);
    }
  };

  gameOptions = {
    width: 450,
    height: 700,
    nEnemies: 10,
    enemySize: 10, //radius of one enemy
    personSize: 4 //radius of player
  };

  axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]), //TODO - fix so that no part of an enemy can be off the gameboard
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
  };

  gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);

  randomCircle = gameBoard.append('svg:circle').attr('r', 10).attr('fill', 'red').attr('cx', gameOptions.width/2).attr('cy', gameOptions.height/2);

  Player = (function() {

    Player.prototype.x = 0;

    Player.prototype.y = 0;

    Player.prototype.r = gameOptions.personSize;

    Player.prototype.fill = 'blue';

    function Player(gameOptions) {
      this.setupDragging = __bind(this.setupDragging, this);
      this.moveRelative = __bind(this.moveRelative, this);
      this.moveAbsolute = __bind(this.moveAbsolute, this);
      this.transform = __bind(this.transform, this);
      this.setY = __bind(this.setY, this);
      this.getY = __bind(this.getY, this);
      this.setX = __bind(this.setX, this);
      this.getX = __bind(this.getX, this);
      this.render = __bind(this.render, this);      
      this.gameOptions = gameOptions;
    }

    Player.prototype.render = function(to) {
      this.el = to.append('svg:circle').attr('class', 'player').attr('fill', this.fill);
      this.transform({
        x: this.gameOptions.width * 0.5,
        y: this.gameOptions.height * 0.5
      });
      this.setupDragging();
      return this;
    };

    Player.prototype.getX = function() {
      return this.x;
    };

    Player.prototype.setX = function(x) {
      var maxX, minX;
      minX = this.gameOptions.padding;
      maxX = this.gameOptions.width - this.gameOptions.padding;
      if (x <= minX) x = minX;
      if (x >= maxX) x = maxX;
      return this.x = x;
    };

    Player.prototype.getY = function() {
      return this.y;
    };

    Player.prototype.setY = function(y) {
      var maxY, minY;
      minY = this.gameOptions.padding;
      maxY = this.gameOptions.height - this.gameOptions.padding;
      if (y <= minY) y = minY;
      if (y >= maxY) y = maxY;
      return this.y = y;
    };

    Player.prototype.transform = function(opts) {
      this.angle = opts.angle || this.angle;
      this.setX(opts.x || this.x);
      this.setY(opts.y || this.y);
      return this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
    };

    Player.prototype.moveAbsolute = function(x, y) {
      return this.transform({
        x: x,
        y: y
      });
    };

    Player.prototype.moveRelative = function(dx, dy) {
      return this.transform({
        x: this.getX() + dx,
        y: this.getY() + dy,
        angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
      });
    };

    Player.prototype.setupDragging = function() {
      var drag, dragMove,
        _this = this;
      dragMove = function() {
        return _this.moveRelative(d3.event.dx, d3.event.dy);
      };
      drag = d3.behavior.drag().on('drag', dragMove);
      return this.el.call(drag);
    };

    return Player;

  })();


  players = [];

  players.push(new Player(gameOptions).render(gameBoard));

  tweenWithCollisionDetection = function(endData) { //TODO - where is endData coming from? 
      var endPos, enemy, startPos;//
      enemy = d3.select(this);
      startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };
      endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };
      return function(t) {
        var enemyNextPos;
        // checkCollision(enemy, onCollision);
        enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
      };
    };

  render = function(newEnemyPositions){
    //UPDATE- match up all selected elements with newEnemyPositions data, based on each enemy id
    var enemies = gameBoard.selectAll('circle.enemy').data(newEnemyPositions, function(d) {
      return d.id;
    });

    //ENTER- when initializing the app
    enemies.enter().append('svg:circle').attr('class', 'enemy').attr('cx', function(enemy) {
      return axes.x(enemy.x);
    }).attr('cy', function(enemy) {
      return axes.y(enemy.y);
    }).attr('r', function(enemy) {
      return gameOptions.enemySize;
    });

    //REMOVE - not needed? 
    enemies.exit().remove();

    return enemies.transition().duration(500).attr('r', 10).transition().duration(2000).tween('custom', tweenWithCollisionDetection); //todo- don't get this line
  };

  createEnemies = function() {
    return _.range(0, gameOptions.nEnemies).map(function(i) {
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    });
  };

  play = function() {
    var gameTurn, increaseScore;
    gameTurn = function() {
      var newEnemyPositions;
      newEnemyPositions = createEnemies();
      console.log(newEnemyPositions);
      return render(newEnemyPositions);
    };
    // increaseScore = function() {
    //   gameStats.score += 1;
    //   return updateScore();
    // };
    gameTurn();
    setInterval(gameTurn, 2000);
    // return setInterval(increaseScore, 50);
  };

  play();
}).call(this);