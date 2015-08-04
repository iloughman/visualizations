app.directive('barChart', function(d3){
	return {
		restrict: 'E',
		templateUrl: '/barCharts/barChart/barChart.html',
		link: function(scope, elem, attr){

			var margin = {top: 20, right: 20, bottom: 30, left: 40};
			var width = 600 - margin.left - margin.right;
			var height = 300 - margin.top - margin.bottom;

			 var svg = d3.select('svg.barChart')
			     .attr("width", width + margin.left + margin.right)
			     .attr("height", height + margin.top + margin.bottom)
			   .append("g")
			     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");       

			var dataset = d3.range(20).map(function(d){
			    return Math.floor(Math.random()*25)+5
			})

			var xScale = d3.scale.ordinal()
			                .domain(d3.range(dataset.length))
			                .rangeRoundBands([0, width], 0.3);

			var yScale = d3.scale.linear()
			                .domain([0, d3.max(dataset)])
			                .range([0, height]);
			
			svg.selectAll("rect")
			    .data(dataset)
			    .enter()
			    .append("rect")
			    .attr('class','bar')
			    .attr("x", function(d, i) {
			        return xScale(i); // Assigns x coordinate px position
			    })
			    .attr("y", function(d) {
			        return height - yScale(d);
			    })
			    .attr("width", xScale.rangeBand()) // Width = 
			    .attr("height", function(d) {
			        return yScale(d);
			    })
			    .attr("fill", function(d) {
			        return "rgb(0,"+(d*10)+", " + (d * 10) + ")";
			    });

			// Adding a dataset of the same size

			d3.select('button.same')
			    .on('click', function(){

			        dataset = dataset.map(function(d){
			            return Math.floor(Math.random()*25)+5
			        })

			        svg.selectAll('rect')
			            .data(dataset)
			            .transition()
			            .duration(2000)
			            .attr('y', function(d){
			                return height - yScale(d)
			            })
			            .attr('height', function(d){
			                return yScale(d)
			            })
			            .attr("fill", function(d) {
			                return "rgb(0, 0, " + (d * 10) + ")";
			            })
			    })

			// Adding a larger dataset

			d3.select('button.larger')
			    .on('click', function(){

			        dataset = dataset.map(function(d){return Math.floor(Math.random()*25)+5})

			        dataset.push(Math.floor(Math.random()*25)+5)

			        xScale.domain(d3.range(dataset.length))

			        var bars = svg.selectAll('rect')
			            .data(dataset)

			        bars.enter().append('rect')
			            .attr('x', width+margin.right)
			            .attr('y', function(d){
			                return height - yScale(d)
			            })
			            .attr('width', xScale.rangeBand())
			            .attr('height', function(d){
			                return yScale(d)
			            })
			            .attr('fill', function(d){
			                return "rgb(" + (d * 10) + ",0,0)"
			            })


			        bars.transition()
			            .duration(2000)
			            .attr('x', function(d,i){
			                return xScale(i)
			            })
			            .attr('y', function(d){
			                return height - yScale(d)
			            })
			            .attr('width', xScale.rangeBand())
			            .attr('height', function(d){
			                return yScale(d)
			            })
			            .attr('fill', function(d){
			                return "rgb(" + (d * 10) + ",0,0)"
			            })
			            
			    })
			

			d3.select('button.sort')
			    .on('click', function(){

			        svg.selectAll('rect')
			            .sort(function(a,b){return b-a})
			            .transition()
			            .delay(function(d,i){
			                return i*200;
			            })
			            .attr('x', function(d,i){
			                return xScale(i)
			            })
			    })
		}
	}
})