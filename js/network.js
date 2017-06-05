var network;

(function(){
	// class Network
	function Network(){
		this.searchOnServer = false;
		this.urlServer;
		this.cannotFindServerError = 'impossible de récupérer les données du serveur (vérifiez votre connexion internet)';
		this.errorOnServerError = 'une erreur s\'est produite sur le serveur';
	}
	
	Network.prototype = {
		searchDrivers : function(httpService, mapManager){
			if(this.searchOnServer){
				this.doGetRequest(httpService, urlServer + 'getBarCodePositions', function(jsonData){
					mapManager.updateMarkers(jsonData);
				});
			} else {
				var markersData = [
					{imgPath: "img/macdo.png", lat: 48.866667, lng: 2.333333},
					{imgPath : "img/decathlon.png", position : {lat: 48.85, lng: 2.39}}
				];
				mapManager.updateMarkers(markersData);
			}
		},
		
		doGetRequest : function(httpService, url, successCb){
			httpService.get(url)
				.success(function(data) {
					this.treatResponse(data, successCb);
				})
				.error(function(error) {
					this.treatError(error, this.cannotFindServerError);
				});
		},
		doPostRequest : function(httpService, variables, url, successCb){
			httpService.post(url, variables)
				.success(function(data) {
					this.treatResponse(data, successCb);
				})
				.error(function(error) {
					this.treatError(error, this.cannotFindServerError);
				});
		},
		treatResponse : function(response, successCb){
			var jsonData;
			try {
				jsonData = JSON.parse(data);
			} catch(error){
				this.treatError(error, this.errorOnServerError);
			}
			successCb(JSON.parse(data))
		},
		treatError : function(initialError, errorMsg){
			alert(errorMsg);
		}
	}
	
	network = new Network();
})();