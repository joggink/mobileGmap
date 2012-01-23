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
				deviceWidth: 480
			}, config);
			$(this).data('options', options);
			// we'll use the width of the device, because we stopped browsersniffing
			// a long time ago. Anyway, we want to target _every_ small display
			var _o = $(this); // store the jqyuery object once
			
			// get the parameters
			// data attributes where lat / long / address / zoomlevel / maptype / showmarker ... are stored
			// if there should be more markers _with_ text an ul.markers element should be used so
			// we can store all markers :-) (marker specific settings will be added later)
			
			if (screen.width > options.deviceWidth){
			}else{
			}
			
			$(this).mobileGmap('showImage');
			
		},
		
		showImage : function(){
			var img = 'http://maps.googleapis.com/maps/api/staticmap?',
					par = [],
					r = new Image();
			// get the center
			par.push('center=Brugse+Heirweg+37+Aartrijke,Belgium');
			par.push('zoom=10');
			par.push('size=768x480');
			par.push('scale=1');
			par.push('maptype=roadmap');
			par.push('sensor=false');
			r.src =  img + par.join('&');
			
			$(this).empty().append(r);
			
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
