var CatalogMenuCustom = {
	container: $('.navbar-mega-menu'),
	level1: {
		container: $('.menu-level-1'),
		links: [],
		targets: [],
		timer: 0,
		current: null
	},
	level2: {
		container: $('.menu-level-2'),
		links: $('.menu-level-2-nav a'),
		targets: [],
		timer: 0
	},
	openClass: 'open',
	delay: 300,
	init: function () {
		var self = this;

		$(document).on('click', function (e) {
			var context = $(e.target);
			if (!context.closest(self.container).length) {
				self.hideAll();
			}
		});

		this.initLevel1();
		this.initLevel2();
	},
	initLevel1: function () {
		var self = this;

		this.level1.links = this.level1.container.find('a').each(function () {
			var context = $(this),
				target = $(context.data('target'));

			if (!self.hasTarget(context)) {
				return;
			}

			target.data('owner', context)
				.on('show.catalog', function () {
					var context = $(this),
						owner = context.data('owner'),
						ownerParent = owner.parent();

					if (self.isCurrent1(owner[0]) && ownerParent.hasClass(self.openClass)) {
						return;
					}

					self.level1.current = owner;

					context.addClass(self.openClass);
					ownerParent.addClass(self.openClass);
					self.level1.container.addClass(self.openClass);

					self.showFirstOf(context);
					self.lazyLoadImages(context, '.menu-level-2-nav img[data-src]');
				})
				.on('hide.catalog', function () {
					var context = $(this),
						owner = context.data('owner'),
						ownerParent = owner.parent();

					if (self.isCurrent1(owner[0]) && ownerParent.hasClass(self.openClass)) {
						return;
					}

					context.removeClass(self.openClass);
					owner.blur().parent().removeClass(self.openClass);

				});

			self.level1.targets.push(target);
		}).on('click', function (e, evenName) {
			var context = $(this),
				target = $(context.data('target')),
				defaultEventName = 'click';

			if (!self.hasTarget(context)) {
				return;
			}

			if (typeof evenName == 'undefined') {
				evenName = defaultEventName;
			}

			if (!self.isOpen() || evenName == 'hover') {
				target.trigger('show.catalog');
			} else if (evenName == defaultEventName) {
				self.hideAll();
			}

			e.preventDefault();
			e.stopPropagation();
		}).hover(function () {
			if (!self.isOpen()) {
				return;
			}

			var context = $(this);
			self.level1.timer = setTimeout(function () {
				self.level1.current = context;
				self.hideTargets1();
				context.trigger('click', ['hover']);
			}, self.delay);
		}, function () {
			self.clearTimer1();
		});
	},
	initLevel2: function () {
		var self = this;

		this.level2.links.each(function () {
			var context = $(this),
				target = $(context.data('target'));

			target.data('owner', context)
				.on('show.catalog', function () {
					var context = $(this),
						owner = context.data('owner');

					self.lazyLoadImages(context);

					context.addClass(self.openClass);
					owner.parent().addClass(self.openClass);
				})
				.on('hide.catalog', function () {
					var context = $(this),
						owner = context.data('owner');

					context.removeClass(self.openClass);
					owner.blur().parent().removeClass(self.openClass);
				});

			self.level2.targets.push(target);
		}).on('click', function (e) {
			var context = $(this);

			if (is_touch_device()) {
				self.showTarget2(context);

				e.preventDefault();
				e.stopPropagation();
			}
		}).hover(function () {
			var context = $(this);

			self.level2.timer = setTimeout(function () {
				self.showTarget2(context);
			}, self.delay);
		}, function () {
			self.clearTimer2();
		});
	},
	isOpen: function () {
		return this.level1.container.hasClass(this.openClass);
	},
	hideAll: function () {
		if (!this.isOpen()) {
			return;
		}

		this.level1.current = null;
		this.hideTargets1();
		this.level1.container.removeClass(this.openClass);
	},
	hasTarget: function (object) {
		return typeof object.data('target') !== 'undefined';
	},
	isCurrent1: function (object) {
		return null !== this.level1.current && object === this.level1.current[0];
	},
	hideTargets1: function () {
		$.each(this.level1.targets, function () {
			$(this).trigger('hide.catalog');
		});
	},
	clearTimer1: function () {
		clearTimeout(this.level1.timer);
	},
	lazyLoadImages: function (context, selector) {
		var isShown = parseInt(context.data('isShown')) || 0;

		if (typeof selector == 'undefined') {
			selector = 'img[data-src]';
		}

		context.data('isShown', 1);

		if (!isShown) {
			$(selector, context).each(function() {
				var img = $(this);

				this.onload = function () {
					img.addClass('loaded');
				}

				this.src = $(this).data('src');
			})
		}
	},
	showFirstOf: function (context) {
		var object = (context.find('.menu-level-2-nav .active a').length > 0)? context.find('.menu-level-2-nav .active a') : context.find('.menu-level-2-nav a:first');

		this.showTarget2(object);
	},
	showTarget2: function (context) {
		var target = $(context.data('target'));

		if (target) {
			this.hideTargets2();
			target.trigger('show.catalog');
		}
	},
	hideTargets2: function () {
		$.each(this.level2.targets, function () {
			$(this).trigger('hide.catalog');
		});
	},
	clearTimer2: function () {
		clearTimeout(this.level2.timer);
	}
};
CatalogMenuCustom.init();

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