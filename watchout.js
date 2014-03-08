var gameOptions = {
  width: 450,
  height: 700,
  nEnemies: 10
}
var enemyData = [{ "class": "enemy", "height": 25, "width": 50, "xlink:href": "asteroid.png" }];

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)

// var svgContainer = d3.select("svg"); //todo - trying to append svg to body results in "cannot call attr of null" error

var enemyGroup = gameBoard.append("g");
var enemies = enemyGroup.selectAll("enemy").data(enemyData).enter().append('enemyGroup');


// 10var svgContainer = d3.select("body").append("svg")
// 11                                     .attr("width",200)
// 12                                     .attr("height",200);
// 13
// 14//Add a group to hold the circles
// 15var circleGroup = svgContainer.append("g");
// 16
// 17//Add circles to the circleGroup
// 18var circles = circleGroup.selectAll("circle")
// 19                          .data(circleData)
// 20                          .enter()
// 21                          .append("circle");
// 22
// 23var circleAttributes = circles
// 24                       .attr("cx", function (d) { return d.cx; })
// 25                       .attr("cy", function (d) { return d.cy; })
// 26                       .attr("r", function (d) { return d.radius; })
// 27                       .style("fill", function (d) { return d.color; });
// 28
// 29// * Note * that the rectangles are added to the svgContainer, not the circleGroup
// 30var rectangles = svgContainer.selectAll("rect")
// 31                              .data(rectangleData)
// 32                              .enter()
// 33                              .append("rect");
// 34
// 35var rectangleAttributes = rectangles
// 36                          .attr("x", function (d) { return d.rx; })
// 37                          .attr("y", function (d) { return d.ry; })
// 38                          .attr("height", function (d) { return d.height; })
// 39                          .attr("width", function (d) { return d.width; })
// 40                          .style("fill", function(d) { return d.color; });
