var h = window.innerHeight;
var w = window.innerWidth;

var gameOptions = {
  width: 700,
  height: 500,
  nEnemies: 10,
  enemySize: 10, //radius of one enemy
  playerSize: 6 //radius of player
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]), //TODO - fix so that no part of an enemy can be off the gameboard
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('body').append('svg').style({'width': gameOptions.width + 'px', 'height': gameOptions.height + 'px'}).attr('class', 'container');

var createEnemies = function() {
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var data = d3.range(10).map(function(d){ return {} });

var shuffle = function(sel){
  return sel.attr('transform', function(d){ //TODO - what do translate and transform mean? 
    d.x = Math.random() * w;
    d.y = Math.random() * h;
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

var enemies = gameBoard.selectAll('circle.enemy').data(data);

drag = d3.behavior.drag();
drag.on('drag', function(){
  player.attr({cx: d3.event.x, cy: d3.event.y });
});

var player = gameBoard.append('circle').attr('class', 'player')
  .attr({cx: gameOptions.width / 2, cy: gameOptions.height / 2, fill: 'blue', r: gameOptions.playerSize})
  .call(drag);

var render = function(newEnemyPositions){
  //UPDATE- match up all selected elements with newEnemyPositions data, based on each enemy id
  enemies.data(newEnemyPositions, function(d) {
    return d.id;
  });

  var tweenWithCollisionDetection = function(endData) {
    var enemy = d3.select(this);
    var startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };
    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };
    return function(t) {
      var enemyNextPos;
      // checkCollision(enemy, onCollision);
      var enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };

  var checkCollision = function(enemy) {
    var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.attr('r'))
    var x = parseFloat(enemy.attr('cx')) - player.attr('cx');
    var y = parseFloat(enemy.attr('cy')) - player.attr('cy');
    var separation = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // console.log('separation ' + separation);

    if (separation < radiusSum){
      return onCollision();
    }
  };

  var onCollision = function() {
    console.log('collision');
    // updateBestScore();
    // gameStats.score = 0;
    // return updateScore();
  };

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

  return enemies.transition().duration(1000).attr('r', 10).transition().duration(1000).tween('custom', tweenWithCollisionDetection);
};

d3.timer(function(t){
  var px = player.attr('cx');
  var py = player.attr('cy');
  var collision = false;
  enemies.each(function(d, i){
    var ex = d.x;
    var ey = d.y;
    var x = ex - px;
    var y = ey - py;
    var d = Math.sqrt(x * x + y * y);
    if(d < playerSize + enemySize) collision = true;
  });
  console.log(collision);
});

var play = function() {
  var gameTurn, increaseScore;
  var gameTurn = function() {
    var newEnemyPositions;
    newEnemyPositions = createEnemies();
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
