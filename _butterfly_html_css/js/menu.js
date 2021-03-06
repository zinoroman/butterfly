var mainMenuOptions;

if ('ontouchstart' in window) {
    mainMenuOptions = {
        secondLevel: {
            hoverDelay: 0
        }
    }
}
else {
    mainMenuOptions = {
        secondLevel: {
            hoverDelay: 250
        }
    }
}

var MainMenu = function (options) {

    //Contants
    var EVENTS = {
        SECOND_LEVEL_SHOWN: 'mainMenu.level2.shown',
        THIRD_LEVEL_HIDDEN: 'mainMenu.level3.hidden',
        THIRD_LEVEL_SHOWN: 'mainMenu.level3.shown'
    }

    var IS_TOUCH = 'ontouchstart' in window;

    //DOM Objects
    var level2Wrapper = $('.menu-level-2');
    var level2Li = $('.menu-level-2-nav > li');

    function init() {
        initFirstLevel();
        initSecondLevel();
    }

    function initFirstLevel() {
        $('.menu-level-1 > li')
            .on('shown.bs.dropdown', function (event) {
                //Show the first nested menu (3 level)

                var visibleLevel2Li = level2Li.filter(':visible');

                if (!visibleLevel2Li.hasClass('open') && !visibleLevel2Li.hasClass('active')) {
                    var currentActiveLi = visibleLevel2Li.filter('[data-active="true"]');
                    var futureActiveLi;

                    if (currentActiveLi.length) {
                        futureActiveLi = currentActiveLi;
                    }
                    else {
                        futureActiveLi = visibleLevel2Li.first();
                    }

                    futureActiveLi.addClass('open');
                }

                recalcHeightOfSecondLevel();

            });
    }

    function initSecondLevel() {
        var hoverTimeout;

        level2Wrapper
            .on(EVENTS.SECOND_LEVEL_SHOWN, function (event) {
                var target = $(event.currentTarget).find('.open').find('.dropdown-menu');

                level2Wrapper
                    .filter(':visible')
                        .css({
                            height: ''
                        });

                var level2WrapperHeight = level2Wrapper.outerHeight(true);
                var targetHeight = target.outerHeight(true) + (parseInt(level2Wrapper.css('padding-bottom')) * 2);

                if (targetHeight > level2WrapperHeight) {
                    level2Wrapper
                        .css({
                            height: targetHeight
                        });
                }
            });

        level2Li
            .hover(function (event) {
                hoverTimeout = setTimeout(function () {
                    var target = $(event.currentTarget);
                    
                    target
                        .siblings()
                            .removeClass('open')
                            .removeClass('active')
                            .attr('data-active', false);

                    if (target.find('.dropdown-menu').length) {
                        target
                            .addClass('open')
                            .attr('data-active', true);
                    }

                    recalcHeightOfSecondLevel();

                    }, options.secondLevel.hoverDelay);
            }, function () {
                clearTimeout(hoverTimeout);
            })
            .find('> a')
                .click(function (event) {
                    //Prevent closing of dropdown menu when user clicks on link in second level menu
                    event.stopPropagation();

                    if (IS_TOUCH) {
                        event.preventDefault();
                    }
                });
    }

    function recalcHeightOfSecondLevel() {
        level2Wrapper
            .filter(':visible')
                .trigger(EVENTS.SECOND_LEVEL_SHOWN);
    }

    init();

}(mainMenuOptions);



$('.navbar-accordion-menu > ul ul').each(function () {
    var fn_close = function (a) {
        $(a).removeClass('active').parent().attr('aria-expanded', 'false')
    }

    var ul = $(this);
    ul.prevAll('a').on('click', function (e) {
        var a = $(this);

        if (ul.is(':visible')) {
            ul.slideUp('fast', function () {
                $('ul', this).hide()
            })
                .find('a').each(function () {
                    fn_close(this);
                });

            fn_close(a);
        }
        else {
            var s = a.parent().siblings();
            s.find('ul:visible').slideUp('fast');
            fn_close(s.find('a'));
            ul.slideDown('fast');
            a.addClass('active').parent().attr('aria-expanded', 'true');
        }

        e.preventDefault();
        e.stopPropagation();
    });
    ul.slideUp('fast', function () {
            $('ul', this).hide()
        })
            .find('a').each(function () {
                fn_close(this);
            });
});