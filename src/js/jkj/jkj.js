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