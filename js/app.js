var SEARCH_ON_SERVER = true;
var USE_CAMERA = false;

network.searchOnServer = SEARCH_ON_SERVER;

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
				cache: false,
				url: '/discounts',
                templateUrl: 'templates/discounts.html',
                controller: 'DiscountsController'
			}).state('discount', {
				cache: false,
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
		mapManager.handleMarkers($http);
	}
});
app.controller('DiscountsController', function($scope, $http){
	$scope.points = '...';
	network.searchPoints($http, function(points){
		$scope.points = points;
		$scope.$apply();
	});
	$scope.discounts = [
		{id : 0, name : 'Adidas', src : 'img/adidas.png'},
		{id : 1, name : 'Nike', src : 'img/nike.png'},
		{id : 2, name : 'Macdo', src : 'img/macdo.png'},
		{id : 3, name : 'Decathlon', src : 'img/decathlon.png'},
		{id : 4, name : 'Sushishop', src : 'img/sushishop.jpg'}
	];
});
app.controller('DiscountController', function($scope, $state, $stateParams, $http){
	$scope.id = $stateParams.id;
	$scope.disableReceive = false;
	$scope.email = '...';
	$scope.adress = '...';
	$scope.points = 0;
	$scope.sendRequest = function(){
		if(!$scope.disableReceive){
			$scope.disableReceive = true;
			console.log('click');
			if($scope.points <= 0){
				alert('Le nombre de points doit être positif');
				$scope.disableReceive = false;
				return;
			} if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.email)){
				alert('L\'email n\'a pas une forme correcte');
				$scope.disableReceive = false;
				return;
			}
			network.postCouponRequest($http, $state, $scope);
		}
	}
	network.searchUserData($http, function(userData){
		$scope.email = userData.email;
		$scope.address = userData.address;
		$scope.$apply();
	});
});
app.controller('headerController', function($scope, $http, $cordovaBarcodeScanner, $ionicPlatform){
	$scope.connected = true;
	$scope.takeImage = function(){
		if(USE_CAMERA){
			try {
				$ionicPlatform.ready(function() {
					$cordovaBarcodeScanner
						.scan()
						.then(function(result) {
							network.sendScan($http, result.text);
						}, function(error) {
							// An error occurred
							alert('Error: ' + error);
						});
				});
			} catch(err){
				alert('err:' + err);
			}
		} else {
			network.sendScan($http, 'ranas2');
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