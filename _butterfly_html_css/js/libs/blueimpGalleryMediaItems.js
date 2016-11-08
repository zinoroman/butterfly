;(function ($, export) {
    'use strict';

    var BlueimpGallery = (function () {
        /**
         * List of availables video providers
         * @const
         * @type {Object}
         */
        var videoProvidersList = ['youtube', 'vimeo'];
        /**
         * Some settings for video providers
         * @const
         * @see https://github.com/blueimp/Gallery
         * @type {Object}
         */
        var videoProvidersSettings = {
            youtube: {
                href: 'https://www.youtube.com/watch?v='
            },
            vimeo: {
                href: 'https://vimeo.com/'
            }
        }
        /**
         * Selector for every media item inside specific gallery
         * @const
         * @type {String}
         */
        var blueimpItemSelector = '[data-el="blueimp-item"]';
        /**
         * Selector for blueimp container
         * @const
         * @type {String}
         */
        var blueimpContainerSelector = '[data-el="blueimp-controls"]';
        /**
         * Selector for every media album on specific page
         * @const
         * @type {String}
         */
        var blueimpGallerySelector = '[data-el="blueimp-gallery"]';
        /**
         * @const
         * @type {Object}
         */
        var $els = $(blueimpItemSelector);
        /**
         * @const
         * @type {Object}
         */
        var galleries = [];

        /**
         * Initialize module
         * @return {void}
         */
        function init () {
            listen();
        }

        /**
         * Listens for click event on the bluemp items
         * @return {void}
         */
        function listen () {
            $els.click(function (event) {
                var $currentMediaEl = $(this);
                var $mediaWrapper = $currentMediaEl.closest(blueimpGallerySelector);
                var $mediaEls = $mediaWrapper.find(blueimpItemSelector);
                var galleryIndex = isGalleryInitialized($mediaWrapper);
                var $blueimpContainer = $mediaWrapper.next(blueimpContainerSelector);
                
                if (isNaN(galleryIndex)) {
                    //Generates index of the new gallery
                    galleryIndex = createNewGallery();

                    //Collects data about blueimp items for the gallery
                    $mediaEls.each(function (index, el) {
                        var $el = $(el);
                        var provider = $el.data('provider');
                        var mediaSource = $el.data('blueimp-src');
                        var galleryData = {};

                        galleryData.title = $el.data('title');

                        //Is it video or image?
                        if (isVideo(provider)) {
                            galleryData.type = 'text/html';
                            galleryData.poster = $el.data('poster');
                            galleryData[provider] = mediaSource;
                            galleryData.href = videoProvidersSettings[provider].href + mediaSource;
                        }
                        else {
                            galleryData.type = 'text/jpeg';
                            galleryData.href = mediaSource;
                        }

                        addGalleryData({
                            galleryIndex: galleryIndex,
                            galleryData: galleryData
                        });
                    });

                    $mediaWrapper.attr('data-blueimp-gallery', galleryIndex);
                }

                //Start blueimp
                blueimp.Gallery(galleries[galleryIndex], {
                    index: $mediaEls.index($currentMediaEl),
                    container: $blueimpContainer
                });

                event.preventDefault();
            });
        }

        /**
         * Checks is current provider a video
         * @param {string|void} provider
         * @return {boolean}
         */
        function isVideo(provider) {
            return provider && videoProvidersList.indexOf(provider) > -1
        }

        /**
         * Gets the index of last element in galleries array
         * @return {int} - index of last element
         */
        function getIndexOfLastGallery () {
            var galleriesLength = galleries.length;

            if (galleriesLength > 1) {
                galleriesLength = galleriesLength - 1;
            }

            return galleriesLength;
        }

        /**
         * Creates a new gallery
         * @return {int} index of new gallery
         */
        function createNewGallery () {
            var indexOfNewGallery = getIndexOfLastGallery();
            galleries[indexOfNewGallery] = [];

            return indexOfNewGallery;
        }

        /**
         * Check is current gallery already initalized
         * @param  {object}  domElement
         * @return {void|number} index of gallery if gallery is initialized, false if not
         */
        function isGalleryInitialized (domElement) {
            var galleryIndex = parseInt(domElement.attr('data-blueimp-gallery'));
            return galleryIndex;
        }

        /**
         * Adds info about image (video) to the gallery data
         * @param {options} options
         * @return {int} index of the inserted element
         */
        function addGalleryData (options) {
            return galleries[options.galleryIndex].push(options.galleryData);
        }

        return {
            init: init
        }

    })();

    BlueimpGallery.init();
    export.BlueimpGallery = BlueimpGallery;

}(jQuery, window));