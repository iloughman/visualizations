app.directive('scrabbleChart', function(d3){
	return {
		restrict: 'E',
		templateUrl: '/barCharts/scrabbleChart/scrabbleChart.html',
		link: function(scope, elem, attr){

			var margin = {top: 20, right: 20, bottom: 40, left: 40};
			var width = 600 - margin.left - margin.right;
			var height = 300 - margin.top - margin.bottom;

			 var svg = d3.select('svg.scrabbleChart')
			     .attr("width", width + margin.left + margin.right)
			     .attr("height", height + margin.top + margin.bottom)
			   .append("g")
			     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var data = [{letter:'A',value:1},
			            {letter:'B',value:3},
			            {letter:'C', value:3},
			            {letter:'D', value:2},
			            {letter:'E', value:1},
			            {letter:'F', value:4},
			            {letter:'G', value:2},
			            {letter:'H', value:4},
			            {letter:'I', value:1},
			            {letter:'J', value:8},
			            {letter:'K', value:5},
			            {letter:'L', value:7},
			            {letter:'M', value:3},
			            {letter:'N', value:1},
			            {letter:'O', value:1},
			            {letter:'P', value:3},
			            {letter:'Q', value:10},
			            {letter:'R', value:1},
			            {letter:'S', value:1},
			            {letter:'T', value:1},
			            {letter:'U', value:1},
			            {letter:'V', value:4},
			            {letter:'W', value:4},
			            {letter:'X', value:8},
			            {letter:'Y', value:4},
			            {letter:'Z', value:10}]

			var xScale = d3.scale.ordinal()
			                .domain(d3.range(data.length))
			                .rangeRoundBands([0, width], 0.3);

			var yScale = d3.scale.linear()
			                .domain([0, d3.max(data)])
			                .range([0, height]);

			var xScale = d3.scale.ordinal()
			                .domain(data.map(function(d){return d.letter}))
			                .rangeRoundBands([0, width], 0.2)

			var yScale = d3.scale.linear()
			                .domain([0, d3.max(data,function(d){return d.value})])
			                .range([0,height])

			var xAxis = d3.svg.axis()
			        .scale(xScale)
			        .orient('bottom')
			
			svg.selectAll("rect")
			    .data(data)
			    .enter()
			    .append("rect")
			    .attr('class','bar')
			    .attr("x", function(d, i) {
			        return xScale(d.letter); // Assigns x coordinate px position
			    })
			    .attr("y", function(d) {
			        return height - yScale(d.value);
			    })
			    .attr("width", xScale.rangeBand()) // Width = 
			    .attr("height", function(d) {
			        return yScale(d.value);
			    })
			    .attr("fill", function(d) {
			        return "rgb(0,"+(d.value*30)+", " + (d.value * 50) + ")";
			    });

			svg.append('g')
			    .attr('class','x axis')
			    .attr('transform', 'translate(0,'+(height+10)+')')
			    .call(xAxis)
			
			// Create labels
			svg.selectAll("text")
			    .data(data)
			    .enter()
			    .append("text")
			    .text(function(d) {
			        return d;
			    })
			    .attr("text-anchor", "middle")
			    .attr("x", function(d, i) {
			        return xScale(i) + xScale.rangeBand() / 2;
			    })
			    .attr("y", function(d) {
			        return height - yScale(d) + 14;
			    })
			    .attr("font-family", "sans-serif")
			    .attr("font-size", "11px")
			    .attr("fill", "white");

			d3.select('button.sortScrabble')
			    .on('click', function(){
			    	sortData(function(a,b){return b.value-a.value})
			    })

			d3.select('button.revert')
				.on('click', function(){
					sortData(function(a,b){return a.letter.localeCompare(b.letter)})
				})

		    function sortData(comparator){
	    		xScale.domain(data.sort(comparator)
	    			.map(function(d){return d.letter}))

	    		svg.selectAll('rect')
	    		    .sort(comparator)
	    		    .transition()
	    		    .delay(function(d,i){
	    		        return i*50
	    		    })
	    		    .attr('x', function(d,i){
	    		        return xScale(d.letter)
	    		    })

	    		svg.select('.x.axis')
	    		    .transition()
	    		    .call(xAxis)
	    		    .selectAll('g')
	    		    .delay(function(d,i){
	    		        return i*50
	    		    })
		    }
		}
	}
})