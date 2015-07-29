app.config(function($stateProvider){
	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'home/home.html',
		controller: 'homeCtrl'
	});
});

app.controller('homeCtrl', function($scope){

});