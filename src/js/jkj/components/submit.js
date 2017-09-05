//初始化待提交的表单
$.jkj.initForm = function(element) {
	//表单禁用回车
	$(element).find(':text').keydown(function(e) {
		var code = e.keyCode | e.charCode;
		if(code == 13) {
			e.preventDefault();
		}
	});
	//初始化输入验证
	$.jkj.validate(element, {
		submitHandler: function(form) {

		}
	});
};

$.jkj.submit = function(options) {
	"use strict";
	var settings = {
		//请求url
		url: '',
		//请求类型，默认为post
		type: 'post',
		//传参
		data: null,
		//回调中制定this的Object
		context: null,
		//成功回调
		success: function(data, textStatus, jqXHR) {
			var $context = $(this);
		},
		error: function(){
			$.jkj.notify.showError("服务器错误，请联系管理员", null, "self");
		},
		//请求完成事件，无论失败
		complete: function(XMLHttpRequest, textStatus) {
			var $context = $(this);
			if($context) {
				$context.button('reset');
				formLayer.close();
			}
		}
	},
	formLayer;	
	var $form = $(options.form);
	//验证
	if(options.validate && !$form.valid()){
		return false;
	}
	var beforeSend = options.beforeSend;
	if(beforeSend && beforeSend()===false){
		return false;
	}
	formLayer = $.jkj.layer.loading("保存中...");	
	var btn = options.btn;
	if($(btn).attr("data-loading-text") === undefined) {
		$(btn).attr("data-loading-text", $(btn).html() + "中");
	}
	$(btn).button('loading');
	settings.url = $form.attr("action");
	settings.context = btn;
	settings.data = $form.serializeArray();
	if(options.callback){
		settings.success = options.callback;
	}
	//请求处理
	$.ajax(settings);
};

$.fn.jkjSubmit = function(options){
	options.form = this;
	$.jkj.submit(options);
};
