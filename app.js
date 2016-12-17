/**
 * Created by danielkagemann on 15.12.16.
 */
(function (){
   'use strict';

   // data and conversion
   var data = [
      {name: "location a",
         begin:"2016-12-01",
         end:"2016-12-20"},
      {name: "location b",
         begin:"2016-10-21",
         end:"2016-11-05"},
      {name: "location c",
         begin:"2015-08-30",
         end:"2015-09-13"}
   ], years = {},
      colors = ['#232D3F','#DAE2F2','#959FE5','#A0BDE5','#7EA4E5','#AFA2F2','#85C4F2','#558091','#0E3B43','#196072','#331E36','#41337A'], colhash = {}, colindex = 0;

   function $get(begin, end){
      var month= [31, 28, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31];
      var now = new Date(begin);
      var pos = 0;
      for (var i = 0; i < now.getMonth(); i++) {
         pos += month[i];
      }
      pos += now.getDate();

      var diff = new Date(end).getTime() - now.getTime();
      diff /= 86400000;
      diff = parseInt(diff,10) +1;
      return {start: pos, days: diff};
   }

   function $prepareData() {
      // convert the data to dictionary
      data.forEach(function(item) {
         var year = new Date(item.begin).getFullYear();
         var d = $get(item.begin, item.end);
         item.days  =d.days;
         item.start=d.start;
         years[year] = 0;

         if (colhash[item.name] === undefined) {
            colhash[item.name] = colors[colindex];
            colindex++;
            if (colindex >= colors.length) {
               colindex=0;
            }
         }
         item.color = colhash[item.name];
      });

      // put years in array and sort
      years = Object.keys(years);
      years.sort();
   }

   $prepareData();

   // make graph
   var margin = {top: 10, right: 10, bottom: 20, left: 80},
      barheight = 50,
      width = 800 - margin.left - margin.right,
      height = (years.length*barheight)- margin.top - margin.bottom;

   // make scale helper
   var dayScale = d3.scale.linear()
      .domain([0, 365]).range([0, width]);
   var yearScale = d3.scale.ordinal().domain(years).rangeRoundBands([
      height ,0], .1);

   // define the div for the tooltip
   var tooltip = d3.select(".chart").append("div")
      .attr("class", "tooltip")
      .style("display", 'none');

   // create svg container
   var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // y-axis
   var yAxis = d3.svg.axis()
      .scale(yearScale)
      .orient("left").tickSize(0);

   // x-axis
   var x = d3.time.scale()
      .domain([new Date(2016, 0, 1), new Date(2016, 11, 31)])
      .range([0, width]);

   var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.months)
      .tickSize(6, 0)
      .tickFormat(d3.time.format("%B"));

   // draw axes
   svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll(".tick text")
      .style("text-anchor", "start")
      .attr("x", 4)
      .attr("y", 4);
   svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("x", -10)
      .attr("y", 0);

   // draw the data
   svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function (d){
         return dayScale(d.start);
      })
      .attr('y', function (d) {
         var n = new Date(d.begin).getFullYear() + "";
         return yearScale(n);
      })
      .attr('width', function (d){
         return dayScale(d.days);
      })
      .attr('height', barheight/2)
      .style('fill', function(d) {
         return d.color;
      })
      .attr('stroke-width', 1)
      .attr('stroke', '#000')
      .on("mouseover", function(d) {
         tooltip.transition()
            .duration(200)
            .style("display", 'block');
         tooltip.html("<strong>" + d.name + "</strong><br/>" + d.duration +  " Tage");
            //.style("left", (d3.event.pageX) + "px")
            //.style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(d) {
         tooltip.transition()
            .duration(300)
            .style("display", 'none');
      });

})();