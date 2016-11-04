jQuery(document).ready(function($){

	// Гугл-карта
	!function initialize(){
		var mapEl = document.getElementById("map");
		if(!mapEl) return;
		var latlng = new google.maps.LatLng(50.619491, 26.280503);
		var settings = {
			zoom: 16,
			center: latlng,
			mapTypeControl: true,
			scrollwheel: false,
			mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			navigationControl: true,
			navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(mapEl, settings);
		var companyLogo = new google.maps.MarkerImage('images/map-point.png',
			new google.maps.Size(40,60),
			new google.maps.Point(0,0)
		);
		var companyPos = new google.maps.LatLng(50.619491, 26.280503);
		var companyMarker = new google.maps.Marker({
			position: companyPos,
			map: map,
			icon: companyLogo,
			title:"Автоматика"
		});
	}();

	$('.mainSlider, .quoteSlider').each(function(){
		var	blockClass 	= '.'+$(this).attr('class'),
				slider 			= $(this).find(blockClass+'__container');
		slider.slick({
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			prevArrow: $(blockClass+'__arrow--prev'),
			nextArrow: $(blockClass+'__arrow--next')
		});
	});
	$('.select2').select2({
		width: '100%',
		minimumResultsForSearch: Infinity,
	});
	
});