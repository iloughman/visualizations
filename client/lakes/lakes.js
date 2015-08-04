app.config(function($stateProvider){
	$stateProvider.state('lakes', {
		url: '/lakes',
		templateUrl: 'lakes/lakes.html',
		controller: 'lakesCtrl',
		resolve: {
			lakeData : function(DataService){
				return DataService.getData()
			} 
		}
	});
});

app.factory('DataService', function($q,d3){
	var factory = {};
	factory.getData = function(){
		var dfd = $q.defer()
		d3.csv('/lakes/capacities2.csv', function(err0,capacities){
			d3.json('/lakes/CA_counties.json', function(err1,caBoundaries){
				d3.csv('/lakes/sixlakes.csv', function(err2,lakeInfo){
					dfd.resolve({
						capacities : capacities,
						caBoundaries : caBoundaries,
						lakeInfo : lakeInfo
					})
				})
			})
		})
		return dfd.promise
	}
	return factory;
});

app.controller('lakesCtrl', function($scope,lakeData){
	console.log("lakeData", lakeData)
	$scope.lakeData = lakeData.capacities;
	$scope.caBoundaries = lakeData.caBoundaries;
	$scope.lakeInfo = lakeData.lakeInfo
	$scope.lakeNames = {
       value1 : false,
       value2 : 'CSI',
       value3 : false,
       value4 : false,
       value5 : false,
       value6 : false
     };
});