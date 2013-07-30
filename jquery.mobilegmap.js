/**
	* jQuery Mobile Google maps
	* @Author: Jochen Vandendriessche <jochen@builtbyrobot.com>
	* @Author URI: http://builtbyrobot.com
	* @Author: Thomas Rickenbach <thomasrickenbach@gmail.com>
	*
	* markers can have all properties of google.maps.MarkerOptions
	* https://developers.google.com/maps/documentation/javascript/reference#Marker
	*
	* Options:
	* deviceWidth: maximum screen size for static image
	* center: Address where the map should be centered
	* zoom: initial zoom level
	* maptype:
	* markers: array of markers to be placed on the map.
	*	possible properties:    info: html that will be shown on marker click (Note: will not show on static image)
	*	                        showInfo: if the info window should be opened on load
	*
	* @TODO:
	* show info window on static map
	**/

(function($){
	"use strict";

	var allMarkers = [],
	methods = {
		init : function(config) {
			//Enable new design which is currently opt-in
			google.maps.visualRefresh = true;

			var options = $.extend({
				deviceWidth: 580,
				markers: []
			}, config),
			settings = {
				center: '',
				zoom: '5',
				size: screen.width + 'x' +  480,
				scale: window.devicePixelRatio ? window.devicePixelRatio : 1,
				maptype: 'roadmap',
				sensor: false
			};
			// we'll use the width of the device, because we stopped browsersniffing
			// a long time ago. Anyway, we want to target _every_ small display
			var $this = $(this); // store the jquery object once
			// iframe?
			//<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=nl&amp;geocode=&amp;q=Brugse+Heirweg+37,+aartrijke&amp;aq=&amp;sll=51.122175,3.086483&amp;sspn=0.009253,0.021651&amp;vpsrc=0&amp;ie=UTF8&amp;hq=&amp;hnear=Brugse+Heirweg+37,+8211+Zedelgem,+West-Vlaanderen,+Vlaams+Gewest&amp;t=m&amp;z=14&amp;ll=51.122175,3.086483&amp;output=embed"></iframe>
			options.imgURI = 'http://maps.googleapis.com/maps/api/staticmap?';
			options.settings = settings;

			options.settings.center = $this.attr('data-center') || options.settings.center;
			options.settings.zoom = $this.attr('data-zoom') || options.settings.zoom;
			options.settings.maptype = $this.attr('data-maptype') || options.settings.maptype;

			$this.data('options', options);

			if (screen.width < options.deviceWidth){
				$this.mobileGmap('showImage');
			}else{
				$this.mobileGmap('showMap');
			}

		},

		showMap : function(){
			var $this = $(this).addClass('gmap_map'),
				options = $this.data('options'),
			geocoder = new google.maps.Geocoder(),
			//latlng = new google.maps.LatLng(-34.397, 150.644),
			mapOptions = {},
			htmlObj = $this.get(0);
			geocoder.geocode( {
				'address': options.settings.center
				}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					//map.setCenter(results[0].geometry.location);
					mapOptions = {
						zoom: parseInt(options.settings.zoom, 10),
						center: results[0].geometry.location,
						mapTypeId: options.settings.maptype
					};
					var map = new google.maps.Map(htmlObj, mapOptions);
					var marker_options = {};
					if(options.markers.length) {
						for(var i=0;i < options.markers.length;i++) {
							marker_options = $.extend({
								map: map
							}, options.markers[i]);
							if(!marker_options.position || marker_options.position == 'center') {
								marker_options.position = results[0].geometry.location;
							}

							if(typeof marker_options.position !== 'object') {
								(function(geocoded_marker){
									geocoder.geocode( {
										'address' : geocoded_marker.position
									}, function(results, status) {
										if(status === google.maps.GeocoderStatus.OK) {
											geocoded_marker.position = results[0].geometry.location;
											methods._addMarker(geocoded_marker);
										}
									});
								})(marker_options);
							} else {
								methods._addMarker(marker_options);
							}
						}
					}
				}
			});
		},

		_addMarker : function(marker_options){
			var marker_info;
			if(marker_options.info) {
				marker_info = marker_options.info;
				delete marker_options.info;
			}
			var new_marker = new google.maps.Marker(marker_options);
			if(marker_info) {
				var infoWindow = new google.maps.InfoWindow({
					content:marker_info
				});
				google.maps.event.addListener(new_marker, 'click', function() {
					infoWindow.open(marker_options.map, new_marker);
				});
				if(marker_options.showInfo) {
					//Timeout needed so the infoWindow height automatically adjusts to the content
					window.setTimeout(function(){
						infoWindow.open(marker_options.map, new_marker);
					}, 100);
				}
			}
			allMarkers.push(new_marker);
		},

		showImage : function(){
			var $this = $(this).addClass('gmap_image'),
				par = [],
				r = new Image(),
				l = document.createElement('a'),
				options = $this.data('options'),
				i = 0,
				m = [];
			for (var o in options.settings){
				par.push(o + '=' + options.settings[o]);
			}
			if (options.markers.length){
				var t=[];
				for (;i < options.markers.length;i++){
					t = [];
					for (var j in options.markers[i]){
						if (j == 'position'){
							t.push((!options.markers[i][j] || options.markers[i][j] == 'center') ? options.settings.center : options.markers[i][j].replace(/ /gi, '+') );
						}else{
							t.push(j + ':' + options.markers[i][j]);
						}
					}
					m.push('&markers=' + t.join('%7C'));
				}
			}
			r.src =  options.imgURI + par.join('&') + m.join('');
			l.href = '//maps.google.com/maps?q=' + options.settings.center;
			l.appendChild(r);
			$(this).empty().append(l);
		}

	};

	$.fn.mobileGmap = function(method){
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.mobileGmap' );
		}
	};

})(this.jQuery);