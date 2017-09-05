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