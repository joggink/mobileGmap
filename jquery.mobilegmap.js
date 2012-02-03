/**
 * jQuery Mobile Google maps
 * @Author: Jochen Vandendriessche <jochen@builtbyrobot.com>
 * @Author URI: http://builtbyrobot.com
 *
 * @TODO:
 * - fix https image requests
**/

(function($){
	"use strict";

	var methods = {
		init : function(config) {
			var options = $.extend({
				deviceWidth: 480,
				showMarker: true,
			}, config),
			settings = {},
			markers = [];
			// we'll use the width of the device, because we stopped browsersniffing
			// a long time ago. Anyway, we want to target _every_ small display
			var _o = $(this); // store the jqyuery object once
			// iframe?
			//<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.be/maps?f=q&amp;source=s_q&amp;hl=nl&amp;geocode=&amp;q=Brugse+Heirweg+37,+aartrijke&amp;aq=&amp;sll=51.122175,3.086483&amp;sspn=0.009253,0.021651&amp;vpsrc=0&amp;ie=UTF8&amp;hq=&amp;hnear=Brugse+Heirweg+37,+8211+Zedelgem,+West-Vlaanderen,+Vlaams+Gewest&amp;t=m&amp;z=14&amp;ll=51.122175,3.086483&amp;output=embed"></iframe>
			options.imgURI = 'http://maps.googleapis.com/maps/api/staticmap?';
			settings.center = 'Brussels Belgium';
			settings.zoom = '5';
			settings.size = screen.width + 'x' +  480;
			settings.scale = window.devicePixelRatio ? window.devicePixelRatio : 1;
			settings.maptype = 'roadmap';
			settings.sensor = false;
			options.settings = settings;

			if ($(this).attr('data-center')){
				options.settings.center = $(this).attr('data-center').replace(/ /gi, '+');
			}
			if ($(this).attr('data-zoom')){
				options.settings.zoom = parseInt($(this).attr('data-zoom'));
			}
			if ($(this).attr('data-maptype')){
				options.settings.zoom = $(this).attr('data-maptype');
			}
			
			// if there should be more markers _with_ text an ul.markers element should be used so
			// we can store all markers :-) (marker specific settings will be added later)
			if (options.showMarker){
				markers.push({
					label: 'A',
					position: settings.center
				});
			}
			options.markers = markers;
			$(this).data('options', options);
			
			if (screen.width < options.deviceWidth){
				$(this).mobileGmap('showImage');
			}else{
				$(this).mobileGmap('showMap');
			}
			
		},
		
		showMap : function(){
			var options = $(this).data('options'),
					geocoder = new google.maps.Geocoder(),
					latlng = new google.maps.LatLng(-34.397, 150.644),
					mapOptions = {},
					htmlObj = $(this).get(0);
					geocoder.geocode( { 'address': options.settings.center.replace(/\+/gi, ' ')}, function(results, status) {
					      if (status == google.maps.GeocoderStatus.OK) {
					        // map.setCenter(results[0].geometry.location);
					        mapOptions = {
										zoom: parseInt(options.settings.zoom, 10),
										center: results[0].geometry.location,
										mapTypeId: options.settings.maptype
									}
									var map = new google.maps.Map(htmlObj, mapOptions);
									var marker = new google.maps.Marker({
									            map: map,
									            position: results[0].geometry.location
									        });
					      }
					    });
		},
		
		showImage : function(){
			var par = [],
					r = new Image(),
					l = document.createElement('a'),
					options = $(this).data('options'),
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
							t.push(options.markers[i][j]);
						}else{
							t.push(j + ':' + options.markers[i][j]);
						}
					}
					m.push('&markers=' + t.join('%7C'));
				}
			}
			r.src =  options.imgURI + par.join('&') + m.join('');
			l.href = 'http://maps.google.com/maps?q=' + options.settings.center;
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
