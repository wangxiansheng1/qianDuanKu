/* AdminJKJ $.jkj.workbench
 * ==========================
 * @作者 潘明星
 * @日期 2017-02-28
 * 
 * 修改日志：
 * 
 */
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