;(function ($, export) {
    'use strict';

    var GoogleMap = {
        settings: {
            scrollwheel: false,
            draggable: false
        },
        init: function (options) {
            var context = this;
            var $container = $(options.container);
            var $window = $(window);
            
            this.options = $.extend(this.settings, options);

            this.options.coord.lat = parseFloat(options.coord.lat);
            this.options.coord.lng = parseFloat(options.coord.lng);
            this.options.zoom = parseInt(options.zoom);

            $window.on("scroll.googleMap", function () {
                if ($window.scrollTop() + $window.height() >  $container.offset().top) {
                    $.getScript("http://maps.google.com/maps/api/js?v=3&key=" + context.options.apiKey + "&callback=GoogleMap.apiLoaded&sensor=false");
                    $window.off("load.googleMap scroll.googleMap");
                }
            }).trigger("scroll.googleMap");
        },
        apiLoaded: function () {
            if (typeof google !== "object") {
                return;
            }

            var context = this;

            var googleMap = new google.maps.Map(document.querySelector(context.options.container), {
                center: context.options.coord,
                zoom: context.options.zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: context.options.draggable,
                scrollwheel: context.options.scrollwheel
            });

            new google.maps.Marker({
                position: context.options.coord,
                map: googleMap,
                title: context.options.title,
                icon: context.options.icon
            });

            var center = googleMap.getCenter();
            GoogleMap.moveMaker(googleMap);

            google.maps.event.trigger(googleMap, 'resize');

            google.maps.event.addDomListener(window, 'resize', function() {
                google.maps.event.trigger(googleMap, 'resize');
                googleMap.setCenter(center);
                GoogleMap.moveMaker(googleMap);
            });


            $(context.options.container).click(function() {
                googleMap.setOptions({
                    draggable: true,
                    scrollwheel: context.options.scrollwheel
                });
            });

            $('body').on('click', function(e) {
                if (!$(context.options.container).has($(e.target)).length) {
                    googleMap.setOptions({
                        draggable: false
                    });
                }
            });

            GoogleMap.map = googleMap;
        },
        moveMaker: function(map) {
            if (window.innerWidth > 767 && GoogleMap.options.hasOwnProperty('moveMarker')) {
                map.panBy(GoogleMap.options.moveMarker.x, GoogleMap.options.moveMarker.y);
            }
        }
    }

    export.GoogleMap = GoogleMap;

}(jQuery, window));