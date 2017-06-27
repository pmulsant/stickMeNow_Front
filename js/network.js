var network;

(function(){
	// class Network
	function Network(){
		this.searchOnServer = false;
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
		postCouponRequest : function($http, email, address, points){
			this.doPostRequest($http, {email : email, address : address, points : points},
				this.urlServer + '/postCouponRequest', function(response){
					console.log('response : ' + response);
				});
		},
		
		doGetRequest : function(httpService, url, successCb){
			var self = this;
			httpService = httpService || $;
			httpService.get(url)
				.success(function(data) {
					self.treatResponse(data, successCb);
				})
				.error(function(error) {
					console.log('error : ' + error);
					self.treatError(error, self.cannotFindServerError);
				});
		},
		doPostRequest : function(httpService, variables, url, successCb){
			var self = this;
			httpService = httpService || $;
			console.log(httpService + ', ' + url + ', ' + variables);
			httpService.post(url, variables)
				.success(function(data) {
					self.treatResponse(data, successCb);
				})
				.error(function(error) {
					console.log('error : ' + error);
					self.treatError(error, self.cannotFindServerError);
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
		treatError : function(initialError, errorMsg){
			alert(errorMsg);
		}
	}
	
	network = new Network();
})();