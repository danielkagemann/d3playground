/**
 * Created by danielkagemann on 15.12.16.
 */
(function (){
   'use strict';

   var width = 800,
      height = 300;

   // make svg container
   var svg = d3.select('.chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

   // make rects
   var json = [{days: 10, start: 10}, {days: 2, start: 60}];

   var dayScale = d3.scaleLinear()
      .domain([0, 365]).range([0, width]);

   svg.selectAll('rect')
      .data(json)
      .enter()
      .append('rect')
      .attr('x', function (d){
         return dayScale(d.start);
      })
      .attr('y', 10)
      .attr('width', function (d){
         return dayScale(d.days);
      })
      .attr('height', 10)
      .style('fill', 'blue');

   // make bottom axis
   var axisScale = d3.scaleLinear()
      .domain([1,12])
      .range([0, width]);
   var xAxis = d3.axisBottom()
      .scale(axisScale);

   svg.append("g").call(xAxis);
})();