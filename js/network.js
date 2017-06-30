var network;

(function(){
	// class Network
	function Network(){
		this.searchOnServer = true;
		this.urlServer = 'http://localhost:8080/stickMeNow_back';
		this.cannotFindServerError = 'impossible de récupérer les données du serveur (vérifiez votre connexion internet)';
		this.errorOnServerError = 'une erreur s\'est produite sur le serveur';
	}
	
	Network.prototype = {
		searchDrivers : function(httpService, mapManager){
			if(this.searchOnServer){
				this.doGetRequest(httpService, this.urlServer + '/getBarCodePositions', function(driversData){
					mapManager.updateMarkers(driversData);
				});
			} else {
				var markersData = [
					{imgPath: "img/macdo.png", lat: 48.866667, lng: 2.333333},
					{imgPath : "img/decathlon.png", lat: 48.85, lng: 2.39}
				];
				mapManager.updateMarkers(markersData);
			}
		},
		searchPoints : function(httpService, cb){
			if(this.searchOnServer){
				this.doGetRequest(httpService, this.urlServer + '/getPoints', function(points){
					cb(points);
				});
			} else {
				var points = 12;
				setTimeout(function(){
					cb(points);
				}, 1000);
			}
		},
		searchUserData : function(httpService, cb){
			if(this.searchOnServer){
				this.doGetRequest(httpService, this.urlServer + '/getUserData', function(userData){
					cb(userData);
				});
			} else {
				var userData = {email : 'pierre.mulsant@hotmail.fr', address : '11 rue George Bernard Shaw'};
				setTimeout(function(){
					cb(userData);
				}, 1000);
			}
		},
		postCouponRequest : function($http, $state,$scope){
			if(this.searchOnServer){
				this.doPostRequest($http, {email : $scope.email, address : $scope.address, points : $scope.points, companyId : $scope.id},
					this.urlServer + '/postCouponRequest', function(response){
						if(response == true){
							$state.go('map');
							alert('Vous allez recevoir d\'ici deux jours un coupon de réduction de ' + $scope.points + ' euros');
						} else {
							alert('Votre nombre de point est insuffisant');
						}
						$scope.disableReceive = false;
					}, function(error){
						$scope.disableReceive = false;
					});
			} else {
				setTimeout(function(){
					$scope.disableReceive = false;
					$state.go('map');
					alert('Vous allez recevoir d\'ici deux jours un coupon de réduction de ' + $scope.points + ' euros');
				}, 3000);
			}
		},
		sendScan : function($http, barCode){
			if(this.searchOnServer){
				this.doPostRequest($http, {barCode : barCode},
					this.urlServer + '/postScanRequest', function(response){
						if(response == true){
							alert('Vous avez scannez la publicité');
						} else {
							alert('Code barre incorrect');
						}
					});
			} else {
				setTimeout(function(){
					alert('Vous avez scannez la publicité');
				}, 1000);
			}
		},
		
		doGetRequest : function(httpService, url, successCb, errorCb){
			var self = this;
			httpService = httpService || $;
			httpService.get(url)
				.success(function(data) {
					self.treatResponse(data, successCb);
				})
				.error(function(error) {
					console.log('error : ' + error);
					self.treatError(error, self.cannotFindServerError, errorCb);
				});
		},
		doPostRequest : function(httpService, variables, url, successCb, errorCb){
			var self = this;
			httpService = httpService || $;
			console.log(httpService + ', ' + url + ', ' + variables);
			httpService.post(url, variables)
				.success(function(data) {
					self.treatResponse(data, successCb);
				})
				.error(function(error) {
					console.log('error : ' + error);
					self.treatError(error, self.cannotFindServerError, errorCb);
				});
		},
		treatResponse : function(data, successCb){
			var jsonData = null;
			try {
				jsonData = typeof(data) == "object" ? data : JSON.parse(data);
			} catch(error){
				this.treatError(error, this.errorOnServerError);
			}
			if(jsonData != null){
				successCb(jsonData);
			}
		},
		treatError : function(initialError, errorMsg, errorCb){
			if(errorCb != null && errorCb != undefined){
				errorCb(initialError);
			}
			alert(errorMsg);
		}
	}
	
	network = new Network();
})();