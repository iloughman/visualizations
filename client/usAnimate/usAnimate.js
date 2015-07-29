app.config(function($stateProvider){
	$stateProvider.state('us', {
		url: '/us',
		templateUrl: 'usAnimate/us.html',
		controller: 'usCtrl'
	});
});

app.controller('usCtrl', function($scope){

})