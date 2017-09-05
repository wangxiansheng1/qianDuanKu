/* AdminJKJ $.jkj.tree
 * ==========================
 * @作者 李睿
 * @日期 2017-03-10
 *
 * 修改日志：
 *
 */
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