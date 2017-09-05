//核心逻辑
$.jkj.core = {
	//获取应用级数据
	getAppData: function() {
		var appData;

		appData = $.jkj.data.app;
		if(window.top === window.self) {
			if(window.opener != null) {
				if(window.opener.window.$.jkj){
					appData = window.opener.window.$.jkj.core.getAppData();
				}
			}
		} else {
			if(window.top.window.$.jkj){
				appData = window.top.window.$.jkj.data.app;
			}
		}

		return appData;
	},
	// 布局调整
	layout: {
		activate: function() {
			var _this = this;
			_this.fix();
			_this.fixSidebar();
			$('body, html, .wrapper').css('height', 'auto');
			$(window, ".wrapper").resize(function() {
				_this.fix();
				_this.fixSidebar();
			});
		},
		fix: function() {
			// Remove overflow from .wrapper if layout-boxed exists
			$(".layout-boxed > .wrapper").css('overflow', 'hidden');
			//Get window height and the wrapper height
			var footerHeight = $('.main-footer').outerHeight() || 0;
			var neg = $('.main-header').outerHeight() + footerHeight;
			var windowHeight = $(window).height();
			var sidebarHeight = $(".sidebar").height() || 0;
			//Set the min-height of the content and sidebar based on the
			//the height of the document.
			if($("body").hasClass("fixed")) {
				$(".content-wrapper, .right-side").css('min-height', windowHeight - footerHeight);
			} else {
				var postSetWidth;
				if(windowHeight >= sidebarHeight) {
					$(".content-wrapper, .right-side").css('min-height', windowHeight - neg);
					postSetWidth = windowHeight - neg;
				} else {
					$(".content-wrapper, .right-side").css('min-height', sidebarHeight);
					postSetWidth = sidebarHeight;
				}
	
				//Fix for the control sidebar height
				var controlSidebar = $($.jkj.options.controlSidebarOptions.selector);
				if(typeof controlSidebar !== "undefined") {
					if(controlSidebar.height() > postSetWidth){
						$(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
					}
				}
	
			}
		},
		fixSidebar: function() {
			//Make sure the body tag has the .fixed class
			if(!$("body").hasClass("fixed")) {
				if(typeof $.fn.slimScroll !== 'undefined') {
					$(".sidebar").slimScroll({ destroy: true }).height("auto");
				}
				return;
			} else if(typeof $.fn.slimScroll === 'undefined' && window.console) {
				window.console.error("Error: the fixed layout requires the slimscroll plugin!");
			}
			//Enable slimscroll for fixed layout
			if($.jkj.options.sidebarSlimScroll) {
				if(typeof $.fn.slimScroll !== 'undefined') {
					//Destroy if it exists
					$(".sidebar").slimScroll({ destroy: true }).height("auto");
					//Add slimscroll
					$(".sidebar").slimScroll({
						height: ($(window).height() - $(".main-header").height()) + "px",
						color: "rgba(0,0,0,0.2)",
						size: "3px"
					});
				}
			}
		}
	},
	// 推动菜单按钮操作
	pushMenu: {
		activate: function(toggleBtn) {
			//Get the screen sizes
			var screenSizes = $.jkj.options.screenSizes;

			//Enable sidebar toggle
			$(document).on('click', toggleBtn, function(e) {
				e.preventDefault();

				//Enable sidebar push menu
				if($(window).width() > (screenSizes.sm - 1)) {
					if($("body").hasClass('sidebar-collapse')) {
						$("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
					} else {
						$("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
					}
				}
				//Handle sidebar push menu for small screens
				else {
					if($("body").hasClass('sidebar-open')) {
						$("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
					} else {
						$("body").addClass('sidebar-open').trigger('expanded.pushMenu');
					}
				}
			});

			$(".content-wrapper").click(function() {
				//Enable hide menu when clicking on the content-wrapper on small screens
				if($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
					$("body").removeClass('sidebar-open');
				}
			});

			//Enable expand on hover for sidebar mini
			if($.jkj.options.sidebarExpandOnHover ||
				($('body').hasClass('fixed') &&
					$('body').hasClass('sidebar-mini'))) {
				this.expandOnHover();
			}
		},
		expandOnHover: function() {
			var _this = this;
			var screenWidth = $.jkj.options.screenSizes.sm - 1;
			//Expand sidebar on hover
			$('.main-sidebar').hover(function() {
				if($('body').hasClass('sidebar-mini') &&
					$("body").hasClass('sidebar-collapse') &&
					$(window).width() > screenWidth) {
					_this.expand();
				}
			}, function() {
				if($('body').hasClass('sidebar-mini') &&
					$('body').hasClass('sidebar-expanded-on-hover') &&
					$(window).width() > screenWidth) {
					_this.collapse();
				}
			});
		},
		expand: function() {
			$("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
		},
		collapse: function() {
			if($('body').hasClass('sidebar-expanded-on-hover')) {
				$('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
			}
		}
	},
	// 树菜单
	tree: function(menu) {
		var _this = this;
		var animationSpeed = $.jkj.options.animationSpeed;
		$(document).off('click', menu + ' li a')
			.on('click', menu + ' li a', function(e) {
				//Get the clicked link and the next element
				var $this = $(this);
				var checkElement = $this.next();

				//Check if the next element is a menu and is visible
				if((checkElement.is('.treeview-menu')) && (checkElement.is(':visible')) && (!$('body').hasClass('sidebar-collapse'))) {
					//Close the menu
					checkElement.slideUp(animationSpeed, function() {
						checkElement.removeClass('menu-open');
						//Fix the layout in case the sidebar stretches over the height of the window
						//_this.layout.fix();
					});
					checkElement.parent("li").removeClass("active");
				}
				//If the menu is not visible
				else if((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
					//Get the parent menu
					var parent = $this.parents('ul').first();
					//Close all open menus within the parent
					var ul = parent.find('ul:visible').slideUp(animationSpeed);
					//Remove the menu-open class from the parent
					ul.removeClass('menu-open');
					//Get the parent li
					var parentLi = $this.parent("li");

					//Open the target menu and add the menu-open class
					checkElement.slideDown(animationSpeed, function() {
						//Add the class active to the parent li
						checkElement.addClass('menu-open');
						parent.find('li.active').removeClass('active');
						parentLi.addClass('active');
						//Fix the layout in case the sidebar stretches over the height of the window
						_this.layout.fix();
					});
				}
				//if this isn't a link, prevent the page from being redirected
				if(checkElement.is('.treeview-menu')) {
					e.preventDefault();
				}
			});
	}
};