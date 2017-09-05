/* AdminJKJ $.jkj.richNavTabs
 * ==========================
 * @作者 潘明星
 * @日期 2017-02-24
 * 
 * 修改日志：
 * 
 */
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
