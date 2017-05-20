var server = false;

var app = angular.module('starter', ['ionic', 'ngCordova'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
           
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('map', {
                url: '/map',
                templateUrl: 'templates/map.html',
                controller: 'MapController'
            }).state('discounts', {
				url: '/discounts',
                templateUrl: 'templates/discounts.html',
                controller: 'DiscountsController'
			}).state('discount', {
				url: '/discount/:id',
                templateUrl: 'templates/discount.html',
                controller: 'DiscountController'
			}).state('parameters',{
                 url: '/parameters',
                templateUrl: 'templates/parameters.html',
                controller: 'ParametersController'
            });
        $urlRouterProvider.otherwise('/map');
    });
app.controller('MapController', function($scope, $http){
	if(window.google != undefined) {
		mapManager.handleMarkers();
	}
});
app.controller('DiscountsController', function($scope, $http){
	$scope.points = 10;
	$scope.discounts = [
		{id : 0, name : 'Adidas', src : 'img/adidas.png'},
		{id : 1, name : 'Nike', src : 'img/nike.png'},
		{id : 2, name : 'Macdo', src : 'img/macdo.png'},
		{id : 3, name : 'Decathlon', src : 'img/decathlon.png'},
		{id : 4, name : 'Sushishop', src : 'img/sushishop.jpg'}
	];
});
app.controller('DiscountController', function($scope, $stateParams, $http){
	$scope.id = $stateParams.id;
});
app.controller('headerController', function($scope, $cordovaCamera, $cordovaBarcodeScanner, $ionicPlatform){
	$scope.connected = true;
	$scope.takeImage = function(){
		try {
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        alert(result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                    }, function(error) {
                        // An error occurred
                        alert('Error: ' + error);
                    });
            });
		} catch(err){
			alert('err:' + err);
		}
    };
});
app.controller('ParametersController', function($scope, $stateParams, $http){
   
});
app.run(function($rootScope){
	$rootScope.$on("$includeContentLoaded", function(event, templateName){
		if(templateName == 'header.html'){
			setTimeout(initHeader, 300);
		}
	});
});