/* AdminJKJ $.jkjWidgets.demo
 * ==========================
 * @作者 潘明星
 * @日期 2017-03-23
 * 
 * 修改日志：
 * 
 */
/*! jkj.demo 示例
 *  基于jquery ui 的 widget 实现的一个示例。
 */
+(function($) {
	$.widget("jkjWidgets.demo", {
		// 默认参数
		options: {

			// 模型
			model: null,
			// 放置地方，widgets 部件集， workbench 工作台
			place: 'widgets',
			// 关闭方法
			closeHandle: null
		},
		// 模板
		_templates: {
			header: function(title) {
				var html = [];

				html.push('<div class="workbench-widget-header">');
				html.push('	<h4 class="workbench-widget-title">' + title + '</h4>');
				html.push('</div>');

				return html.join('\n');
			},
			closeButton: function() {
				var html = [];

				html.push('	<button class="workbench-widget-close none">');
				html.push('		<span>×</span>');
				html.push('	</button>');

				return html.join('\n');
			},
			body: function() {
				var html = [];

				html.push('<div class="workbench-widget-body">');
				html.push('</div>');

				return html.join('\n');
			}
		},
		// 初始化
		_init: function() {
			
		},
		// 创建控件，事件绑定
		_create: function() {
			var title = '示例';

			this.element.append(this._templates.header(title));
			this.element.append(this._templates.body());
			if(this.options.place == 'workbench') {
				this.element.find('.workbench-widget-header').append(this._templates.closeButton());
				this._buildWorkbench();
			} else {
				this._buildWidget();
			}
		},
		// 设置单个参数
		_setOption: function(key, value) {
			//      	if ( key === "width" ) {
			//				this.element.width( value );
			//			}
			//			if ( key === "height" ) {
			//				this.element.height( value );
			//			}
			this._super(key, value);
		},
		// 设置多个参数
		_setOptions: function(options) {
			var that = this;

			$.each(options, function(key, value) {
				that._setOption(key, value);
			});
		},
		// 销毁部件
		_destroy: function() {
			//this.element.removeClass( "progressbar" ).text( "" );
		},
		// 创建工作台
		_buildWorkbench: function() {
			var body = this.element.find('.workbench-widget-body');
			this.options.closeHandle= this._closeHandle;
			switch(this.options.model) {
				case 'little':
					{
						body.append('这是工作台little');
					};
					break;
				case 'middle':
					{
						body.append('这是工作台middle');
					};
					break;
				case 'large':
					{
						body.append('这是工作台large');
					};
					break;
				default:
					{
						body.append('参数传递错误啦...');
					}
			}
		},
		// 创建小部件
		_buildWidget: function() {
			var body = this.element.find('.workbench-widget-body');
			switch(this.options.model) {
				case 'little':
					{
						this.element.attr('data-gs-width', '2');
						this.element.attr('data-gs-height', '4');
						body.append('这是小部件little');
					};
					break;
				case 'middle':
					{
						this.element.attr('data-gs-width', '4');
						this.element.attr('data-gs-height', '8');
						body.append('这是小部件middle');
					};
					break;
				case 'large':
					{
						this.element.attr('data-gs-width', '8');
						this.element.attr('data-gs-height', '12');
						body.append('这是小部件large');
					};
					break;
				default:
					{
						body.append('参数传递错误啦...');
					}
			}
		},
		// 关闭调用的方法
		_closeHandle: function(){
			
		},
		// 获取模型集合
		getModels: function() {
			return ['little', 'middle', 'large'];
		},
		// 获取拖动拷贝
		getDragClone: function() {
			return this._buildWorkbench();
		},
		// 保存组件
		saveWidget: function(){
			return {
				test: 'test',
				welcome: 'Hello World!'
			}
		}
	});
})(jQuery);