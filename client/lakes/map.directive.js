app.directive('lakeMap', function(d3){
	return {
		restrict: 'E',
		template: '<svg id="cali"></svg>',
		scope: {
			selected: '=selected',
			lakeInfo: '=lakeInfo',
			caBoundaries: '=caBoundaries'
		},
		link: function(scope, elem, attr){

			var width = 480;
			var height = 480;

			var svg = d3.select("svg#cali")
				.attr("width", width)
				.attr("height", height)

			var projection = d3.geo.mercator()
					.center([-122.4167,37.7833])
					.scale(1700)
					.translate([220,240])

			var path = d3.geo.path()
						.projection(projection)

			var mapPath = svg.selectAll('path')
				.data(scope.caBoundaries.features)
				.enter().append('path')
				.attr('d', path)
				.attr('class', 'ca')

			var lakeCircles = svg.selectAll('circle')
				.data(scope.lakeInfo)
				.enter().append('circle')
				.attr('class',function(d){
					return d.id;
				})
				.attr('cx', function(d) {
					return projection([+d.longitude,+d.latitude])[0]})
				.attr('cy', function(d) {
					return projection([+d.longitude,+d.latitude])[1]})
				.attr('r', '2px')
			
			function transition(update){
				lakeCircles.transition()
					.ease('linear')
					.duration(2000)
					.attr('r', function(d, i){
						// console.log("update",update['value'+(i+1)])
						// console.log(d.id)
						if (update['value'+(i+1)] === d.id){
							return '7px';
						} else {
							return '2px';
						}
					})
			}

			scope.$watch('selected', function(newValue, oldValue){
				transition(newValue);
			}, true);	

		}
	}
})