app.config(function($stateProvider){
    $stateProvider.state('bars', {
        url: '/bars',
        templateUrl: 'barCharts/barCharts.html',
        controller: 'barChartsCtrl'
    });
});

app.controller('barChartsCtrl', function($scope){

});