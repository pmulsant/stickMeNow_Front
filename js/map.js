var mapManager;

function initMap(){
	mapManager.handleMarkers();
}

(function(){
	// class MapManager
	function MapManager(network){
		this.network = network;
		
		this.map;
		this.updateMarkersPeriod = 10 * 1000;
		this.firstUpdate = true;
		this.searchOnServer = true;
		this.markers = [];
		this.markerWidth = 30;
		this.markerHeight = 30;
		this.zoom = 11;
		this.lat = 48.866667;
		this.lng = 2.333333;
	}
	
	MapManager.prototype = {
		handleMarkers : function(httpService){
			this.httpService = httpService;
			var self = this;
			this.initMap();
			this.updateMarkers();
			setInterval(function(){
				self.network.searchDrivers(self.httpService, self);
			}, this.updateMarkersPeriod);
		},
		initMap() {
			try {
				this.map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: this.lat, lng: this.lng},
					scrollwheel: false,
					zoom: this.zoom
				});
			} catch(err){}
		},
		/*updateMarkers : function(){
			var self = this;
			this.searchMarkersData(function(markersData){
				self.clearMarkers();
				for(var i in markersData){
					var markerData = markersData[i];
					self.addMarker(markerData.imgSrc, markerData.position);
				}
				self.firstUpdate = false;
			});
		},*/
		updateMarkers : function(markersData){
			this.clearMarkers();
			for(var i in markersData){
				var markerData = markersData[i];
				this.addMarker(markerData.imgPath, {lat : markerData.lat, lng : markerData.lng});
			}
			this.firstUpdate = false;
		},
		/*searchMarkersData : function(cb){
			if(this.searchOnServer){
				$http.get("http://www.google.fr", { params: { "key1": "value1", "key2": "value2" } })
				.success(function(data) {
					cb(data)
				})
				.error(function(data) {
					alert("Echec du chargement des positions des drivers");
				});
			} else {
				var markersData = [
					{imgSrc : "img/macdo.png", position : {lat: 48.866667, lng: 2.333333}},
					{imgSrc : "img/decathlon.png", position : {lat: 48.85, lng: 2.39}}
				];
				cb(markersData);
			}
		},*/
		clearMarkers : function(){
			for(var i in this.markers){
				this.markers[i].setMap(null);
			}
			this.markers = [];
		},
		addMarker : function(imgSrc, position){
			if(google)
			var pinIcon = new google.maps.MarkerImage(
				imgSrc, null, null, null,
				new google.maps.Size(this.markerWidth, this.markerHeight)
			);
			var marker;
			if(this.firstUpdate){
				marker = new google.maps.Marker({
					map: this.map,
					position: position,
					icon: pinIcon,
					animation: google.maps.Animation.DROP
				});
			} else {
				marker = new google.maps.Marker({
					map: this.map,
					position: position,
					icon: pinIcon
				});
			}
			this.markers.push(marker);
			marker.addListener('click', toggleBounce);
			
			function toggleBounce() {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			}
		}
	}
	
	mapManager = new MapManager(network);
})();