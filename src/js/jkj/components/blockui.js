/* AdminJKJ $.jkj.blockui
 * ==========================
 * @作者 李睿
 * @日期 2017-03-14
 *
 * 修改日志：
 *
 */
/*! blockui 遮罩层
 *  基于jquery-blockui 封装的遮罩层
 */
$.jkj.blockui = {
    _init: function (options) {
        var settings;

        settings = {
            //target: '', //需要覆盖的模块id,不填默认为全屏
            image: '/AdminJKJ/src/images/loading.gif', //进度条logo
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