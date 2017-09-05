/* AdminJKJ $.jkj.treeTable
 * ==========================
 * @作者 李睿
 * @日期 2017-03-15
 *
 * 修改日志：
 *
 */
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
