/*! adminjkj.js
 * ================
 * AdminJKJ 前端框架js的主文件。 
 * 这个文件应该被引用在各个页面中。
 * 他控制一些布局设置并被使用于jkj的各个js插件中。
 *
 * @作者 潘明星
 */

//在使用jkj.js之前必须确认jQuery已经被加载
if(typeof jQuery === "undefined") {
	throw new Error("adminjkj.js 依赖 jQuery");
}

/* jkj
 *
 * @类型 对象
 * @描述 $.jkj 是一个主要对象用于我们的前端代码。
 */
$.jkj = {
	//系统级数据和页面级数据。
	data: {
		app: {},
		page: {}
	},
	//基础参数配置
	options: {
		// 该参数接受整型值和字符串，整型单位毫秒，字符串有三种值：'fast', 'normal', or 'slow'
		// 应用场景： 动画元素盒子内伸、缩，树菜单滑上滑下
		animationSpeed: 500,
		// 工具栏推动菜单切换按钮选择器
		sidebarToggleSelector: "[data-toggle='offcanvas']",
		// 激活工具栏推动菜单按钮
		sidebarPushMenu: true,
		// 激活工具栏slimscroll，如果是固定布局（必须引用SlimScroll插件）
		sidebarSlimScroll: true,
		// 启用工具栏扩张效果当移动到最小化工具栏时 
		// 如果是固定布局和工具栏最小化时，这个参数强制为true
		sidebarExpandOnHover: false,
		// 控制工具栏树菜单
		enableControlTreeView: true,
		// 控制工具栏参数配置
		enableControlSidebar: true,
		controlSidebarOptions: {
			// 哪个按钮应该触发 open/close 事件
			toggleBtnSelector: "[data-toggle='control-sidebar']",
			// 工具栏选择器
			selector: ".control-sidebar",
			// 启用slide当超出内容区时
			slide: true
		},
		//bootstrap使用的标准屏幕大小集合
		//如果你修改variables.less文件里面的值, 也必须修改此处
		screenSizes: {
			xs: 480,
			sm: 768,
			md: 992,
			lg: 1200
		}
	}
};
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
//公共方法：前置jkj.js、core.js，用于jkj的扩展插件和页面自定义方法
$.jkj.util = {
	// 日期
	date: {
		init: function() {
			/*! 将 Date 格式化为指定格式的String 
			 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)、周或星期(E) 可以用 1-2 个占位符，
			 * 默认格式：yyyy-MM-dd hh:mm:ss 
			 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
			 * 例子： 
			 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
			 * (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
			 * (new Date()).format("E")      ==> 周x 
			 * (new Date()).format("EE")      ==> 星期x 
			 */
			Date.prototype.format = function(formatDateStr) {
				var o = {
					"M+": this.getMonth() + 1, //月份           
					"d+": this.getDate(), //日           
					"h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时           
					"H+": this.getHours(), //小时           
					"m+": this.getMinutes(), //分           
					"s+": this.getSeconds(), //秒           
					"q+": Math.floor((this.getMonth() + 3) / 3), //季度           
					"S": this.getMilliseconds() //毫秒           
				};
				var week = {
					"0": "/u65e5",
					"1": "/u4e00",
					"2": "/u4e8c",
					"3": "/u4e09",
					"4": "/u56db",
					"5": "/u4e94",
					"6": "/u516d"
				};

				formatDateStr = formatDateStr || 'yyyy-MM-dd hh:mm:ss';
				if(/(y+)/.test(formatDateStr)) {
					formatDateStr = formatDateStr.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				if(/(E+)/.test(formatDateStr)) {
					formatDateStr = formatDateStr.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
				}
				for(var k in o) {
					if(new RegExp("(" + k + ")").test(formatDateStr)) {
						formatDateStr = formatDateStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					}
				}

				return formatDateStr;
			};

			return true;
		},
		//根据字符串获取日期对象，建议使用字符串扩展方法toDate()
		getDate: function(dateStr) {
			return dateStr.toDate();
		},
		//获取今天
		getTodayStr: function(formatDateStr) {
			formatDateStr = formatDateStr || 'yyyy-MM-dd';

			return(new Date()).format(formatDateStr);
		}
	},
	// 数字
	number: {
		init: function() {
			//银行家舍入算法（四舍六入五取偶，五后不为零则进位）
			Number.prototype.bankRound = function(n) {
				var power, signal, newNumber, temp1, temp2;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);

				temp1 = Math.floor(this * power * 100) % 10;
				temp2 = Math.floor(this * power * 10) % 100;
				//与运算，前面表示五后面为零，中间表示能被5整除，后面表示十位为偶数
				signal = temp1 === 0 && ((temp2 / 5) % 2 === 1) && (Math.floor(temp2 / 10) % 2 === 0);

				newNumber = Math.round(this * power) / power;
				if(signal) {
					newNumber = (Math.round(this * power) - 1) / power;
				}

				return newNumber;
			};
			//上舍入，返回数值
			Number.prototype.ceil = function(n) {
				var power, newNumber;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);
				newNumber = Math.ceil(this * power) / power;

				return newNumber;
			};
			//下舍入，返回数值
			Number.prototype.floor = function(n) {
				var power, newNumber;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);
				newNumber = Math.floor(this * power) / power;

				return newNumber;
			};
			//四舍五入，返回数值。如果需要返回字符串，直接使用原生的toFixed
			Number.prototype.round = function(n) {
				var power;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);

				return Math.round(this * power) / power;
			};

			return true;
		}
	},
	// 字符串
	string: {
		init: function() {
			// 返回字符串的长度，一个汉字算2个长度 
			String.prototype.cnLength = function() {
				return this.replace(/[^\x00-\xff]/g, "**").length;
			};
			// 字符串超出长度添加省略号
			String.prototype.cutString = function(n) {
				n= n || 10;
				if(this.length>n){
					return this.substr(0, n) + "...";
				}
				else{
					return this.toString();
				}
			};
			/*! 获取数值信息
			 * 参数：
			 * n： 精度
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 * 返回：对象
			 * lNumber： 小数点左边的数
			 * rNumber： 小数点右边的数
			 * stringValue： 经过加工的字符串值
			 */
			String.prototype.getNumberInfo = function(n, roundWay) {
				var str, strNumber, lNumber, rNumber, numberInfo;

				if(isNaN(Number(this))) {
					throw new Error('字符串内容不是数值！');
				}

				n = Math.abs(n || 0);
				if(n > 0) {
					roundWay = roundWay || 'floor';
				}
				str = this.toString();
				numberInfo = {};
				if(str.indexOf('.') >= 0) {
					if(str.indexOf('.') === 0) {
						str = '0' + str;
					}
					lNumber = str.split('.')[0];
					rNumber = '0.' + str.split('.')[1];
				} else {
					lNumber = str;
					rNumber = '0.0';
				}
				if(roundWay === 'round') {
					rNumber = Number(rNumber).toFixed(n);
				} else if(roundWay === 'floor') {
					rNumber = Number(rNumber).floor(n).toFixed(n);
				} else if(roundWay === 'ceil') {
					rNumber = Number(rNumber).ceil(n).toFixed(n);
				} else if(roundWay === 'bank') {
					rNumber = Number(rNumber).bankRound(n).toFixed(n);
				}
				strNumber = lNumber;
				if(rNumber !== undefined) {
					lNumber = (Number(lNumber) + Number(rNumber[0])).toString();
					strNumber = (Number(this)<0 && Number(lNumber)===0? '-':'') + lNumber;
					rNumber = rNumber.substring(2);
					strNumber += '.' + rNumber;
				}

				numberInfo.lNumber = lNumber;
				numberInfo.rNumber = rNumber;
				numberInfo.stringValue = strNumber;

				return numberInfo;
			};
			// 获取浏览器地址栏参数
			String.prototype.getURLParameter = function(name) {　　
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
				var matchedArray = this.substr(this.indexOf("/?") + 1).match(reg);　　
				if(matchedArray != null) {
					return unescape(matchedArray[2]);
				}
				return null;
			};
			// 替换全部
			String.prototype.replaceAll = function(subString, replaceString, ignoreCase) {
				return this.replace(new RegExp(subString, ignoreCase ? "gim" : "gm"), replaceString);
			};
			/*! 数值字符串转为中文大写
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 */
			String.prototype.toChineseNumber = function(n, roundWay) {
				var str, units, chineseNumber, strNumber, tempArr, numberInfo;

				str = this.toString();
				numberInfo = str.getNumberInfo(n, roundWay);
				units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千'];
				chineseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
				tempArr = [];

				$.each(numberInfo.lNumber.split('').reverse(), function(i, item) {
					tempArr.push(chineseNumber[item] + units[i]);
				});
				tempArr = tempArr.reverse();
				if(tempArr.length > 1) {
					var temp;

					temp = tempArr.pop();
					if(temp != '零') {
						tempArr.push(temp);
					}
				}
				if(numberInfo.rNumber !== undefined) {
					tempArr.push('点');
					numberInfo.rNumber = Number(numberInfo.rNumber).toString();
					$.each(numberInfo.rNumber.split(''), function(i, item) {
						tempArr.push(chineseNumber[item]);
					});
				}

				strNumber = tempArr.join('');
				strNumber = strNumber.replace(/零[千百十]/g, '零')
					.replace(/零([兆|亿|万])/g, '$1')
					.replace(/零{2,}/g, '零')
					.replace(/([兆|亿])零/g, '$1')
					.replace(/亿万/, '亿')
					.replace(/兆亿/, '兆');

				return strNumber;
			};
			/*! 数值字符串转为中文金额
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 */
			String.prototype.toCapitalMoney = function(roundWay) {
				var str, units, chineseNumber, strNumber, tempArr, numberInfo;

				str = this.toString();
				numberInfo = str.getNumberInfo(2, roundWay);
				units = ['分', '角', '元', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '兆', '拾', '佰', '仟'];
				chineseNumber = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
				tempArr = [];

				$.each(numberInfo.stringValue.replace('.', '').split('').reverse(), function(i, item) {
					tempArr.push(chineseNumber[item] + units[i]);
				});
				tempArr = tempArr.reverse();

				strNumber = tempArr.join('');
				strNumber = strNumber.replace(/零角零分$/g, '整')
					.replace(/零[仟佰拾角分]/g, '零')
					.replace(/零+/g, '零')
					.replace(/零([兆|亿|万|元])/g, '$1')
					.replace(/([兆|亿])零/g, '$1')
					.replace(/亿万/, '亿')
					.replace(/兆亿/, '兆')
					.replace(/零$/, '')
					.replace(/^元/, '零元');

				return strNumber;
			};
			//字符串日期转为日期对象
			String.prototype.toDate = function() {
				return new Date(Date.parse(this.replace(/-/g, "/")));
			};
			/*! 数值字符串转为金额字符串
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 * n: 精度
			 * thousands: 千分位符号
			 */
			String.prototype.toMoney = function(roundWay, n, thousands) {
				var numberInfo;
				
				n= n||2;
				numberInfo = this.getNumberInfo(n, roundWay);
				if(typeof thousands=== 'string' && thousands.length>0){
					var regMoney=/(\d{1,3})(?=(\d{3})+(?:\.))/g;
					
					numberInfo.stringValue = numberInfo.stringValue.replace(regMoney,'$1,');
				}

				return numberInfo.stringValue;
			};
			// 字符串去除开始和结尾的空格  
			String.prototype.trim = function() {
				return this.replace(/(^\s*)|(\s*$)/g, "");
			};
			// 字符串去除所有的空格 
			String.prototype.trimAll = function() {
				return this.replace(/\s+/g, "");
			};
			// 字符串去除开始的空格
			String.prototype.trimLeft = function() {
				return this.replace(/(^\s*)/g, "");
			};
			// 字符串去除结尾的空格
			String.prototype.trimRight = function() {
				return this.replace(/(\s*$)/g, "");
			};

			return true;
		}

	},
	// 随机数
	random: {
		// 获取随机数基础方法
		basic: function(length, chars) {
			var charsLength, randomString;

			length = length || 4;
			charsLength = chars.length;
			randomString = '';
			for(var i = 0; i < length; i++) {
				randomString += chars[Math.floor(Math.random() * charsLength)];
			}

			return randomString;
		},
		// 获取当前时间加随机数拼接的字符串
		getLongDateString: function() {
			return(new Date()).format('yyyyMMddHHmmss') + this.getString(8);
		},
		// 获取随机字符串
		getString: function(length) {
			var chars;

			chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';

			return this.basic(length, chars);
		},
		// 获取随机字符串，去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
		getSimpleString: function(length) {
			var chars;

			chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

			return this.basic(length, chars);
		}
	},
	// 加入收藏夹
	addFavorite: function(url, title) {
		try {
			window.external.addFavorite(url, title);
		} catch(e) {
			try {
				window.sidebar.addPanel(title, url, "");
			} catch(e) {
				alert("加入收藏失败，请使用Ctrl+D进行添加");
			}
		}
	},
	// 设为首页
	setHomepage: function(homeurl) {
		if(document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(homeurl);
		} else if(window.sidebar) {
			if(window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				} catch(e) {
					alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config，然后将项 signed.applets.codebase_principal_support 值该为true");
				}
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage', homeurl);
		}
	}
};
//初始化文件
$.jkj.init = function() {
	var core, data, options, util;

	core = this.core;
	data = this.data;
	options = this.options;
	util = this.util;

	data.app = this.core.getAppData();

	$.each(util, function(key, val) {
		if(val.init !== undefined) {
			util[key].init();
		}
	});

	core.layout.activate();

	// 启用工具栏树菜单控件
	if(options.enableControlTreeView) {
		core.tree('.sidebar');
	}

	// 激活工具栏推动菜单按钮
	if(options.sidebarPushMenu) {
		core.pushMenu.activate(options.sidebarToggleSelector);
	}

	return this;
};

$(function() {
	$.jkj.init();
});
/*! blockui 遮罩层
 *  基于jquery-blockui 封装的遮罩层
 */
$.jkj.blockui = {
    _init: function (options) {
        var settings;

        settings = {
            //target: '', //需要覆盖的模块id,不填默认为全屏
            image: '/images/loading.gif', //进度条logo
            message:'加载中...',
            zIndex: 1000,
            overlayColor: '#000', //覆盖层颜色
            overlayOpacity: 0.2 //覆盖层不透明度
        };

        options = $.extend(true, settings, options);

        var message = '<div class="loading-message ">';
        message += '<img src="' + options.image + '" align="" width="80px" height="95px"><br/>';
        message += '<span>' + options.message + '</span>';
        message += '</div>';

        if (options.target) { //模块加载
            var element = $(options.target);

            if (element.height() <= $(window).height()) {
                options.cenrerY = true;
            }

            element.block({
                message: message,
                baseZ: options.zIndex,
                centerY: void 0 !== options.cenrerY ? options.cenrerY : false,
                css: { //提示框的css
                    top: "10%",
                    border: "0",
                    padding: "0",
                    backgroundColor: "none"
                },
                overlayCSS: { //遮罩层的css
                    backgroundColor: options.overlayColor,
                    opacity: options.overlayOpacity,
                    cursor: "wait"
                }
            });

        } else { //全屏加载
            $.blockUI({
                message: message,
                baseZ: options.zIndex,
                css: { //提示框的css
                    border: "0",
                    padding: "0",
                    backgroundColor: "none"
                },
                overlayCSS: { //遮罩层的css
                    backgroundColor: options.overlayColor,
                    opacity: options.overlayOpacity,
                    cursor: "wait"
                }
            });
        }
    },
    show: function (options) {
        this._init(options);
    },
    hide: function (element) {
        if (element) {
            $(element).unblock({
                onUnblock: function () {
                    $(element).css("position", "");
                    $(element).css("zoom", "");
                }
            });
        } else {
            $.unblockUI();
        }
    }
};
/*! xmp 代码展开
 */
$('[data-xmp]').click(function(){
	var t=$(this).text();
	if(t=="展开代码"){
		$(this).next('xmp').css("height","auto");
		$(this).text("收起代码");
	}else{
		$(this).next('xmp').css("height","100px");
		$(this).text("展开代码");
	}  
});

/*! dataTable 通知
 *  基于第三方插件dataTables封装的表格
 * 
 */
$.jkj.dataTable = {
	_init:function(element,options){
		var myTable, settings;

		if(!$.fn.dataTable) {
			throw new Error('$.jkj.dataTable 依赖第三方插件 dataTables');
		}

		settings = {
			//Ajax请求资源，
			//"ajax": null,
			/************
			 *特性部分
			 *************/
			//是否开启jQuery UI ThemeRoller支持
			"jQueryUI": false,
			//控制是否显示表格左下角的信息
			"info": true,
			//是否允许最终用户改变表格每页显示的记录数
			"lengthChange": true,
			//是否允许DataTables排序。
			"ordering": true,
			//是否开启分页功能
			"paging": true,
			//是否显示处理状态
			"processing": false,
			//是否开启水平滚动
			"scrollX": true,
			//是否开启垂直滚动，string类型
			"scrollY": "",
			//是否允许Datatables开启本地搜索
			"searching": false,
			//是否开启服务器模式，过滤、分页、排序的处理，如果是true在浏览器中进行，如果是false在服务端进行
			"serverSide": false,
			//保存状态 - 在页面重新加载的时候恢复状态（页码等内容）
			"stateSave": true,
			//控制Datatables是否自适应宽度
			"autoWidth": true,
			//控制Datatables的延迟渲染，可以提高初始化的速度
			"deferRender": false,
			/************
			 *配置(Options)
			 *************/
			//延迟请求加载服务端的数据，直到表格第二次绘制
			"deferLoading": null,
			//销毁所有符合选择的table，并且用新的options重新创建表格
			"destroy": false,
			//初始化显示的时候从第几条数据开始显示(一开始显示第几页)
			"displayStart": 0,
			//定义在每页显示记录数的select中显示的选项
			"lengthMenu": [10, 20, 30, 50, 100],
			//高亮显示在table的body中排序的列
			"orderClasses": true,
			//控制多列排序
			"orderMulti": false,
			//表格在初始化的时候的排序,"order": [[ 0, 'asc' ], [ 1, 'asc' ]]
			"order": [],
			//改变初始的页面长度(每页显示的记录数)
			"pageLength": 10,
			//分页按钮的显示方式
			"pagingType": "full_numbers",
			//显示组件的渲染方式renderer: {
			//        "header": "jqueryui",
			//        "pageButton": "bootstrap"
			//    }
			"renderer": "bootstrap",
			//数据属性，Datatables在渲染的时候给 trTag设置的ID
			//rowId: 'DT_RowId',
			//当显示更少的记录时，是否允许表格减少高度，同scrollY一起使用
			//scrollCollapse: true,
			/************
			 *设置一个全局的过滤条件
			 *************/
			"search": {
				//在搜索或者过滤时，是否大小写敏感
				"caseInsensitive": false,
				//允许或者禁止对在搜索字符串中出现的正则表达式字符强制编码
				"regex": false,
				//初始化时的表格的过滤（搜索）条件
				"search": "",
				//允许或者禁止DataTables的只能过滤（搜索）功能
				"smart": false
			},
			//设定搜索的间隔时间。默认为null
			"searchDelay": 350,
			//间隔多长时间保存一次状态，单位：秒
			"stateDuration": 7200,
			//设置斑马条（奇偶行）的css class
			//"stripeClasses": [ 'strip1', 'strip2', 'strip3'],
			/************
			 *设置定义列的初始属性
			 *************/
			"columnDefs": [{
		      "orderable": false,
		      "orderSequence": ["desc", "asc", ""],
		      "searchable": false,
		      "targets": "_all"
		    }],
			/************
			 *国际化
			 *************/
			"language": {
				"aria": {
					"sortAscending": " - 点击返回升序排序",
					"sortDescending": " - 点击返回降序排序"
				},
				//小数点表示字符（有些文化中用"，"表示小数点）
				"decimal": "",
				//当表格没有数据时，表格所显示的字符串
				"emptyTable": "未查询到相关数据。",
				//表格的page分页所需显示的所有字符串
				"info": "显示 _START_ 到 _END_ 条，共  _TOTAL_ 条",
				//当表格没有数据时，汇总地方显示的字符串
				"infoEmpty": "显示 0 到 0 条，共 0 条",
				//当表格搜索后，在汇总字符串上需要增加的内容
				"infoFiltered": " - 过滤前共 _MAX_ 条",
				//在汇总字符串上始终增加的字符串
				"infoPostFix": "",
				//'每页显示记录'的下拉框的提示信息
				"lengthMenu": "显示 _MENU_ 条",
				//加载数据时的提示信息 - 当 Ajax请求数据时显示
				"loadingRecords": "数据正在加载中...",
				//分页信息显示所需的字符串的所有信息
				"paginate": {
					"first": "首页",
					"last": "末页",
					"next": "后一页",
					"previous": "前一页"
				},
				//当table处理用户处理信息时，显示的信息字符串
				"processing": "数据正在加载中...",
				//搜索框的提示信息
				"search": "搜索：",
				//搜索框(input)的placeholder属性
				"searchPlaceholder": "请输入内容",
				//千位的分隔符
				"thousands": ",",
				//从远程地址中加载语言信息
				"url": "",
				//当搜索结果为空时，显示的信息
				"zeroRecords": "未查询到相关数据。"
			}
		};
		
		options=$.extend(true, settings, options);
		myTable=$(element).DataTable(options);
		
		return myTable;
	},
	local: function(element, options){
		var myTable, settings;
		
		settings = {
			
		};
		options=$.extend(true, settings, options);
		myTable=this._init(element, options);
		
		return myTable;
	},
	remote: function(element, options){
		var myTable, settings;
		
		settings = {
			"serverSide": true,
			/*参数说明：
			 * data：发送给服务器的数据
			 * callback：必须被执行，Datatables才能获取到数据
			 * settings：Datatables的设置对象
			 */
			"ajax": function(data, callback, settings){
				var api=$(element).dataTable().api(true);
				var customData='';
				var formId= ($.isFunction(options.formId) ? options.formId() : options.formId)||'';
				
				customData += 'draw='+data.draw;
				customData += '&pageNumber='+ (api.page()+1);
				customData += '&pageSize='+api.page.len();
				
				$.each(data.order, function(i, item) {
					customData +='&sort['+i+'].property='+ encodeURIComponent(data.columns[item.column].data);
					customData += '&sort['+i+'].direction='+item.dir;
				});
				
				formId=formId.trim();
				if(formId.length>0){
					if(formId.indexOf('#')<0){
						formId='#'+formId;
					}
					$.each($(formId).serializeArray(), function(i, item) {
						customData += '&' + item.name + '=' + (item.value ? encodeURIComponent(item.value):'');
					});
				}
				if($.isFunction(options.ajaxMethod)){
					options.ajaxMethod(customData, callback, settings);
				}
			} 
		};
		options=$.extend(true, settings, options);
		myTable=this._init(element, options);
		
		return myTable;
	}
};
$.jkj.daterangepicker = function(id, options) {
	var settings, templates, beginDate, endDate, startElementId, endElementId, changedOnce;

	startDate = endDate = $.jkj.util.date.getTodayStr();
	changedOnce = false;
	settings = {
		locale: {
			applyLabel: '选择',
			cancelLabel: '清除',
			fromLabel: '起始时间',
			toLabel: '结束时间',
			weekLabel: '周',
			customRangeLabel: '自定义范围',
			daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
			monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
		},
		startDate: startDate,
		endDate: endDate,
		startElementName: 'beginDate',
		endElementName: 'endDate',
		showDropdowns: true,
		maxDate: '2250-01-01',
		format: 'YYYY-MM-DD',
		callback: function(startDate, endDate) {
			$('#'+startElementId).val(startDate.format(options.format));
			$('#'+endElementId).val(endDate.format(options.format));
			changedOnce=true;
		},
		cancelHanddle: function() {
			$(id).val('');
			$('#'+startElementId).val('');
			$('#'+endElementId).val('');
			$(id).blur();
		},
		applyHanddle: function() {
			if(!changedOnce){
				var daterangepicker=$(id).data('daterangepicker');
				$('#'+startElementId).val(daterangepicker.startDate.format(options.format));
				$('#'+endElementId).val(daterangepicker.endDate.format(options.format));
				changedOnce=true;
			}
			$(id).blur();
		}
	};
	templates = {
		startElement: function() {
			return '<input type="hidden" id="' + startElementId + '" name="' + options.startElementName + '" value="">';
		},
		endElement: function() {
			return '<input type="hidden" id="' + endElementId + '" name="' + options.endElementName + '" value="">';
		}
	};
	options = $.extend(true, settings, options);
	id = id.trim();
	if(id.indexOf('#') < 0) {
		id = '#' + id;
	}
	startElementId = id.substring(1) + '-' + options.startElementName;
	endElementId = id.substring(1) + '-'  + options.endElementName;
	$(id).after(templates.endElement());
	$(id).after(templates.startElement());
	
	// 控件初始化
	$(id).daterangepicker(options, options.callback)
		.on("cancel.daterangepicker", function(e) {
			options.cancelHanddle.call(this);
		}).on("apply.daterangepicker", function(e) {
			options.applyHanddle.call(this);
		});
	// 清除日期
	$(id).__proto__.clearDate=function(){
		$(id).val('');
		$('#'+startElementId).val('');
		$('#'+endElementId).val('');
		changedOnce=false;
	}
}
/*! layer 层 
 *  基于bootstrap模态框样式实现的遮罩层、加载层等
 */
$.jkj.layer={
	_init:function(id,type){
		var _layer, newlayer, pageData, util;
		
		pageData=$.jkj.data.page;
		util=$.jkj.util;
		id = id||('layer'+util.random.getLongDateString());
		pageData.layers=pageData.layers||[];
		
		_layer=function(){
			this.id=id;
			//类型：page页面的层，zone区域的层
			this.type=type;
			//区域加载层时有效
			this.$zoneElem=null;
		};
		//模板
		_layer.prototype.templates={
			//蒙版外壳
			wrapper:function(id){
				var html;
				
				html=[];
				html.push('<div id="'+id+'" tabindex="-1" class="modal fade bs-example-modal-lg modal-primary in" ');
				html.push(' 	role="dialog" style="display: block; background-color:rgba(0,0,0,0.2)">');
				html.push('	<div class="modal-dialog modal-lg">');
				html.push('		<div class="modal-content" style="border:none;box-shadow:none;background:none;"></div>');
				html.push('	</div>');
				html.push('</div>');
				
				return html.join('\n');
			},
			//加载内容
			loadingContent:function(message, imgUrl){
				var html;
				
				html=[];
				html.push('<div class="modal-body">');
				html.push('	<div style="text-align:center;">');
				html.push('		<div class="'+imgUrl+'"></div>');
				html.push('		<br/>');
				html.push('		<span id="loading-message" style="color:white">'+message+'</span>');
				html.push('	</div>');
				html.push('</div>');
				
				return html.join('\n');
			},
			loadingZoneContent:function(id, message, imgUrl, $elem){
				var html;
				
				html=[];
				html.push('<div id="'+id+'" style="background-color:rgba(0,0,0,0.2);position:absolute;top:0;left:0;z-index:10;width:100%;height:100%;">');
				html.push('	<div style="text-align:center;padding:20px 0;">');
				html.push('		<div class="'+imgUrl+'"></div>');
				html.push('		<br/>');
				html.push('		<span id="loading-message" style="color:white">'+message+'</span>');
				html.push('	</div>');
				html.push('</div>');
				
				return html.join('\n');
			}
		};
		//关闭层
		_layer.prototype.close=function(){
			var index;
			
			$('body').find('#'+this.id).remove();
			$(pageData.layers).each(function(i,item){
				if(item.id===this.id){
					index=i;
					return false;
				}
			});
			$(pageData.layers).splice(index, 1);
			if(this.type==='page'){
				var hasOne=false;
				$(pageData.layers).each(function(i,item){
					if(this.type==='page'){
						hasOne=true;
						return false;
					}
				});
				if(!hasOne){
					$('html').css('overflow-y', 'auto');
				}
			}
			else if(this.type==='zone'){
				this.$zoneElem.css('min-height',this.$zoneElem.data('min-height'));
			}
		};
		//设置加载层的消息
		_layer.prototype.setMessage=function(message){
			$('body').find('#'+this.id+' #loading-message').html(message);
		};
		
		newlayer=new _layer();
		pageData.layers.push(newlayer);
		
		return newlayer;
	},
	//根据id获取层
	get:function(id){
		var myLayer, layers;
		
		myLayer=null;
		layers=$.jkj.data.page.layers||[];
		//在当前页面查找并移除指定层
		$(layers).each(function(i, item){
			if(item.id===id){
				myLayer=item;
				return false;
			}
		});
		//如果当前页面没有，到父页面查找并移除
		if(myLayer==null){
			if(window.parent!==window.self){
				layers=window.parent.window.$.jkj.data.page.layers||[];
				$(layers).each(function(i, item){
					if(item.id===id){
						myLayer=item;
						return false;
					}
				});
			}
			//如果父页面没有，到顶级页面查找并移除
			if(myLayer==null){
				if(window.top!==window.self&&window.top!==window.parent){
					layers=window.top.window.$.jkj.data.page.layers||[];
					$(layers).each(function(i, item){
						if(item.id===id){
							myLayer=item;
							return false;
						}
					});
				}
			}
		}
		
		return myLayer;
	},
	//创建加载层
	loading:function(message,imgUrl,id){
		var layer, layerHtml;
		
		message=message||'';
		imgUrl=imgUrl||'layer-loading';
		layer=this._init(id,'page');
		layerHtml=layer.templates.wrapper(layer.id);
		$('body').append(layerHtml);
		$('body').find('#'+layer.id+' .modal-content').append(layer.templates.loadingContent(message, imgUrl));
		
		return layer;
	},
	//创建区域加载层
	loadingZone:function($elem,message,imgUrl,id){
		var layer, layerHtml;
		
		$elem.css('position','relative');
		$elem.data('min-height',$elem.css('min-height'));
		$elem.css('min-height','200px');
		message=message||'';
		imgUrl=imgUrl||'layer-loading';
		layer=this._init(id,'zone');
		layer.$zoneElem=$elem;
		layerHtml=layer.templates.loadingZoneContent(layer.id,message,imgUrl,$elem);
		$elem.append(layerHtml);
		
		return layer;
	},
	//当前页面创建蒙版
	mask:function(id){
		var layer, layerHtml;
		
		layer=this._init(id,'page');
		layerHtml=layer.templates.wrapper(layer.id);
		$('body').append(layerHtml);
		
		return layer;
	},
	//父页面创建蒙版
	maskParent:function(id){
		var parent;
	
		parent=window.parent===window.self? this:window.parent.window.$.jkj.layer;
		
		return parent.mask(id);
	},
	//顶级页面创建蒙版
	maskTop:function(id){
		var top;
		
		top=window.top===window.self? this:window.top.window.$.jkj.layer;
		
		return top.mask(id);
	},
	//移除指定层
	remove:function(id){
		var myLayer;
		
		myLayer=this.get(id);
		if(myLayer!=null){
			myLayer.close();
		}
	},
	//移除所有层(蒙版，加载，加载含内容)
	removeAll:function(){
		var layers;
		
		layers=$.jkj.data.page.layers||[];
		//移除当前页
		$(layers).each(function(i, item){
			item.close();
		});
		//移除父页面
		if(window.parent!==window.self){
			layers=window.parent.window.$.jkj.data.page.layers||[];
			$(layers).each(function(i, item){
				item.close();
			});
		}
		//移除top页面
		if(window.top!==window.self&&window.top!==window.parent){
			layers=window.top.window.$.jkj.data.page.layers||[];
			$(layers).each(function(i, item){
				item.close();
			});
		}
	},
	//设置加载层消息
	setMessage:function(id,message){
		var myLayer;
		
		myLayer=this.get(id);
		myLayer.setMessage(message);
	}
};

//加载内容(当前元素内显示加载效果)
$.fn.loadWithZoneLayer = function (url, data, callback, autoClose) {
    if ($(this).length === 0) {
        return;
    }
    var myLayer;
    
    if(typeof autoClose !=='boolean'){
    	autoClose=true;
    }
    myLayer=$.jkj.layer.loadingZone($(this),'数据加载中...');
    if($(this).find('.layer-content').length==0){
    	$(this).prepend('<div class="layer-content"></div>');
    }
    return $(this).find('.layer-content').load(url, data, function (response, status, xhr) {
        if (callback){
            if(autoClose){
        		callback.call(this, response);
        		myLayer.close();
        	}else{
            	callback.call(this, response, myLayer);
        	}
        }
        else{
        	myLayer.close();
        }
    }).error(function () {
        myLayer.setMessage('系统加载失败...');
    });
};

//加载内容(带加载效果)
$.fn.loadWithPageLayer = function (url, data, callback, autoClose) {
    if ($(this).length === 0) {
        return;
    }
    var myLayer;
    
    if(typeof autoClose !=='boolean'){
    	autoClose=true;
    }
    myLayer=$.jkj.layer.loading('数据加载中...');
    return $(this).load(url, data, function (response, status, xhr) {
        if (callback){
        	if(autoClose){
        		callback.call(this, response);
        		myLayer.close();
        	}else{
            	callback.call(this, response, myLayer);
        	}
        }
        else{
        	myLayer.close();
        }
    }).error(function () {
        myLayer.setMessage('系统加载失败...');
    });
};
/*! modal 模态框
 *  基于bootstrap modal封装的模态框
 */
$.jkj.modal = function () {

    //默认配置
    var modals = []; //模态框集合
    var settings = {
        id: null, //模态框id
        cssClass: '', //模态框格外class
        header: true, //是否需要header
        footer: true, //是否需要footer
        title: '标题', //标题
        width: null, //模态框宽度
        content: null, //模态框内容可以是,string，function，或者ajax参数对象
        backdrop: 'static', //是否需要背景遮罩层，boolean值，true，false或'static'，如果值为'static'则遮罩层点击不会关闭
        keyboard: true, //是否需要esc键关闭模态框
        buttons: [{
            label: '取消', //按钮文本
            cssClass: 'btn-cancel', //按钮额外class
            hotKey: 'cancel', //按钮逻辑类型，取消逻辑(cancel)，
            action: function (modal) { //按钮点击回调

            }
        },
            {
                label: '确定', //按钮文本
                cssClass: 'btn-primary', //按钮额外class
                action: function (modal) { //按钮点击回调

                }
            }
        ]
    };

    /**
     * 创建模态框
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModal = function (options) {
        var $modal = $('<div class="modal fade" role="dialog" aria-hidden="true"></div>');
        $modal.addClass(options.cssClass);
        $modal.prop('id', options.id);
        $modal.attr('aria-labelledby', options.id + '_title');
        return $modal;
    };

    /**
     * 创建模态框dialog
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalDialog = function (options) {
        var $modalDialog = $('<div class="modal-dialog" role="document"></div>');
        if (options.width) {
            $modalDialog.css('width', options.width);
        }
        return $modalDialog;
    };

    /**
     * 创建模态框content
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalContent = function (options) {
        var $content = $('<div class="modal-content"></div>');
        $content.append($('<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>'));
        return $content;
    };

    /**
     * 生成动态内容
     * @returns {*}
     * @param options
     */
    var _createDynamicContent = function (options, $body) {
        var oldContent = options.content,
            newContent = null;

        //ajax默认参数
        var ajaxOptions = {
            type: "GET",
            dataType: "html",
            beforeSend: null,
            async: false,//是否异步加载默认同步
            layer: false,//是否需要进度遮罩层,默认false
            layerMessage: '加载中...',//进度遮罩层默认提示语
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var errorInfo = '错误信息:' + textStatus + ",捕获的异常对象:" + errorThrown;
                //默认错误处理
                $.jkj.notify.showError(errorInfo, {
                    z_index: 1199
                });
                //关闭遮罩层
                if (ajaxOptions.layer && _layer) {
                    _layer.close();
                }
            }
        };

        $.extend(true, ajaxOptions, oldContent, true);

        var _layer;
        if (ajaxOptions.layer) {
            _layer = $.jkj.layer.loadingZone($('#' + options.id).find('.modal-dialog'), ajaxOptions.layerMessage);
        }

        var _success = oldContent.success; //业务逻辑成功回调
        var _fail = oldContent.fail; //业务逻辑错误回调
        ajaxOptions.success = function (data, textStatus, jqXHR) {

            if (ajaxOptions.async) {//异步

                $body.parents('#' + options.id).on('shown.bs.modal', function () {
                    //默认业务逻辑成功处理
                    newContent = data;

                    //设置模态框内容
                    _setModalBody(options, newContent);

                    //逻辑成功处理回调
                    if (typeof _success === 'function') {
                        _success($('#' + options.id)); //参数为modal对象
                    }

                    //关闭遮罩层
                    if (ajaxOptions.layer && _layer) {
                        _layer.close();
                    }
                });

            } else {//同步
                //默认业务逻辑成功处理
                newContent = data;

                //关闭遮罩层
                if (ajaxOptions.layer && _layer) {
                    _layer.close();
                }
            }
        };

        if (ajaxOptions.beforeSend && !ajaxOptions.beforeSend()) {
            return false;
        }

        $.ajax(ajaxOptions);

        return $(newContent);
    };

    /**
     * 创建模态框header
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalHeader = function (options) {
        if (options.header) {
            var $header = $('<div class="modal-header"></div>');
            var $title = $('<h4 class="modal-title"></h4>');
            $title.append(options.title);
            $title.prop('id', options.id + '_title');

            $header.append($title);
            return $header;
        }
    };

    /**
     * 创建模态框body
     * @param options
     * @private
     */
    var _createModalBody = function (options) {
        var $body = $('<div class="modal-body"></div>');
        var $content = '';

        if (typeof options.content === 'function') {
            $content = options.content.call(this);
        } else if (typeof options.content === 'string') {
            $content = options.content;
        } else if (!(options.content instanceof Array) && options.content instanceof Object) {
            $content = _createDynamicContent(options, $body);
        }

        return $body.append($content);
    };

    /**
     * 设置模态框body
     * @param options
     * @param content
     * @private
     */
    var _setModalBody = function (options, content) {
        var $body = $('#' + options.id).find('.modal-body');
        $body.append($(content));
    };

    /**
     * 创建模态框footer
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalFooter = function (options) {
        if (!options.footer) {
            return $('');
        }
        var $footer = $('<div class="modal-footer"></div>');

        if (options.buttons === 'false') {
            return $footer;
        } else if (options.buttons instanceof Array) {
            $.each(options.buttons, function (index, item) {
                var $btn = $('<button type="button" class="btn"></button>');
                $btn.html(item.label);
                $btn.addClass(item.cssClass);
                if (item.hotKey === 'cancel') {
                    $btn.attr('data-dismiss', 'modal');
                }
                $btn.click(function () {
                    if (item.action instanceof Function) {
                        item.action($('#' + options.id));
                    }
                });
                $footer.append($btn);
            });
        }

        return $footer;
    };

    /**
     * 弹出模态框
     * @param options
     * @returns {*}
     * @private
     */
    var _show = function (options) {
        var _modal;
        var tempSettings = {};
        tempSettings = $.extend(true, tempSettings, settings); //防止多次调用修改默认参数
        tempSettings.remote = true;
        options = $.extend(tempSettings, options);

        options.id = $.jkj.util.random.getLongDateString(); //生成随机id

        //拼接modal html
        var $content = _createModalContent(options)
            .append(_createModalHeader(options))
            .append(_createModalBody(options))
            .append(_createModalFooter(options));

        var $modal = _createModal(options)
            .append(_createModalDialog(options)
                .append($content));

        _modal = $modal.modal(options);
        modals.push(_modal);

        _handleModalEvents(options, $modal);

        return _modal;
    };

    /**
     * 弹出本地模态框
     * @param element
     * @param options
     * @returns {*|jQuery}
     * @private
     */
    var _showLocalModal = function (element, options) {
        var _modal;
        var tempSettings = {};
        tempSettings = $.extend(true, tempSettings, settings); //防止多次调用修改默认参数
        options = $.extend(tempSettings, options);
        _modal = $(element).modal(options);
        return _modal;
    };

    /**
     * 确认弹出框
     * @param message
     * @param ok
     * @param cancel
     * @private
     */
    function _confirm(message, ok, cancel) {
        return _show({
            title: '操作提示',
            width: '450px',
            content: message,
            buttons: [
                {
                    label: '取消', //按钮文本
                    cssClass: 'btn-cancel', //按钮额外class
                    hotKey: 'cancel', //按钮逻辑类型，取消逻辑(cancel)，
                    action: function (modal) { //按钮点击回调
                        if (cancel instanceof Function) {
                            cancel();
                        }
                    }
                },
                {
                    label: '确定', //按钮文本
                    cssClass: 'btn-primary', //按钮额外class
                    hotKey: 'cancel', //按钮逻辑类型，取消逻辑(cancel)，
                    action: function (modal) { //按钮点击回调
                        if (ok instanceof Function) {
                            ok();
                        }
                    }
                }
            ]
        });
    }

    /**
     * 监听modal事件
     * @param modal
     * @param options
     * @private
     */
    var _handleModalEvents = function (options, modal) {

        //监听模态框完全关闭事件
        $(modal).on('hidden.bs.modal', function (event) {
            $(modal).remove();
        });

        //监听模态框展示完成事件
        $(modal).on('shown.bs.modal', function () {
            if (!options.async) { //同步
                //逻辑成功处理回调
                var _success = options.content.success;
                if (typeof _success === 'function') {
                    _success($('#' + options.id)); //参数为modal对象
                }
            }
        });
    };

    /**
     * 关闭模态框
     * @param element 为空则关闭所有本控件弹出的模态框
     * @private
     */
    var _hide = function (element) {
        if (element === undefined || element == null) {
            //关闭所有模态框
            $.each(modals, function (index, item) {
                $(item).modal('hide');
            });
        } else {
            $(element).modal('hide');
        }

    };

    return {
        show: function (options) {
            return _show(options);
        },
        showLocalModal: function (element, options) {
            return _showLocalModal(element, options);
        },
        confirm: function (message, ok, cancel) {
            return _confirm(message, ok, cancel);
        },
        hide: function (element) {
            _hide(element);
        }
    };
}();
/*! notify 通知
 *  基于bootstrap-notify封装的通知
 * showWindow: self当前页面；parent父页面；top顶级页面；opener打开的页面
 */
$.jkj.notify={
	_init:function(content,options,showWindow){
		var myNotify,notify,settings;
		
		if(!$.notify){
			throw new Error('$.jkj.notify 依赖 bootstrap-notify');
		}
		
		settings={
			offset: {
				x: 15,
				y:5
			},
			spacing: 2,
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-dismissible" role="alert">' +
						'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
						'<span data-notify="icon"></span> ' +
						'<span data-notify="title">{1}</span> ' +
						'<span data-notify="message">{2}</span>' +
						'<div class="progress" data-notify="progressbar">' +
							'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
						'</div>' +
						'<a href="{3}" target="{4}" data-notify="url"></a>' +
					  '</div>'
		};
		notify=$.notify;
		if(showWindow!=='self'){
			if(showWindow==='parent'){
				if(window.parent!==window.self){
					notify=window.parent.window.$.notify;
				}
			}
			else if(showWindow==='top'){
				if(window.top!==window.self){
					notify=window.top.window.$.notify;
				}
			}
			else if(showWindow==='opener'){
				if(window.top===window.self&&window.opener!=null){
					notify=window.opener.window.$.notify;
				}
			}
		}
		options=$.extend(true, settings, options);
		myNotify=notify(content,options);
		
		return myNotify;
	},
	showError:function(content, options, showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'danger',
			delay: 0
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	},
	showInfo:function(content, options, showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'info',
			delay: 3000
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	},
	showSuccess:function(content, options, showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'success',
			delay: 3000
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	},
	showWarning:function(content,options,showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'warning'
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	}
};

/*! richNavTabs 富导航标签组件。 
 *  主要用来标签导航、页面切换、新增标签、关闭标签。
 */
$.jkj.richNavTabs=function(options){
	var appData, _richNavTabs, richNavTabs;
	
	appData = $.jkj.data.app;
	appData.richNavTabs = appData.richNavTabs||[];
	_richNavTabs=function(options){
		this.infos = {
			/*! navTabs对象数组的对象结构含义：
			*	id：标签唯一标识
			*	title：标签标题
			* 	fullTitle：标签完整标题
			*	pageType：标签类型：page网页；content嵌入式内容
			* 	src： 如果标签类型是page有效；作为iframe的src
			*	contentHandle：如果标签类型是content有效；用于获取嵌入式内容
			* 	closeHandle：关闭标签之后执行
			*	previousTabId：前一个显示的标签页
			*   firstDisplay: 此tab第一次显示
			*/
			navTabs: []
		};
		this.options = $.extend(true, this.core.settings, options||{});
		this.id = this.options.id;
		this.$elem = null;
		this.currentTabId = null;
		this.navTabsCount = function(){
			return this.infos.navTabs.length;
		};
	};
	
	_richNavTabs.prototype.core={
		// 默认配置
		settings: {
			id: "#pageTabs",
			// 默认显示的tab
			showNavTab: null,
			// 后退按钮
			backward: ".nav-control-backward",
			// 前进按钮
			forward: ".nav-control-forward",
			// 是否可以隐藏后退/前进按钮
			canHidenNavControl: false,
			// 标签滚动轴class
			tabsScroll: ".nav-tabs-wrapper",
			// 去除页高，为了动态计算内容页的高度
			subHeight: 77,
			// 是否浏览器大小改变自适应
			windowResize: true,
			// 排序的处理方法
			sortHandle: null
		},
		// 涉及的元素模板
		templates:{
			init:function(){
				var html = [];
				
				html.push('<section class="content-header">');
				html.push('	<div class="navbar nav-control nav-control-backward">');
				html.push('		<span class="glyphicon glyphicon-step-backward"></span>');
				html.push('	</div>');
				html.push('	<div class="navbar nav-control nav-control-forward">');
				html.push('		<span class="glyphicon glyphicon-step-forward"></span>');
				html.push('	</div>');
				html.push('	<!-- Nav tabs -->');
				html.push('	<div class="nav-tabs-wrapper">');
				html.push('		<ul class="nav nav-tabs">');
				html.push('		</ul>');
				html.push('	</div>');
				html.push('</section>');
				html.push('<section class="content">');
				html.push('	<!-- Tab panes -->');
				html.push('	<div class="tab-content">');
				html.push('	</div>');
				html.push('</section>');
				
				return html.join('\n');
			},
			navTab:function(item){
				var html = [], aPreTag;
				
				html.push('<li>');
				aPreTag = '	<a href="#'+ item.id +'" ';
				if(item.fullTitle.length>0){
					aPreTag+=' title="'+item.fullTitle+'" ';
				}
				aPreTag+=' data-pageType="'+item.pageType+'" ';
				if(item.pageType==='page'){
					aPreTag+=' data-src="'+item.src+'" ';
				}
				else{
					aPreTag+=' data-contentHandle="'+item.contentHandle+'" ';
				}
				aPreTag+=' data-toggle="tab">';
				html.push(aPreTag);
				html.push('  		<span>'+ item.title+'</span>');
				if(item.canClose){
					html.push('  		<span class="nav-tabs-close fa fa-close"></span>');
				}
				html.push(' 	</a>');
				html.push('</li>');
				
				return html.join('\n');
			},
			tabContent:function(id){
				var html = [];
				
				html.push('<div class="tab-pane" id="'+ id +'">');
				html.push('</div>');
				
				return html.join('\n');
			},
			iframe:function(id, src){
				var html = [];
				
				html.push('<iframe id="frame-'+ id +'" src="'+ src +'" border="0" marginheight="0" ');
				html.push('		marginwidth="0" frameborder="0" align=left style="width: 100%; height:100%; margin:0; padding: 0;">');
				html.push('</iframe>');
				
				return html.join('\n');
			},
			contextMenu:function(){
				var html = [];
				
				html.push('<div class="contextMenu">');
				html.push('	<ul>');
				html.push('		<li id="close">关闭</li>');
				html.push('		<li id="closeOthers">关闭其他</li>');
				html.push('		<li id="closeAll">全部关闭</li>');
				html.push('		<li id="refresh">刷新</li>');
				html.push('	</ul>');
				html.push('</div>');
				
				return html.join('\n');
			}
		},
		//关闭当前导航标签
		closeNavTab: function(e, currentRichNavTabs){
			var id, core, infos, opts, navTabInfo, currentDisplayTabId, previousTabId;
	    	
	    	core = currentRichNavTabs.core;
	    	infos = currentRichNavTabs.infos;
	    	opts = currentRichNavTabs.options;
		    id=$.trim($(this).parent().attr('href')).replace('#','');
		    navTabInfo = core.getNavTabInfo(id, infos.navTabs);
		    currentDisplayTabId = currentRichNavTabs.currentTabId;
		    previousTabId = navTabInfo.item.previousTabId;
		    currentRichNavTabs.removeNavTab(id);
		    if(previousTabId != null && core.getNavTabInfo(previousTabId, infos.navTabs)){
		    	currentRichNavTabs.displayNavTabById(previousTabId);
		    }
		    else{
		    	currentRichNavTabs.displayDefaultNavTab(opts);
		    }
		    if(currentDisplayTabId === previousTabId){
		    	core.setScrollLeft(currentRichNavTabs);
		    }
		},
		//从infos.navTabs获取导航标签信息
		getNavTabInfo: function(id, navTabs){
			var info=null;
			
			$.each(navTabs, function(i, item) {
				if(item.id===id){
					info = {};
					info.index = i;
					info.item = item;
					return false;
				}
			});
			
			return info;
		},
		//获取导航标签的宽度
		getNavTabsWidth: function($elem){
			return $elem.find('.nav-tabs').width();
		},
		//获取导航标签外壳的滚动轴左移长度
		getTabsScrollLeftLength: function($elem, options){
			return $elem.find(options.tabsScroll).scrollLeft();
		},
		//获取导航标签外壳的宽度
		getTabsScrollWidth: function($elem, options){
			return $elem.find(options.tabsScroll).width();
		},
		//后退和前进控制移动滚动轴
		moveScroll: function($elem, action, infos, options){
			var  currentScrollLeft, scrollLeft, moveWidth, navTabsWidth, tabsScrollWidth; 
			var maxLength;
			var $backward, $forward, $tabsScroll;
			
			currentScrollLeft = this.getTabsScrollLeftLength($elem, options);
			navTabsWidth = this.getNavTabsWidth($elem);
			tabsScrollWidth = this.getTabsScrollWidth($elem, options);
			moveWidth = tabsScrollWidth/4;
			maxLength = navTabsWidth-tabsScrollWidth;
			$backward= $(options.id + ' ' + options.backward);
			$forward = $(options.id + ' ' + options.forward);
			$tabsScroll = $(options.id + ' ' + options.tabsScroll);
			
			if(action==='backward'){
				scrollLeft = currentScrollLeft- moveWidth;
				scrollLeft = scrollLeft<0 ? 0 : scrollLeft;
			}
			else if(action==='forward'){
				scrollLeft = currentScrollLeft + moveWidth;
				scrollLeft = scrollLeft > maxLength ? maxLength : scrollLeft;
			}
			this.toggleNavControl($elem, options, scrollLeft, maxLength);
			$tabsScroll.scrollLeft(scrollLeft);
		},
		//当前导航标签的标签页显示时执行操作
		navTabShownHanddle:function(e, currentRichNavTabs){
			var id, core, infos, navTabInfo;
	    	
	    	core = currentRichNavTabs.core;
	    	infos = currentRichNavTabs.infos;
	    	id = $.trim($(e.target).attr('href')).replace('#','');
	    	navTabInfo = core.getNavTabInfo(id, infos.navTabs);
	    	currentRichNavTabs.currentTabId = id;
	    	if(e.relatedTarget !== undefined){
	    		navTabInfo.item.previousTabId = $.trim($(e.relatedTarget).attr('href')).replace('#','');
	    	}
	    	if(navTabInfo.item.pageType==='page'){
	    		if(navTabInfo.item.firstDisplay){
	    			navTabInfo.item.firstDisplay = false;
	    		}else{
	    			//var overflowX;
					var $frame=currentRichNavTabs.$elem.find('.tab-content').find('#frame-'+id);
			    	if($frame){
				    	//overflowX = $($frame[0].contentDocument.body).css('overflow-x');
				    	$($frame[0].contentDocument.body).css('overflow-x','');
				    	setTimeout(function(){
			    			$($frame[0].contentDocument.body).css('overflow-x','auto');
				    	},10)
			    	}
	    		}
	    	}
	    	core.setScrollLeft(currentRichNavTabs);
		},
		//重置tab-pane高度
		resize:function($elem, options){
			var headerOuterHeight,richNavTabsOuterHeight,richNavTabsHeight, richNavTabsMinHeight,windowHeight;
			
			if(options.windowResize){
				headerOuterHeight=$elem.find('.content-header').outerHeight();
				richNavTabsOuterHeight=$elem.outerHeight();
				richNavTabsHeight=$elem.height();
				richNavTabsMinHeight= parseInt(($elem.css('height')||'0').replace('px',''));
				windowHeight=$(window).height();
				$elem.find('.tab-content,.tab-content .tab-pane, .tab-content .tab-pane iframe')
					.css('height', windowHeight-options.subHeight);
			}
		},
		//设置导航标签外壳的滚动轴左移长度
		setScrollLeft:function(currentRichNavTabs){
			var core, infos, opts, navTabInfo, scrollLeft, navTabsWidth, tabsScrollWidth, maxLength;
			var $elem, $tabsScroll;
			
			core = currentRichNavTabs.core;
	    	infos = currentRichNavTabs.infos;
	    	opts = currentRichNavTabs.options;
	    	$elem = currentRichNavTabs.$elem;
	    	navTabInfo = core.getNavTabInfo(currentRichNavTabs.currentTabId, infos.navTabs);
	    	navTabsWidth = this.getNavTabsWidth($elem);
	    	tabsScrollWidth = core.getTabsScrollWidth($elem, opts);
	    	maxLength = navTabsWidth-tabsScrollWidth;
	    	if(maxLength>0){
	    		$tabsScroll = $(opts.id + ' ' + opts.tabsScroll);
		    	scrollLeft = $(opts.id + ' .nav-tabs li:eq(' + navTabInfo.index + ')').offset().left - $(opts.id + ' .nav-tabs li:eq(0)').offset().left;
		    	scrollLeft = scrollLeft < 0 ? 0:scrollLeft;
		    	scrollLeft = scrollLeft > maxLength ? maxLength:scrollLeft; 
	    		$tabsScroll.scrollLeft(scrollLeft);
	    	}
			core.toggleNavControl($elem, opts, scrollLeft, maxLength);
		},
		//切换导航滚动按钮显示
		toggleNavControl: function($elem, options, scrollLeft, maxLength){
			var $backward, $forward;
			
			$backward= $elem.find(options.backward);
			$forward = $elem.find(options.forward);
			if(maxLength>0){
				if(options.canHidenNavControl){
					if(scrollLeft===0){
						$backward.hide();
					}
					else{
						$backward.show();
					}		
					if(scrollLeft===maxLength){
						$forward.css('visibility','hidden');
						$forward.show();
					}
					else{
						$forward.css('visibility','visible');
						$forward.show();
					}
				}else{
					$backward.show();
					$forward.show();
				}
			}
			else{
				$backward.hide();
				$forward.hide();
			}
		},
		//切换上下文菜单显示
		toggleContextMenu:function(e, currentRichNavTabs){
			var core, infos, options, firstInited, tabId, navTabInfo;
			var $elem, $contextMenu;
			
			core = currentRichNavTabs.core;
			infos = currentRichNavTabs.infos;
			options = currentRichNavTabs.options;
			tabId = $.trim($(this).attr('href')).replace('#','');
			navTabInfo = core.getNavTabInfo(tabId,infos.navTabs);
			$elem = currentRichNavTabs.$elem;
			if($elem.find('.contextMenu').length===0){
				$elem.append(core.templates.contextMenu());
				firstInited = true;
			}
			$contextMenu = $elem.find('.contextMenu');
			$contextMenu.attr('data-tabId',tabId);
			if(firstInited){
				$contextMenu.bind('mouseleave',function(e){
					e.preventDefault();
					$(this).hide();
					$contextMenu.css('left', -500).css('top',-500);
				});
				$contextMenu.find('#close').click(function(e){
					var tabId;
					
					e.preventDefault();
					$contextMenu.hide();
					tabId = $contextMenu.attr('data-tabId');
					currentRichNavTabs.removeNavTab(tabId);
				});
				$contextMenu.find('#closeOthers').click(function(e){
					var tabId = $contextMenu.attr('data-tabId');
					
					e.preventDefault();
					$contextMenu.hide();
					currentRichNavTabs.removeOthersNavTab(tabId);
				});
				$contextMenu.find('#closeAll').click(function(e){
					e.preventDefault();
					$contextMenu.hide();
					currentRichNavTabs.removeAllNavTab();
				});
				$contextMenu.find('#refresh').click(function(e){
					var tabId = $contextMenu.attr('data-tabId');
					
					e.preventDefault();
					$contextMenu.hide();
					currentRichNavTabs.refreshNavTab(tabId);
				});
			}
			if(navTabInfo.item.canClose){
				$contextMenu.find('#close, #closeOthers').show();
			}else{
				$contextMenu.find('#close, #closeOthers').hide();
			}
			$contextMenu.css('left', e.pageX + 2).css('top',e.pageY + 2);
			$contextMenu.show();
			$contextMenu.focus();
		}
	};
	//添加导航标签页
	_richNavTabs.prototype.addNavTab=function(id, title, pageType, typeValue, canClose, fullTitle, closeHandle){
		var currentRichNavTabs, that, core, opts, infos, tabInfo, templates;
		var $elem, $navTabs, $tabContent;
		
		if(typeof canClose !=='boolean'){
	    	canClose=true;
	    }
		if(typeof fullTitle !=='string'){
	    	fullTitle='';
	   }
		currentRichNavTabs = that = this;
		core = that.core;
		opts = that.options;
		infos = that.infos;
		$elem = this.$elem;
		
		if(core.getNavTabInfo(id, infos.navTabs)==null){
			tabInfo ={};
			templates = core.templates;
			$navTabs = $elem.find('.nav-tabs');
			$tabContent = $elem.find('.tab-content');
			
			tabInfo.id = id;
			tabInfo.title = title;
			tabInfo.fullTitle = fullTitle;
			tabInfo.pageType = pageType;
			if(pageType==='page'){
				tabInfo.src = typeValue;
			}else{
				tabInfo.contentHandle = typeValue;
			}
			tabInfo.canClose = canClose;
			tabInfo.closeHandle = closeHandle;
			tabInfo.previousTabId = null;
			tabInfo.firstDisplay = true;
			$navTabs.append(templates.navTab(tabInfo));
			if(pageType==='page'){
				$tabContent.append($(templates.tabContent(id)).append(templates.iframe(id, typeValue)));
			}
			else{
				if(typeValue.length>0){
					$tabContent.append($(templates.tabContent(id)).append(window[typeValue]()));
				}
				else{
					$tabContent.append($(templates.tabContent(id)));
				}
			}
			infos.navTabs.push(tabInfo);
		    $elem.find('.nav-tabs li:last a[data-toggle="tab"]').tab('show');
		}
		else{
			this.displayNavTabById(id);
		}
		core.resize($elem, opts);
	};
	//显示默认的导航标签页
	_richNavTabs.prototype.displayDefaultNavTab=function(options){
		var $elem;
		
		$elem = this.$elem;
		if(options.showNavTab==null){
			$elem.find('.nav-tabs li:eq(0) a').tab('show');
		}
	    else{
	    	$elem.find(options.showTab).tab('show');
	    }
	};
	//根据标签页id显示导航标签页
	_richNavTabs.prototype.displayNavTabById= function(navTabId){
		var $elem;
		
		$elem = this.$elem;
		$elem.find('.nav-tabs a[href="#'+ navTabId +'"]').tab('show');
	};
	//刷新指定标签页
	_richNavTabs.prototype.refreshNavTab=function(id){
		var that, core, opts, infos, item, navTabInfo;
		var $elem, $tabContent;
		
		that = this;
		core = this.core;
		opts = this.options;
		infos = this.infos;
		$elem = this.$elem;
		$tabContent=$elem.find('.tab-content');
		navTabInfo = core.getNavTabInfo(id,infos.navTabs);
		item = navTabInfo.item;
		if(item.pageType === 'page'){
			var $iframe;
			
			$iframe = $tabContent.find('#frame-'+item.id);
			$iframe.attr('src',item.src);
		}
		else{
			var $tabPane;
			
			$tabPane = $tabContent.find('#'+item.id);
			$tabPane.empty();
			if(typeof item.contentHandle ==='string' && item.contentHandle.length>0){
				$tabPane.append(window[item.contentHandle]());
			}
		}
	};
	//移除指定导航标签页
	_richNavTabs.prototype.removeNavTab=function(id){
		var that, core, opts, infos, navTabInfo;
		var $elem, $navTabs, $tabContent;
		
		that = this;
		core = that.core;
		opts = that.options;
		infos = that.infos;
		$elem = this.$elem;
		$navTabs=$elem.find('.nav-tabs');
		$tabContent=$elem.find('.tab-content');
		navTabInfo = core.getNavTabInfo(id,infos.navTabs);
		if(navTabInfo!=null){
			infos.navTabs.splice(navTabInfo.index, 1);
			$navTabs.find('a[href="#'+id+'"]').parent().remove();
			$tabContent.find('#'+id).remove();
			if(navTabInfo.item.closeHandle && typeof(navTabInfo.item.closeHandle)==='function'){
				navTabInfo.item.closeHandle.call(this);
			}
		}
	};
	//移除所有导航标签页
	_richNavTabs.prototype.removeAllNavTab=function(){
		var that, core, opts, infos, removeItems;
		var $elem, $navTabs, $tabContent;
		
		that = this;
		core = this.core;
		opts = this.options;
		infos = this.infos;
		removeItems = [];
		$elem = this.$elem;
		$navTabs=$elem.find('.nav-tabs');
		$tabContent=$elem.find('.tab-content');
		
		infos.navTabs=$.grep(infos.navTabs,function(item, i){
			if(item.canClose){
				removeItems.push(item);
				return false;
			}
			return true;
		});
		$.each(removeItems, function(i, item){
			$navTabs.find('a[href="#'+item.id+'"]').parent().remove();
			$tabContent.find('#'+item.id).remove();
		});
		this.displayDefaultNavTab(opts);
	};
	//移除除当前和默认的其他的导航标签页
	_richNavTabs.prototype.removeOthersNavTab=function(id){
		var that, core, opts, infos, removeItems;
		var $elem, $navTabs, $tabContent;
		
		that = this;
		core = this.core;
		opts = this.options;
		infos = this.infos;
		removeItems = [];
		$elem = this.$elem;
		$navTabs=$elem.find('.nav-tabs');
		$tabContent=$elem.find('.tab-content');
		
		infos.navTabs=$.grep(infos.navTabs,function(item, i){
			if(item.canClose && item.id!=id){
				removeItems.push(item);
				return false;
			}
			return true;
		});
		$.each(removeItems, function(i, item){
			$navTabs.find('a[href="#'+item.id+'"]').parent().remove();
			$tabContent.find('#'+item.id).remove();
		});
		this.displayNavTabById(id);
	};
	//初始化富导航标签
	_richNavTabs.prototype.init=function(){
		var currentRichNavTabs, that, core, opts, infos;
		var $elem, $backward, $forward;
		
		currentRichNavTabs = that = this;
		core = this.core;
		opts = this.options;
		infos = this.infos;
		$elem = this.$elem = $(opts.id);
		$elem.addClass('richNavTabs');
		$elem.append(core.templates.init());
		$backward = $elem .find(opts.backward);
		$forward = $elem .find(opts.forward);
		
		//给当前元素添加richNavTabs扩展对象
		$elem.init.prototype.richNavTabs = currentRichNavTabs;
		//导航标签点击事件
		$elem.find('.nav-tabs').on('contextmenu','li', function (e) {
		    if(e.which == 3){
		    	//右键事件
		    	return false;
		    }
	    });
		$elem.find('.nav-tabs').on('mousedown','a[data-toggle="tab"]', function (e) {
		    e.preventDefault();
		    if(e.which == 1){
		    	//左键事件
		    	$(this).tab('show');
		    }
		    else if(e.which == 3){
		    	//右键事件
		    	core.toggleContextMenu.call(this, e, currentRichNavTabs);
		    }
	    });
	    // 导航标签页被点击显示触发的事件
	    $elem.find('.nav-tabs').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	    	e.preventDefault();
	    	core.navTabShownHanddle.call(this, e, currentRichNavTabs);
		});
	    // 导航标签的关闭事件
	    $elem.find('.nav-tabs').on('click', '.nav-tabs-close',function (e) {
		    e.preventDefault();
	    	core.closeNavTab.call(this, e, currentRichNavTabs);
	    });
	    // 导航标签的双击关闭事件
	    $elem .find('.nav-tabs').on('dblclick', 'li',function (e) {
		    e.preventDefault();
		    $(this).find('.nav-tabs-close').click();
	    });
	    // 导航标签排序处理
	    if(opts.sortHandle){
	    	$elem .find('.nav-tabs')[opts.sortHandle]({
		    	axis: 'x',
		    	distance: 20,
		    	items: '> li',
		    	opacity: 0.6,
		    	scroll: false
		    });
	    }
	    //后退按钮点击事件
	    $backward.click(function(e){
	    	core.moveScroll($elem, 'backward', infos, opts);
	    });
	    //前进按钮点击事件
	    $forward.click(function(e){ 
	    	core.moveScroll($elem, 'forward', infos, opts);
	    });
	    $(window, opts.id).resize(function(){ 
	    	var currentScrollLeft,navTabsWidth,tabsScrollWidth,maxLength;
	    	
	    	currentScrollLeft = core.getTabsScrollLeftLength($elem, opts);
			navTabsWidth = core.getNavTabsWidth($elem);
			tabsScrollWidth = core.getTabsScrollWidth($elem, opts);
			maxLength = navTabsWidth-tabsScrollWidth;
	    	core.toggleNavControl($elem, opts, currentScrollLeft, maxLength);
			core.resize($elem, opts);
		});
		
		this.displayDefaultNavTab(opts); 
	};

	richNavTabs = new _richNavTabs(options);
	richNavTabs.init();
	appData.richNavTabs.push(richNavTabs);
	
	return richNavTabs;
};
//根据Id获取富导航标签对象
$.jkj.richNavTabs.get = function(id){
	var elements, element;
	
	elements = $.jkj.data.app.richNavTabs;
	$(elements).each(function(i, item){
		if(item.options.id === id){
			element = item;
			return false;
		}
	});
	
	return element;
};

$.jkj.select2 = {
	_init: function(element, options) {

		if($.fn.select2 === undefined || $.fn.select2 == null) {
			throw new Error('$.jkj.select2 init error');
		}

		var select2 = $(element).select2(options);
		return select2;
	},
	local: function(element, settings) {
		var options = {
			placeholder: "请选择",
			allowClear: true,
			language: "zh-CN",
			defaultSelected: false
		};

		$.extend(true, options, settings);
		var select2 = this._init(element, options);

		if(!options.defaultSelected) {
			select2.val(0).trigger("change");
		}

		return select2;
	},
	remote: function(element, settings) {

		var select2 = this._init(element, {});
		var url = settings.ajax.url;
		var extra = settings.ajax.extra;
		var success = settings.ajax.success;
		delete settings.ajax;

		$.getJSON(url, extra, function(data) {
			var options = {
				placeholder: "请选择",
				allowClear: true,
				language: "zh-CN",
				defaultSelected: false
			};

			$.extend(true, options, settings);
			options.data = data.list;
			select2.select2(options);

			if(!options.defaultSelected) {
				select2.val(0).trigger("change");
			}
			if($.isFunction(success)){
				success.call(this);
			}
		});

		return select2;
	},
	autocomplete: function(element, settings) {
		var options = {
			ajax: {
				url: "select2.json",
				dataType: 'json',
				delay: 300,
				extra: {},
				data: function(params) {
					var p = {};
					p[options.paramName] = params.term;

					if(options.pageable) {
						p.pageNumber = params.page || 1;
						p.pageSize = options.pageSize;
					}

					return p;
				},
				processResults: function(data, params) {
					var rlts = {};
					rlts.results = data.list;

					if(options.pageable) {
						params.page = params.page || 1;
						rlts.pagination = {};
						rlts.pagination.more = (params.page * data.page.pageSize) < data.page.total;
					}

					return rlts;
				},

				cache: true
			},
			escapeMarkup: function(markup) {
				return markup;
			},
			allowClear: true,
			pageable: false,
			language: "zh-CN",
			placeholder: "请选择",
			pageSize: 20,
			minimumInputLength: 1,
			maximumSelectionLength: 50,
			textFiled: "text",
			paramName: "search",
			formatResult: null,
			formatSelection: null,
			templateResult: function(repo) {
				if(repo.loading) {
					return "正在加载...";
				}

				if(!options.formatResult) {
					return repo[options.textFiled];
				}

				var r1 = options.formatResult.match(/{\w+}/g);
				var markup = options.formatResult;

				for(var i = 0; i < r1.length; i++) {
					markup = markup.replace(r1[i], repo[r1[i].substring(1, r1[i].length - 1)]);
				}

				return markup;
			},
			templateSelection: function(repo) {
				if(repo.id === '') {
					return repo.text;
				}

				if(!options.formatSelection) {
					return repo[options.textFiled];
				}
				
				var markup = typeof options.formatSelection === 'string' ? options.formatSelection : $.isFunction(options.formatSelection) ? options.formatSelection(repo):'';
				var r2 = markup.match(/{\w+}/g);

				for(var i = 0; i < r2.length; i++) {
					markup = markup.replace(r2[i], repo[r2[i].substring(1, r2[i].length - 1)]);
				}

				return markup;
			}
		};

		$.extend(true, options, settings);
		var select2 = this._init(element, options);
		return select2;
	}
};
$(function(){
	$(".sidebar-toggle").click(function(){
    	var isScale = $("body").hasClass("sidebar-collapse");
    	if(isScale){
    		$(this).find(".fa-caret-left").show();
    		$(this).find(".fa-caret-right").hide();
    		
    	}else{
    		$(this).find(".fa-caret-left").hide();
    		$(this).find(".fa-caret-right").show();
    	}
    });
});

//初始化待提交的表单
$.jkj.initForm = function(element) {
	//表单禁用回车
	$(element).find(':text').keydown(function(e) {
		var code = e.keyCode | e.charCode;
		if(code == 13) {
			e.preventDefault();
		}
	});
	//初始化输入验证
	$.jkj.validate(element, {
		submitHandler: function(form) {

		}
	});
};

$.jkj.submit = function(options) {
	"use strict";
	var settings = {
		//请求url
		url: '',
		//请求类型，默认为post
		type: 'post',
		//传参
		data: null,
		//回调中制定this的Object
		context: null,
		//成功回调
		success: function(data, textStatus, jqXHR) {
			var $context = $(this);
		},
		error: function(){
			$.jkj.notify.showError("服务器错误，请联系管理员", null, "self");
		},
		//请求完成事件，无论失败
		complete: function(XMLHttpRequest, textStatus) {
			var $context = $(this);
			if($context) {
				$context.button('reset');
				formLayer.close();
			}
		}
	},
	formLayer;	
	var $form = $(options.form);
	//验证
	if(options.validate && !$form.valid()){
		return false;
	}
	var beforeSend = options.beforeSend;
	if(beforeSend && beforeSend()===false){
		return false;
	}
	formLayer = $.jkj.layer.loading("保存中...");	
	var btn = options.btn;
	if($(btn).attr("data-loading-text") === undefined) {
		$(btn).attr("data-loading-text", $(btn).html() + "中");
	}
	$(btn).button('loading');
	settings.url = $form.attr("action");
	settings.context = btn;
	settings.data = $form.serializeArray();
	if(options.callback){
		settings.success = options.callback;
	}
	//请求处理
	$.ajax(settings);
};

$.fn.jkjSubmit = function(options){
	options.form = this;
	$.jkj.submit(options);
};

/*! tree 树
 *  基于jstree封装的树
 *  https://www.jstree.com/
 *  https://www.gitbook.com/book/viky-zhang/jstree-doc/details
 */
$.jkj.tree = function (element, options) {
    var settings;

    settings = {
        //存储核心功能的所有默认配置。
        core: {
            themes: {
                responsive: false //boolean（默认false），是否使用主题的响应式状态（遇到小屏设备时）。
            },
            // data:[], //数据,可以是html,json,direct data,function
            strings: {
                'Loading ...': '加载中 ...',
                'New node': '新增节点'
            },
            check_callback: false, //当用户想修改树的结构时，此参数用于决定是否允许修改 或 如何修改
            error: function (err) { //出错时（树操作被阻止、AJAX 失败等）的回调函数。 此回调函数将接收一个参数。
                if (console) {
                    console.log(err);
                }
            },
            animation: 200, //打开、折叠时的动画过渡时间。默认：200，false：禁用动画过渡，数字：单位 毫秒
            multiple: true, //是否允许节点多选
            expand_selected_onload: true, //boolean，决定是否在加载树时打开所有选中的节点。
            worker: true, //默认true。当为true时，将尽可能使用 web worker 来解释接收到的 JSON 数据， 这样的好处是有较大的请求时，不容易使 UI 变卡顿。
            force_text: false, //boolean（默认false），强制将节点的 text 值解释为纯文本。
            dblclick_toggle: true //boolean（默认true），双击节点名时是否选择（toggled）节点。
        },
        //types插件配置
        types: {
            'default': {
                icon: 'fa fa-folder icon-state-warning icon-lg'
            },
            file: {
                icon: 'fa fa-file icon-state-warning icon-lg'
            }
        },
        // search 插件
        search: {
            fuzzy: false, //模糊搜索
            case_sensitive: false, //是否区分大小写
            show_only_matches: true, //仅显示匹配结果
            show_only_matches_children: true, //是否显示匹配节点子节点
            close_opened_onclear: true, //清空搜索的时候关闭上次打开的节点
            search_leaves_only: false //设置是否仅搜索叶子节点
        },
        //contextmenu 右键菜单
        contextmenu: {
            items: function (o, cb) { // Could be an object directly
                var _items = $.jstree.defaults.contextmenu.items();
                _items.rename.label = '修改';
                _items.create.label = '新增';
                _items.remove.label = '删除';
                _items.ccp.label = '编辑';
                _items.ccp.submenu.copy.label = '复制';
                _items.ccp.submenu.cut.label = '剪切';
                _items.ccp.submenu.paste.label = '粘贴';
                return _items;
            }
        },
        plugins: [ //插件
            // "checkbox", //勾选框插件
            // "contextmenu", //右键菜单插件
            // "dnd",  //拖放插件
            // "massload", //惯性加载插件
            // "search", //搜索插件
            // "sort", //排序插件
            // "state", //状态插件
            "types", //类型插件
            // "unique", //唯一性插件
            // "wholerow", //整行插件
            // "changed",  //变化插件
            // "conditionalselect" //条件选择插件
        ]
    };

    options = $.extend(true, settings, options);
    $(element).jstree(options);
};
/*! treeTable 树表格
 *  基于jquery-treeTable封装的树表格
 *  http://ludo.cubicphuse.nl/jquery-treetable/
 */
$.jkj.treeTable = function (element, options) {
    var _table, settings;

    settings = {
        branchAttr: 'ttBranch', //可选的数据属性，可用于强制在节点上呈现扩展图标。这使得我们可以定义一个节点作为一个分支节点，即使它还没有孩子。这意味着data-tt-branch属性在您的HTML。
        clickableNodeNames: false, //名称被点击时扩展分支
        column: 0, //第几列显示为树形结构
        columnElType: 'td', //树的最小单元
        expandable: true, //树是否可以扩展分支
        expanderTemplate: '<a href="#">&nbsp;</a>', //扩展按钮html
        indent: '19', //每层分支缩进的像素
        indenterTemplate: '<span class="indenter"></span>', //缩进html
        initialState: 'collapsed', //初始化展开控件样式,默认关闭
        nodeIdAttr:'ttId', //id,html标签格式
        parentIdAttr:'ttParentId', //parentId,html标签格式
        stringCollapse: '关闭', //关闭提示文字
        stringExpand: '展开' //展开提示文字
    };

    options = $.extend(true, settings, options);

    _table = $(element).treetable(options);
    return _table;
};
/*!
 * 扩展jquery获取表单序列化参数对象
 */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.jkj.upload = function(obj, options) {
	"use strict";
	String.prototype.repl = function(from, to) {
		return this.split(from).join(to);
	};
	var id = $(obj).attr('id');
	var aEditBtn = "<a class='btn btn-primary' id='"+id+"-file-edit' href='javascript:void(0)'>编辑</a>";
	if(options.permissionCode != '' && options.permissionCode != undefined){
		aEditBtn = '';
	}
	var PREVIEW_TAB = "<div class='form-title'>{title}<label class='right'>" + aEditBtn + "</label></div>" +
			"<div class='tabbable'><ul class='nav nav-tabs'>{tabItem}</ul><div class='tab-content'>" +
			"<input type='hidden' name='fileIds' value=''>{tabContent}</div></div>",
		UPLOAD_BTN = "<a class='btn btn-primary' id='"+id+"-file-upload' href='javascript:void(0)'>上传附件</a>",
		SUBMIT_BTN = "<div class='btn-submit'><button type='button' class='btn btn-cancel btn-font4'>取消</button>" +
			"<button type='button' class='btn btn-confirm btn-font4' style=''>保存</button></div>",
		FILE_ITEM = "<li style='float: left; margin-left: 15px; text-align: center' class='upload'>" +
			"<a href='{downloadUrl}' target='_blank' class='{uploadClass}'>" +
			"<label title='{filename}'>{filename}</label>" +
			"<span data-fileType={fileType} data-fileId={fileId} {styleDisble}></span></a>" +
			"<mark class='bg-green'>传</mark></li>",
		UPLOAD_MODAL = "<div class='modal fade fileupload' id='"+id+"-uploadModal' tabindex='-1' role='dialog' " +
		"aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' style='width: 845px;'>" +
		"<div class='modal-content'>" +
		"<div class='modal-header mhd-layer-header'><button class='close' aria-hidden='true' type='button' data-dismiss='modal'>×</button>" +
		"<h4 class='modal-title mhd-layer-title'>上传文件</h4></div><div class='modal-body'><div class='mhd-layer-body'>" +
		"文件类型：<select class='form-control' id='"+id+"-selectFileType'>{selectObj}</select>" +
		"<form enctype='multipart/form-data'><input class='file' name='files' type='file' multiple style='width: 300px;'>" +
		"</form></div></div></div></div></div>",
		defaultSettings = {
			//上传地址
			fileServerUrl: "",
			//总共上传大小单位m
			maxTotalSize: 200,
			//加载已上传文件
			files: {},
			//文件tab页信息
			tabs: null,
			//已上传文件删除事件
			removeFile: function(e) {
				e.preventDefault();
				var fileType = $(this).attr("data-fileType");
				var fileCount = $("#"+id+"-fileCount_" + fileType).html();
				$("#"+id+"-fileCount_" + fileType).html(fileCount-1);
				var $fileIdInput = $(_obj).find(".tab-content input");
				$fileIdInput.val($fileIdInput.val().repl("," + $(this).attr("data-fileId"), ""));
				$(this).closest("li").remove();
			},
			//保存文件事件
			saveFile: function() {

			},
			//取消保存文件事件
			cancle: function() {

			},
			//上传组件国际化，默认中文
			language: "zh",
			//达到最大限制时是否自动替换
			autoReplace: false,
			layoutTemplates: {
				footer: '<div class="file-thumbnail-footer"><div class="file-footer-caption">{caption}</div>{actions}</div>',
				actions: '<div class="file-actions">\n' +
		        '    <div class="file-footer-buttons">\n' +
		        '        {upload} {delete} {zoom} {other}' +
		        '    </div>\n' +
		        '    {drag}\n' +
		        '    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
		        '    <div class="clearfix"></div>\n' +
		        '</div>'
			},
			allowedPreviewTypes: [],
			previewFileIcon: '<div class="upload"><i class="" style="height:auto;"></i></div>',
			//文件预览样式		
			previewFileIconSettings: {
				'pdf': '<div class="upload"><i class="upload-pdf" style="height:auto;"></i></div>',
			    'doc': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
			    'docx': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
			    'xls': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
			    'xlsx': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
			    'ppt': '<div class="upload"><i class="upload-ppt" style="height:auto;"></i></div>',
			    'jpg': '<div class="upload"><i class="upload-jpg" style="height:auto;"></i></div>',
			    'png': '<div class="upload"><i class="upload-png" style="height:auto;"></i></div>'
			},
			fileActionSettings: {
				 showUpload: false,
				 showZoom: false,
				 showDrag: false
			},
			//是否同步上传，默认为异步
			uploadAsync: false,
			//是否显示文件标题，默认为true
			showCaption: true,
			//是否显示预览，默认为true
			showPreview: true,
			//是否显示移除按钮，默认为true
			showRemove: true,
			//是否显示上传按钮，默认为true
			showUpload: true,
			//允许点击窗口选择文件，默认false
			browseOnZoneClick: true,
			//最小上传大小
			minFileSize: 0,
			//最大上传大小
			maxFileSize: 10240,
			//最小上传个数
			minFileCount: 0,
			//最大上传个数
			maxFileCount: 20,
			//100m
			maxFilePreviewSize: 102400,
			//允许上传的文件类型
			allowedFileTypes: ["image", "html", "text", "video", "audio", "flash", "object"],
			//允许上传的文件扩展名
			allowedFileExtensions: [],
			ajaxSettings: {
			},
			//额外参数的关键点
            uploadExtraData: function() {
            	var obj = {};
            	obj.fileType=$("#"+id+"-selectFileType").val();
            	return obj;
            }
		},
		_uploadmodal,
		_obj,
		init = function(obj, options) {
			$.extend(defaultSettings, options);
			_obj = obj;
			var tabItem = "";
			var tabContent = "";
			var selectObj = "";
			$.each(defaultSettings.tabs, function(index, val) {
				var active = index === 0 ? "active" : "";
				var type = val.fileType;
				var name = val.name;
				tabItem += "<li class='" + active + "'><a data-toggle='tab' href='#"+id+"-tab" + type + "' id='"+id+"-tabTitle_" + type + "'> " + name + " (<span class='red' id='"+id+"-fileCount_"+type+"'>0</span>)</a></li>";
				tabContent += "<div id='"+id+"-tab" + type + "' class='tab-pane " + active + "'><ul id='"+id+"-tabContent_" + type +
					"' data-maxCount=" + val.maxCount + " style='list-style: none; margin-left: -40px'></ul><div class='clearfix'></div></div>";
				selectObj += "<option value='" + type + "'>" + name + "</option>";

			});
			$(_obj).append(PREVIEW_TAB.repl('{title}', options.title).repl('{tabItem}', tabItem).repl('{tabContent}', tabContent));
			if(_uploadmodal === undefined) {
				$('body').append(UPLOAD_MODAL.repl('{selectObj}', selectObj));
				_uploadmodal = $("#"+id+"-uploadModal");
			}

			var fileIds = "";
			if(defaultSettings.files.length > 0) {
				$.each(defaultSettings.files, function(index, val) {
					fileIds += ',' + val.id;
					var fileType = val.fileType;
					var $tabContent = $("#"+id+"-tabContent_" + fileType);
					var fileCount = $("#"+id+"-fileCount_" + fileType).html();
					$tabContent.append(FILE_ITEM.repl('{downloadUrl}', defaultSettings.fileServerUrl + "/{fileId}/download")
						.repl('{uploadClass}', 'upload-' + val.extension.repl('.', '')).repl('{fileId}', val.id).repl('{fileType}', fileType)
						.repl('{filename}', val.filename).repl('{styleDisble}', "style='display:none !important;'"));
					$("#"+id+"-fileCount_" + fileType).html(parseInt(fileCount) + 1);
					$(_obj).find(".tab-content input").val(fileIds);
					$tabContent.find("span").off('click').on('click', defaultSettings.removeFile);
				});
			}
		},
		listen = function(options) {
			var $btnEdit = $("#"+id+"-file-edit");
			$btnEdit.off('click').on('click', function() {
				$(this).parent().append(UPLOAD_BTN);
				var $btnUpload = $("#"+id+"-file-upload");
				$btnUpload.off('click').on('click', function() {
					var type = $(_obj).find(".active").find("a").attr("href").repl("#"+id+"-tab", "");
					$("#"+id+"-selectFileType").val(type);
					_uploadmodal.modal('show');
				});
				$(_obj).append(SUBMIT_BTN);
				var $cancle = $(_obj).find(".btn-cancel");
				$cancle.off('click').on('click', function() {
					defaultSettings.cancle();
					$(this).parent().remove();
					$("#"+id+"-file-upload").remove();
					$("#"+id+"-file-edit").show();
					$(_obj).find(".tab-content span").attr('style','display:none !important');
				});
				var $confirm = $(_obj).find(".btn-confirm");
				$confirm.off('click').on('click', function() {
					defaultSettings.saveFile();
					$(this).parent().remove();
					$("#"+id+"-file-upload").remove();
					$("#"+id+"-file-edit").show();
					$(_obj).find(".tab-content span").attr('style','display:none !important');
				});				
				$(_obj).find("span").show();
				$(this).hide();
			});

			if(_uploadmodal === undefined) {
				$('body').append(UPLOAD_MODAL).trigger('refresh');
				_uploadmodal = $("#"+id+"-uploadModal");
			}
			
			defaultSettings.uploadUrl = defaultSettings.fileServerUrl+'?appId='+options.appId+'&moduleId='+options.moduleId;

			var $fileUploadInput = _uploadmodal.find("input");
			
			$fileUploadInput.fileinput(defaultSettings);

			_uploadmodal.off("hidden.bs.modal").on("hidden.bs.modal", function (event) {
				$fileUploadInput.fileinput("clear"); //清除已上传文件
				$fileUploadInput.fileinput("clearStack"); //清除文件堆栈
		    });	
			
			//同步上传错误处理
			$fileUploadInput.off("filebatchuploaderror").on('filebatchuploaderror', function(event, data, msg) {
				console.log('event:');
				console.log(event);
				console.log('errorData:');
				console.log(data);
				console.log('errorMsg:' + msg);
			});
			
			$fileUploadInput.off("fileloaded").on('fileloaded', function(event, file, previewId, index, reader) {
				var res = '';
				var filename = file.name
				if(filename.indexOf(".")){
					var index = filename.lastIndexOf(".");
					res = filename.substring(0, index).cutString(4) + filename.substr(index);
				}else{
					res = filename.cutString(4);
				}		
				$("#" + previewId).find(".file-footer-caption").html(res);
			});

			$fileUploadInput.off("filebatchpreupload").on('filebatchpreupload', function(event, data, previewId, index) {
				var fileType = $("#"+id+"-selectFileType").val();
				var $tabContent = $("#"+id+"-tabContent_" + fileType);
				var count = data.filescount + $tabContent.find("li").length;
				var maxCount = $tabContent.attr("data-maxCount");
				if($tabContent.attr("data-maxCount") < count) {
					return {
						message: "所上传类型附件个数不能超过：" + maxCount + "个",
						data: {}
					};
				}
				var totalSize = 0;
				$.each(data.files, function(index,item){
					if(item !== undefined){
						totalSize += item.size;
					}
				});
				
				if(totalSize/1048576 > defaultSettings.maxTotalSize){
					return {
						message: "所上传附件总大小不能超过：" + defaultSettings.maxTotalSize + "M",
						data: {}
					};
				}
			});

			//同步上传返回结果处理
			$fileUploadInput.off("filebatchuploadsuccess").on("filebatchuploadsuccess", function(event, data, previewId, index) {
				var fileType = $("#"+id+"-selectFileType").val();
				var $tabContent = $("#"+id+"-tabContent_" + fileType);
				var $tabTitle = $("#"+id+"-tabTitle_" + fileType);
				var fileIds = "";
				$.each(data.response.files, function(index, val) {
					fileIds += ',' + val.id;
					var fileCount = $("#"+id+"-fileCount_" + fileType).html();
					$tabContent.append(FILE_ITEM.repl('{downloadUrl}', defaultSettings.fileServerUrl + "/{fileId}/download")
						.repl('{uploadClass}', 'upload-' + val.extension.repl('.', '')).repl('{fileId}', val.id).repl('{fileType}', fileType)
						.repl('{filename}', val.filename).repl('{styleDisble}', ""));
					$("#"+id+"-fileCount_" + fileType).html(parseInt(fileCount) + 1);
				});
				$(_obj).find(".tab-content input").val($(_obj).find(".tab-content input").val() + fileIds);
				$tabContent.find("span").off('click').on('click', defaultSettings.removeFile);
				$tabTitle.click();
				_uploadmodal.modal('hide');
			});
		};
	init(obj, options);
	listen(options);
};
$.fn.upload = function(options) {
	$(this).empty();
	$.jkj.upload(this, options);
};
/*! validate 表单验证
 *  基于jquery-validation封装的表单验证
 */
$.jkj.validate = function(element, options) {
	var validator, settings, _submitHandler;

	if($.validator === undefined || $.validator == null) {
		throw new Error('$.jkj.validate 依赖 jquery-validation');
	}

	settings = {
		errorElement: "span",
		errorClass: "help-block help-block-error",
		focusInvalid: false, //提交表单后，未通过验证的表单（第一个或提交之前获得焦点的未通过验证的表单）会获得焦点。
		ignore: "", //忽略某些元素不验证
		rules: {}, //验证规则
		messages: {}, //提示信息
		onkeyup: false, //在 keyup 时验证。
		tooltipOptions: {
			tooltip: true, //错误提示使用tooltip样式
			placement: 'top' //错误提示位置 top|bottom|left|right|auto
		},
		highlight: function(element) {
			$(element).closest(".form-group").addClass("has-error");
		},
		unhighlight: function(element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		success: function(element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		errorPlacement: function(error, element) {
			var _element = element;
			if($(element).is(":checkbox")) {
				_element = $(element).parents('.checkbox-list');
			} else if($(element).is(":radio")) {
				_element = $(element).parents('.radio-list');
			} else {
				_element = element.parent();
			}
			error.appendTo(_element);
		},
		/*重写校验元素获得焦点后的执行函数--增加[1.光标移入元素时的帮助提示,2.校验元素的高亮显示]两个功能点*/
		onfocusin: function(element) {
			this.lastActive = element;

			/*1.帮助提示功能*/
			this.addWrapper(this.errorsFor(element)).hide();
			var tip = $(element).attr('tip');
			if(tip && $(element).parent().children(".tip").length === 0) {
				$(element).parent().append("<label class='tip'>" + tip + "</label>");
			}

			/*2.校验元素的高亮显示*/
			$(element).addClass('highlight');

			// Hide error label and remove error class on focus if enabled
			if(this.settings.focusCleanup) {
				if(this.settings.unhighlight) {
					this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
				}
				this.hideThese(this.errorsFor(element));
			}
		},
		/*重写校验元素焦点离开时的执行函数--移除[1.添加的帮助提示,2.校验元素的高亮显示]*/
		onfocusout: function(element) {
			/*1.帮助提示信息移除*/
			$(element).parent().children(".tip").remove();

			/*2.校验元素高亮样式移除*/
			$(element).removeClass('highlight');
			var that = this;
			setTimeout(function(){
				that.element(element);
			},300);

			//if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
			//    this.element( element );
			//}
		},
		submitHandler: function(form) {

		}
	};

	_submitHandler = options.submitHandler;
	settings.submitHandler = function(form) {
		_submitHandler(form);
		return false;
	};

	options = $.extend(true, settings, options);

	//使用tooltip样式
	if(options.tooltipOptions.tooltip) {
		$.extend(true, options, {
			unhighlight: function(element) {
				$(element).closest(".form-group").removeClass("has-error");

				var _element = element;
				if($(element).is(":checkbox")) {
					_element = $(element).parents('.checkbox-list');
				} else if($(element).is(":radio")) {
					_element = $(element).parents('.radio-list');
				} else {
					_element = $(element).parent();
				}
				$(_element).tooltip('hide');
			},
			errorPlacement: function(error, element) {
				var _element = element;
				if($(element).is(":checkbox")) {
					_element = $(element).parents('.checkbox-list');
				} else if($(element).is(":radio")) {
                    _element = $(element).parents('.radio-list');
                } else if($(element).parents().hasClass("tip-parent")) {
					_element = $(element).parent();
				}  else {
					_element = $(element).wrapAll("<div class='tip-parent'></div>").parent();
				}
                _element.attr("data-original-title", error.text())
                    .attr('data-trigger', 'manual')
                    .attr('data-placement', options.tooltipOptions.placement)
                    .tooltip('show');
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                if (validator.numberOfInvalids() > 0) {
                    // scroll to error element
                    var el = $(validator.errorList[0].element);
                    var offeset = -50;
                    var pos = (el && el.size() > 0) ? el.offset().top : 0;

                    if (el) {
                        pos = pos + (offeset ? offeset : -1 * el.height());
                    }

                    if (el.parents('.modal').length > 0) { //form in modal
                        $(el).parents('.modal').animate({
                            scrollTop: pos
                        }, 'slow');
                    } else {
                        $('html,body').animate({ //normal
                            scrollTop: pos
                        }, 'slow');
                    }
                }
            }
        });
    }

	validator = $(element).validate(options);
	return validator;
};

$(function() {
	if($.validator !== undefined && $.validator != null && $.validator.addMethod !== undefined && $.validator.addMethod != null) {
		validateAddMethod();
	}
});

function validateAddMethod() {
	//中等强度密码
	jQuery.validator.addMethod("password2", function(value, element) {
		return this.optional(element) || /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{6,}$/.test(value);
	}, "请输入不少于6位且包含数字、小写字母和大写字母");

	jQuery.validator.addMethod("ip", function(value, element) {
		return this.optional(element) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
	}, "请输入合法的IP地址");

	jQuery.validator.addMethod("abc", function(value, element) {
		return this.optional(element) || /^[a-zA-Z0-9_@.]*$/.test(value);
	}, "请输入字母数字或下划线");

	// 不等于验证
	jQuery.validator.addMethod("noEqualTo", function(value, element, param) {
		return value != $(param).val();
	}, "请再次输入不同的值");

	// 中文
	jQuery.validator.addMethod("chinese", function(value, element) {
		return this.optional(element) || /^[\u4e00-\u9fa5]*$/.test(value);
	}, "请填写中文");

	// 中文或英文
	jQuery.validator.addMethod("ch-en", function(value, element) {
		return this.optional(element) || /^([\u4e00-\u9fa5]|[a-zA-Z])*$/.test(value);
	}, "请填写中文或英文字符");

	// 真实姓名验证
	jQuery.validator.addMethod("realName", function(value, element) {
		return this.optional(element) || /^[\u4e00-\u9fa5]{2,30}$/.test(value);
	}, "姓名只能为2-30个汉字");

	// 手机号码验证
	jQuery.validator.addMethod("mobile", function(value, element) {
		return this.optional(element) || (/^1\d{10}$/.test(value));
	}, "请正确填写手机号码");

	// 电话号码验证
	jQuery.validator.addMethod("phone", function(value, element) {
		var reg = /^(\d{3,4}-?)?\d{7,9}$/g;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写电话号码");

	// 传真验证
	jQuery.validator.addMethod("fax", function(value, element) {
		var reg = /^([+]{0,1}((\d){1,6})([ ]?))?([-]?[0-9]{1,12})+$/g;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写传真号码");

	// 邮政编码验证
	jQuery.validator.addMethod("zipCode", function(value, element) {
		var reg = /^[0-9]{6}$/;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写邮政编码");

	//QQ号码验证
	jQuery.validator.addMethod("qq", function(value, element) {
		var reg = /^[1-9][0-9]{4,}$/;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写QQ号码");

	//金额验证
	jQuery.validator.addMethod("money", function(value, element) {
		var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写金额数");

	//验证身份证号码
	jQuery.validator.addMethod("idCardNo", function(value, element) {
		var checheckIdCardNo = function(idcard) {
			idcard = idcard.toString();
			//var Errors=new Array("验证通过!","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
			var Errors = [true, false, false, false, false];
			var area = {
				11: "北京",
				12: "天津",
				13: "河北",
				14: "山西",
				15: "内蒙古",
				21: "辽宁",
				22: "吉林",
				23: "黑龙江",
				31: "上海",
				32: "江苏",
				33: "浙江",
				34: "安徽",
				35: "福建",
				36: "江西",
				37: "山东",
				41: "河南",
				42: "湖北",
				43: "湖南",
				44: "广东",
				45: "广西",
				46: "海南",
				50: "重庆",
				51: "四川",
				52: "贵州",
				53: "云南",
				54: "西藏",
				61: "陕西",
				62: "甘肃",
				63: "青海",
				64: "宁夏",
				65: "新疆",
				71: "台湾",
				81: "香港",
				82: "澳门",
				91: "国外"
			};
			var Y, JYM;
			var S, M;
			var idcard_array = [];
			var ereg;
			idcard_array = idcard.split("");
			//地区检验
			if(area[parseInt(idcard.substr(0, 2))] == null) {
				return Errors[4];
			}
			//身份号码位数及格式检验
			switch(idcard.length) {
				case 15:
					if((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
					} else {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
					}
					if(ereg.test(idcard)) {
						return Errors[0];
					} else {
						return Errors[2];
					}
					break;
				case 18:
					//18 位身份号码检测
					//出生日期的合法性检查
					//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
					//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
					if(parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
					} else {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
					}
					if(ereg.test(idcard)) { //测试出生日期的合法性
						//计算校验位
						S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
							(parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
							(parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
							(parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
							(parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
							(parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
							(parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
							parseInt(idcard_array[7]) +
							parseInt(idcard_array[8]) * 6 +
							parseInt(idcard_array[9]) * 3;
						Y = S % 11;
						M = "F";
						JYM = "10X98765432";
						M = JYM.substr(Y, 1); //判断校验位
						if(M === idcard_array[17]) { //检测ID的校验位
							return Errors[0];
						} else {
							return Errors[3];
						}
					} else {
						return Errors[2];
					}
					break;
				default:
					return Errors[1];
			}
		};
		return this.optional(element) || checheckIdCardNo(value);
	}, "请正确填写身份证号码");
}
/*! workbench 工作台 
 *  基于gridstack实现的包含部件操作的工作台。
 */

$.jkj.workbench = function($elem, options) {
	var myWorkbench, workbench, settings, templates, widget, widgets;
		// 初次加载部件集
	var firstLoadWidgets=true;
		//	所有部件[{ 'name': 'widgetName', 'model': 'widgetModel', 'sort': sort },...]
	var allWidgets = [],
		//	已用部件['widgetName=>widgetModel',...]
		usedWidgets = [],
		// 可用部件[{ 'name': 'widgetName', 'model': 'widgetModel', 'sort': sort },...]
		restWidgets = [],
		/* 页面初始部件
		 * [
		 *		{
		 *	        "x": 0,
		 *	        "y": 1,
		 *	        "width": 2,
		 *	        "height": 4,
		 *	        "name": "widgetName",
		 *	        "model": "widgetModel",
		 *	        "others": {
		 *		        ...
		 *	        }
		 *	    },
		 *	    ...
		 * ]
		 */
		initWidgets = [],
		// 所有部件的排序
		widgetsSort = 0;

	if(!GridStackUI) {
		throw new Error('$.jkj.workbench 依赖 gridstack');
	}
	
	// 重写gridstack的_updateContainerHeight方法，解决初始没有部件的情况下没有高度的问题
	GridStackUI.prototype._updateContainerHeight = function() {
		if(this.grid._updateCounter) {
			return;
		}
		var height = this.grid.getGridHeight();
		if(height < (this.opts.minHeight)) {
			height = this.opts.minHeight;
		}
		this.container.attr('data-gs-current-height', height);
		if(!this.opts.cellHeight) {
			return;
		}
		if(!this.opts.verticalMargin) {
			this.container.css('height', (height * (this.opts.cellHeight)) + this.opts.cellHeightUnit);
		} else if(this.opts.cellHeightUnit === this.opts.verticalMarginUnit) {
			this.container.css('height', (height * (this.opts.cellHeight + this.opts.verticalMargin) -
				this.opts.verticalMargin) + this.opts.cellHeightUnit);
		} else {
			this.container.css('height', 'calc(' + ((height * (this.opts.cellHeight)) + this.opts.cellHeightUnit) +
				' + ' + ((height * (this.opts.verticalMargin - 1)) + this.opts.verticalMarginUnit) + ')');
		}
	};
	// 默认配置
	settings = {
		// 是否初始化已有的部件
		auto: false,
		// 单元格高度
		cellHeight: 10,
		// 拖动配置
		draggable: {
			// 鼠标样式
			cursor: 'move',
			opacity: 0.5,
			// 可拖动的元素
			handle: '.workbench-widget-header'
		},
		// 可拖拉的元素整体
		itemClass: 'grid-stack-item',
		// 最小高度
		minHeight: null,
		// 宽度
		width: 12,
		// 是否流动布局
		float: true,
		// 移除时延
		removable: false,
		// 拖动是否出现滚动轴
		scroll: true,
		// 接收的元素
		acceptWidgets: '.workbench-widget',
		// 部件垂直间距
		verticalMargin: 5,
		// 部件初始加载，需要返回json数据
		loadHandle: function(){
			return [];
		},
		// 保存操作
		saveHandle: function(data){
			
		}
	};
	// 模板
	templates ={
		operation: function(){
			var html=[];
			
			html.push('<div class="workbench-operation">');
			html.push('	<button class="workbench-operation-custom">编辑工作台</button>');
			html.push('	<button class="workbench-operation-cancel">退出编辑</button>');
			html.push('</div>');
			
        	return html.join('\n');
		}
	};
	// 部件的公共定义
	widget = {
		// 拖拉配置项
		dragOptions: {
			appendTo: 'body',
			cursor: 'move',
			handle: '.workbench-widget-header',
			helper: 'clone',
			opacity: 0.6,
			refreshPositions: true,
			revert: 'invalid',
			scroll: false,
			zIndex: 1040,
			stop: function(event, ui) {
				var widgetName = $(this).attr('widget-name');
				var widgetModel = $(this).attr('widget-model');
				var $widgetGridItem = $('.' + options.itemClass + '[widget-name="' + widgetName + '"][widget-model="' + widgetModel + '"]');
				var nodeData = $widgetGridItem.data('_gridstack_node');
				
				if(nodeData){
					var $widget;
	
					$elem.data('gridstack').removeWidget($widgetGridItem);
					ui.helper.hide();
					$elem.data('gridstack')
						 .addWidget($('<div></div>').append(widget.templates.body(widgetName, widgetModel)),
							nodeData.x, nodeData.y, nodeData.width, nodeData.height);
				}
				widgets.empty();
				/* 后续逻辑到$elem的“added”事件中执行
				 * 事件“added”在“chang”在之前执行
				 * 
				 */
			}
		},
		// 模板
		templates: {
			// 主体
			body: function(name, model) {
				return '<div class="workbench-widget" widget-name="' + name + '" widget-model="' + model + '"></div>';
			},
			// 外壳
			wrapper: function(){
				var html=[];
				
				html.push('<div class="row workbench-bottom-widgets">');
				html.push('	<div class="col-xs-12">');
				html.push('		<div class="workbench-widgets-wrapper">');
				html.push('			<div class="workbench-widgets">');
				html.push('			</div>');
				html.push('			<div class="workbench-widgets-empty">');
				html.push('			</div>');
				html.push('		</div>');
				html.push('	</div>');
				html.push('</div>');
				
        		return html.join('\n');
			}
		}
	};
	// 部件集公共定义
	widgets={
		empty:function(){
			if($('.workbench-widgets .workbench-widget').length===0){
				$('.workbench-widgets-empty').show();
				$('.workbench-widgets').hide();
				
			}else{
				$('.workbench-widgets-empty').hide();
				$('.workbench-widgets').show();
			}
		}
	};
	options = $.extend(true, settings, options);
	// 重写gridstack的最小高度
	if(!options.minHeight) {
		var workbenchHeight = 400;
		var workbenchTop = $('.grid-stack').offset().top;
		var windowHeight = $(window).height();
		var documentHeight = $(document).height();
		var widgetsHeight = $('.workbench-bottom-widgets').outerHeight();

		if(windowHeight - workbenchTop - widgetsHeight > 400) {
			workbenchHeight = windowHeight - workbenchTop - widgetsHeight;
		}
		options.minHeight = (workbenchHeight + options.verticalMargin) / (options.cellHeight + options.verticalMargin);
	}

	// 初始化工作台
	$elem.gridstack(options);
	// 获取gridstack对象
	myWorkbench=$elem.data('gridstack');
	// 获取需要初始化的部件
	initWidgets=options.loadHandle();
	// 加载并初始化部件
	$.each(initWidgets, function(i, item) {
		var $widget;
		myWorkbench.addWidget($('<div></div>').append(widget.templates.body(item.name, item.model)),
						item.x, item.y, item.width, item.height);
		$widget=$elem.find('[widget-name="' + item.name + '"][widget-model="' + item.model + '"]');
		$widget[item.name]($.extend(true,{ model: item.model, place: 'workbench'}, item.others));
		$widget.attr('widget-place', 'workbench');
		usedWidgets.push(item.name + '=>' + item.model);
	});
	$elem.find('.workbench-widget-header').css('cursor','initial');
	// 禁用拖拉和改变大小功能
	myWorkbench.disable();
	// 加载操作按钮
	$('body').append(templates.operation());
	// 自定义工作台按钮点击事件
	$('.workbench-operation-custom','body').on('click',function(){
		var bottomOutterHeight;
		
		$elem.data('gridstack').enable();
		$(this).hide();
		$('.workbench-operation-cancel, .workbench-operation-save').show();
		$('.workbench-bottom-widgets','body').show();
		$elem.find('.workbench-widget-header').css('cursor','move');
		$elem.find('.workbench-widget-close').show();
		if(firstLoadWidgets){
			firstLoadWidgets=false;
			$('body').append(widget.templates.wrapper());
			// 加载页面底部的部件集
			$.each($.jkjWidgets, function(key, value) {
				var models;
				if(key === '__proto__') {
					return;
				}
				models = $.jkjWidgets[key].prototype.getModels();
				$.each(models, function(i, model) {
					allWidgets.push({ 'name': key, 'model': model, 'sort': widgetsSort });
					if($.inArray(key + '=>' + model, usedWidgets) < 0) {
						var $widget;
						$('.workbench-widgets').append(widget.templates.body(key, model));
						$widget=$('.workbench-widgets [widget-name="' + key + '"][widget-model="' + model + '"]');
						$widget[key]({
							model: model,
							place: 'widgets'
						});
						$widget.attr('widget-place', 'widgets');
						restWidgets.push({ 'name': key, 'model': model, 'sort': widgetsSort });
					}
					widgetsSort++;
				});
			});
			// 初始化页面底部的部件拖拽
			$('.workbench-widgets .workbench-widget').draggable(widget.dragOptions);
			widgets.empty();
		}
		bottomOutterHeight=$('.workbench-bottom-widgets').outerHeight();
		$elem.data('margin-bottom',$elem.css('margin-bottom'));
		$elem.css('margin-bottom', bottomOutterHeight+'px');
	});
	// 取消按钮点击事件
	$('.workbench-operation-cancel','body').on('click',function(){
		$elem.data('gridstack').disable();
		$elem.find('.workbench-widget-header').css('cursor','initial');
		$('.workbench-operation-cancel, .workbench-operation-save').hide();
		$('.workbench-operation-custom').show();
		$('.workbench-bottom-widgets','body').hide();
		$elem.find('.workbench-widget-close').hide();
		$elem.css('margin-bottom',$elem.data('margin-bottom'));
	});
	// 重写gridstack的dropover事件
	$elem.on('dropover', function(event, ui) {
		var el = $(ui.draggable);
		var node = el.data('_gridstack_node');

		node.width = parseInt($(el).attr('data-gs-width') || 2);
		node.height = parseInt($(el).attr('data-gs-height') || 2);
		el.data('_gridstack_node', node);
	});
	$elem.on('added', function(event, widgets) {
		$.each(widgets, function(i, widget) {
			var $widget,widgetName,widgetModel;
			
			$widget = $(widget.el).find('.workbench-widget');
			$widget.attr('widget-place', 'workbench');
			widgetName=$widget.attr('widget-name');
			widgetModel=$widget.attr('widget-model');
			usedWidgets.push(widgetName + '=>' + widgetModel);
			$.each(restWidgets, function(i, item) {
				if(item.name === widgetName && item.model === widgetModel) {
					restWidgets.splice(i, 1);
					return false;
				}
			});
			$widget[widgetName]({
				model: widgetModel,
				place: 'workbench'
			});
			$widget.find('.workbench-widget-close').show();
			$widget.find('.workbench-widget-header').css('cursor','move');
		});
	});
	$elem.on('change', function(event, items){
			// 是否从部件集添加的，如果是从部件集复制的，不需要保存修改
		var fromWidgets=false,
			// 序列化数据
			serializedData;
		
		$.each(items, function(i, item) {
			if($(item.el).attr('widget-place')==='widgets'){
				fromWidgets=true;
				return false;
			}
		});
		
		if(!fromWidgets){
			serializedData=_.map($('.grid-stack > .grid-stack-item:visible'), function (gridItem) {
				var $gridItem=$(gridItem);
	            var $widget = $(gridItem).find('.workbench-widget');
	            var widgetName = $widget.attr('widget-name');
				var widgetModel = $widget.attr('widget-model');
	            var node = $gridItem.data('_gridstack_node');
	            var otherData= $widget[widgetName]('saveWidget')||{};
	            return {
	                x: node.x,
	                y: node.y,
	                width: node.width,
	                height: node.height,
	                name: widgetName,
	                model: widgetModel,
	                others: otherData
	            };
	        });
			options.saveHandle(serializedData);
		}
	});
	// 部件关闭事件
	$elem.on('click', '.workbench-widget-close', function() {
		var $widgetElem = $(this).parents('.workbench-widget');
		var widgetName = $widgetElem.attr('widget-name');
		var widgetModel = $widgetElem.attr('widget-model');
		var options = $widgetElem[widgetName]('option');

		if(typeof options.closeHandle === 'function') {
			options.closeHandle.call(this);
		}
		$elem.data('gridstack').removeWidget($widgetElem.parent());
		usedWidgets.splice($.inArray(widgetName + '=>' + widgetModel, usedWidgets), 1);
		$.each(allWidgets, function(i, item) {
			if(item.name === widgetName && item.model === widgetModel) {
				var widgetHtml = widget.templates.body(widgetName, widgetModel);
				var $widget;
				var sort;

				if(restWidgets.length === 0) {
					sort = 0;
				} else if(restWidgets.length === 1) {
					if(item.sort < restWidgets[0].sort) {
						sort = 0;
					} else {
						sort = 1;
					}
				} else {
					for(var i = 0; i < restWidgets.length; i++) {
						if(i === 0 && item.sort < restWidgets[i].sort) {
							sort = 0;
							break;
						} else if((i === (restWidgets.length - 1) && item.sort > restWidgets[i].sort) ||
							(item.sort > restWidgets[i].sort && item.sort < restWidgets[i + 1].sort)) {
							sort = i + 1;
							break;
						}
					}
				}
				if(sort === 0) {
					$('.workbench-widgets').prepend(widgetHtml);
				} else {
					$('.workbench-widgets .workbench-widget:eq(' + (sort - 1) + ')').after(widgetHtml);
				}
				$widget = $('.workbench-widgets [widget-name="' + widgetName + '"][widget-model="' + widgetModel + '"]');
				$widget.draggable(widget.dragOptions);
				$widget[widgetName](
					{
						model: widgetModel,
						place: 'widgets'
					}
				);
				$widget.attr('widget-place', 'widgets');
				restWidgets.splice(sort, 0, { 'name': widgetName, 'model': widgetModel, 'sort': item.sort });
				return false;
			}
		});
		widgets.empty();
	});

	return myWorkbench;
};
$.fn.workbench = function(options) {
	return $.jkj.workbench($(this), options);
};