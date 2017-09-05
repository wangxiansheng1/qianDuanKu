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