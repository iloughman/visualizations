app.directive('usAnimate', function(d3) {
	return {
		restrict: 'E',
		template: '<svg></svg>',
		link: function(scope, elem, attr) {
			var width = 960;
			var height = 500;

			var svg = d3.select("svg")
				.attr("width", width)
				.attr("height", height)

			var projectionType = d3.geo.albersUsa()

			var path = d3.geo.path()
						.projection(projectionType)

			var colors = ['#B2D8CD','#80B9A8','#FFFFFF','#549A85','#2F7D65','#8FCE9A']

			d3.json('/usAnimate/states.json', function(err,states){
				console.log(states)
				
				var mapPath = svg.selectAll('path')
					.data(states.features)
					.enter().append('path')
					.attr('d', function(d){
						return path(d)
					})

				//stuff for animations

			    mapPath.transition()
			        .duration(10000)
			        .attrTween("stroke-dasharray", tweenDash)
			        .each('end', function(){
			        	mapPath.transition()
			        	.duration(5000)
			        		.style('fill', function(d){
			        			return colors[Math.floor(Math.random()*6)]
			        		})
			        })


				// Using the stroke-dasharry attribute
				function tweenDash() {
				    return function(t) {
				        var l = mapPath.node().getTotalLength(); 
				        interpolate = d3.interpolateString("0," + l, l + "," + l); 
				        return interpolate(t);
				    }
				} 
			})
		}
	}
})