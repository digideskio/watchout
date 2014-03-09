(function(){
  var Player, axes, createEnemies, drag, gameBoard, gameOptions, gameStats, play, player, render, updateBestScore, updateScore,
    __bind

  __bind = function(fn, context){
    return function(){
      fn.apply(context, arguments);
    }
  };

  gameOptions = {
    width: window.innerWidth * .5,
    height: window.innerHeight * .5,
    nEnemies: 10,
    enemySize: 10, //radius of one enemy
    playerSize: 4 //radius of player
  };

  axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]), //TODO - fix so that no part of an enemy can be off the gameboard
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
  };

  gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);

  drag = d3.behavior.drag();
  drag.on('drag', function(){
    player.attr({cx: d3.event.x, cy: d3.event.y });
  });

  player = gameBoard.append('circle').attr('class', 'player')
    .attr({cx: gameOptions.width / 2, cy: gameOptions.height / 2, fill: 'blue', r: gameOptions.playerSize})
    .call(drag);

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
      };
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