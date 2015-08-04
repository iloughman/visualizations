app.directive('nycChoro', function(d3){
	return {
		restrict: 'E',
		template: '<div id="map"></div><div class="toolTip"></div>',
		link: function(scope, elem, attr){
    		var map = new L.map('map').setView([40.65, -74.02], 10);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'iloughman.3bba33ff',
                accessToken: 'pk.eyJ1IjoiaWxvdWdobWFuIiwiYSI6IjIxZWQxMzZiMDQwNzI3NjA4ZjliNGFkODUyNjBmY2I1In0.O1Kh-G53p2NCKNqG3jTpEw'
            }).addTo(map);

            // Add SVG layer
            var svg = d3.select(map.getPanes().overlayPane).append("svg");
            var g = svg.append("g").attr("class", "leaflet-zoom-hide");

            // Projection Definitions
            function projectPoint(x, y) {
              var point = map.latLngToLayerPoint(new L.LatLng(y, x));
              this.stream.point(point.x, point.y);
            }

            var transform = d3.geo.transform({point: projectPoint});
            var path = d3.geo.path().projection(transform);

            // helper functions
            var parsePercent = function (str){
                return str.substring(0,str.length-1);
            }

            var parseDist = function (str){
                return +str.substring(str.length-3, str.length)
            }

            var toolTip = d3.select('div.toolTip')
                .html('School District: '+'<br>% Attendance: ')

            d3.json('/nycChoro/school_districts.geojson', function(err,nyc){
                d3.csv('/nycChoro/School_Attendance.csv')
                .row(function(d){return {district: d.District, att: d['YTD % Attendance (Avg)']}})
                .get(function(err,data){

                    data.forEach(function(row){
                        row.att = parsePercent(row.att);
                        row.district = parseDist(row.district)
                        nyc.features.forEach(function(feature){
                            if (feature.properties.SchoolDist === row.district){
                                feature.properties.att = row.att;
                            }
                        })
                    })

                    var quantize = d3.scale.quantize()
                        .domain([85,95])
                        .range(d3.range([10]).map(function(i) {return 'a'+i}))

                    var nycLayer = g.selectAll('path')
                        .data(nyc.features)
                        .enter().append('path')
                        .attr('d', path)
                        .attr('class', function(d){
                            return quantize(d.properties.att)
                        })
                        .on('mousemove', function(d){
                            var mouse = d3.mouse(g.node()); 

                            toolTip
                                .html('School District: '+d.properties.SchoolDist+'<br>% Attendance: '+d.properties.att)
                        })

                    map.on('viewreset', reset)
                    reset();

                    // Bounding
                    function reset() {
                        var bounds = path.bounds(nyc);
                        console.log(bounds)
                        var topLeft = bounds[0]; //[left,top]
                        var bottomRight = bounds[1]; //[right,bottom]

                        svg.attr("width", bottomRight[0] - topLeft[0])
                            .attr("height", bottomRight[1] - topLeft[1])
                            .style("left", topLeft[0] + "px")
                            .style("top", topLeft[1] + "px");

                        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                        nycLayer.attr('d',path)
                    }
                })      
            })
    	}
	}
})