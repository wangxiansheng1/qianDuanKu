/* AdminJKJ $.jkj.dataTable
 * ==========================
 * @作者 潘明星
 * @日期 2017-03-02
 * 
 * 修改日志：
 * 
 */
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