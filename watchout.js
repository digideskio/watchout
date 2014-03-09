var gameOptions = {
  width: 450,
  height: 700,
  nEnemies: 10,
  enemySize: 10 //radius of one enemy
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width - gameOptions.enemySize * 2]), //TODO - fix so that no part of an enemy can be off the gameboard
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height - gameOptions.enemySize * 2])
};

var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);

// var svgContainer = d3.select("svg"); //todo - trying to append svg to body results in "cannot call attr of null" error

//ENTER 

// var circleAttributes = circles
// // 24                       .attr("cx", function (d) { return d.cx; })
// // 25                       .attr("cy", function (d) { return d.cy; })
// // 26                       .attr("r", function (d) { return d.radius; })
// // 27                       .style("fill", function (d) { return d.color; });

var tweenWithCollisionDetection = function(endData) {
    var endPos, enemy, startPos;
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

var render = function(newEnemyPositions){
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

  return enemies.transition().duration(500).attr('r', 10).transition().duration(2000).tween('custom', tweenWithCollisionDetection); 
};

var createEnemies = function() {
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }
  });
};

var play = function() {
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