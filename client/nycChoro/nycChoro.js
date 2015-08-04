app.config(function($stateProvider){
    $stateProvider.state('nyc', {
        url: '/nyc',
        templateUrl: 'nycChoro/nycChoro.html',
        controller: 'nycCtrl'
    });
});

app.controller('nycCtrl', function($scope){

});