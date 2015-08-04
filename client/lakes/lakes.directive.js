app.directive('lakes', function(d3){
	return {
		restrict: 'E',
		template: '<svg></svg>',
		scope: {
			data: '=lakeData',
			selected: '=selected'
		},
		link: function(scope, elem, attr){

			var capacities = {
				'CSI':254000, 
				'SHA':4552100, 
				'DMV':800000,
				'TAH':732000,
				'CRW':183200,
				'ATN':330000 
			};

			var parseDate = d3.time.format('%Y-%m').parse

			var match = function(code,table){
				var result=[];
				table.forEach(function(row, index){
					result.push({date: parseDate(row.date), capacity: Math.round(row[code]/capacities[code]*100)/100});
				})
				return result;
			}

			var match2 = function(code,table){
				var result={code: code, data: []};
				table.forEach(function(row, index){
					result.data.push({date: parseDate(row.date), capacity: Math.round(row[code]/capacities[code]*100)/100});
				})
				return result;
			}

			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			    width = 480 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			var svg = d3.select('svg')
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var xScale = d3.time.scale()
					.range([0, 400])
					.domain(d3.extent(scope.data, function(d){return parseDate(d.date)}))

			var yScale = d3.scale.linear()
					.domain([0,1])
					.range([height, 0])
			
			var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('bottom')

			var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient('left')

			var lineFunction = d3.svg.line()
					.x(function(d){return xScale(d.date)})
					.y(function(d){return yScale(d.capacity)})
					.interpolate('monotone')

			svg.append('g')
				.attr('class', 'y axis')
				.call(yAxis)

			svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,'+height+')')
				.call(xAxis)

			var pathGroup = svg.append('g')

			scope.$watch('selected', function(newValue, oldValue){
				var newData = [];
				for (var key in newValue){
					if (newValue.hasOwnProperty(key) && newValue[key]){
							newData.push(match2(newValue[key], scope.data))
					}
				}
				draw2(newData);
			}, true);

			function draw2(lakes){
				var lineFactory = function(d){
				    var map = d3.scale.quantile()
				                .domain([0,1])
				                .range(d3.range(1,d.data.length))

				    return function(t){
				        var lineSubset = d.data.slice(0,map(t))
				        return lineFunction(lineSubset)
				    }
				}

				var lakePath = pathGroup.selectAll('path')
					.data(lakes, function(d){return d.code})

				lakePath.exit().remove()
					
				lakePath.enter().append('path')
					.attr('class',function(d){
						return 'line '+d.code
					})
					.transition()
					.ease('linear')
					.duration(3000)
					.attrTween('d', lineFactory)
			}

		}
	}
})