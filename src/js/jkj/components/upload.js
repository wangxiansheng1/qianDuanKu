$.jkj.upload = function(obj, options) {
	"use strict";
	String.prototype.repl = function(from, to) {
		return this.split(from).join(to);
	};
	var id = $(obj).attr('id');
	var aEditBtn = "<a class='btn btn-primary' id='"+id+"-file-edit' href='javascript:void(0)'>编辑</a>";
	if(options.permissionCode != '' && options.permissionCode != undefined){
		aEditBtn = '';
	}
	var PREVIEW_TAB = "<div class='form-title'>{title}<label class='right'>" + aEditBtn + "</label></div>" +
			"<div class='tabbable'><ul class='nav nav-tabs'>{tabItem}</ul><div class='tab-content'>" +
			"<input type='hidden' name='fileIds' value=''>{tabContent}</div></div>",
		UPLOAD_BTN = "<a class='btn btn-primary' id='"+id+"-file-upload' href='javascript:void(0)'>上传附件</a>",
		SUBMIT_BTN = "<div class='btn-submit'><button type='button' class='btn btn-cancel btn-font4'>取消</button>" +
			"<button type='button' class='btn btn-confirm btn-font4' style=''>保存</button></div>",
		FILE_ITEM = "<li style='float: left; margin-left: 15px; text-align: center' class='upload'>" +
			"<a href='{downloadUrl}' target='_blank' class='{uploadClass}'>" +
			"<label title='{filename}'>{filename}</label>" +
			"<span data-fileType={fileType} data-fileId={fileId} {styleDisble}></span></a>" +
			"<mark class='bg-green'>传</mark></li>",
		UPLOAD_MODAL = "<div class='modal fade fileupload' id='"+id+"-uploadModal' tabindex='-1' role='dialog' " +
		"aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' style='width: 845px;'>" +
		"<div class='modal-content'>" +
		"<div class='modal-header mhd-layer-header'><button class='close' aria-hidden='true' type='button' data-dismiss='modal'>×</button>" +
		"<h4 class='modal-title mhd-layer-title'>上传文件</h4></div><div class='modal-body'><div class='mhd-layer-body'>" +
		"文件类型：<select class='form-control' id='"+id+"-selectFileType'>{selectObj}</select>" +
		"<form enctype='multipart/form-data'><input class='file' name='files' type='file' multiple style='width: 300px;'>" +
		"</form></div></div></div></div></div>",
		defaultSettings = {
			//上传地址
			fileServerUrl: "",
			//总共上传大小单位m
			maxTotalSize: 200,
			//加载已上传文件
			files: {},
			//文件tab页信息
			tabs: null,
			//已上传文件删除事件
			removeFile: function(e) {
				e.preventDefault();
				var fileType = $(this).attr("data-fileType");
				var fileCount = $("#"+id+"-fileCount_" + fileType).html();
				$("#"+id+"-fileCount_" + fileType).html(fileCount-1);
				var $fileIdInput = $(_obj).find(".tab-content input");
				$fileIdInput.val($fileIdInput.val().repl("," + $(this).attr("data-fileId"), ""));
				$(this).closest("li").remove();
			},
			//保存文件事件
			saveFile: function() {

			},
			//取消保存文件事件
			cancle: function() {

			},
			//上传组件国际化，默认中文
			language: "zh",
			//达到最大限制时是否自动替换
			autoReplace: false,
			layoutTemplates: {
				footer: '<div class="file-thumbnail-footer"><div class="file-footer-caption">{caption}</div>{actions}</div>',
				actions: '<div class="file-actions">\n' +
		        '    <div class="file-footer-buttons">\n' +
		        '        {upload} {delete} {zoom} {other}' +
		        '    </div>\n' +
		        '    {drag}\n' +
		        '    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
		        '    <div class="clearfix"></div>\n' +
		        '</div>'
			},
			allowedPreviewTypes: [],
			previewFileIcon: '<div class="upload"><i class="" style="height:auto;"></i></div>',
			//文件预览样式		
			previewFileIconSettings: {
				'pdf': '<div class="upload"><i class="upload-pdf" style="height:auto;"></i></div>',
			    'doc': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
			    'docx': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
			    'xls': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
			    'xlsx': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
			    'ppt': '<div class="upload"><i class="upload-ppt" style="height:auto;"></i></div>',
			    'jpg': '<div class="upload"><i class="upload-jpg" style="height:auto;"></i></div>',
			    'png': '<div class="upload"><i class="upload-png" style="height:auto;"></i></div>'
			},
			fileActionSettings: {
				 showUpload: false,
				 showZoom: false,
				 showDrag: false
			},
			//是否同步上传，默认为异步
			uploadAsync: false,
			//是否显示文件标题，默认为true
			showCaption: true,
			//是否显示预览，默认为true
			showPreview: true,
			//是否显示移除按钮，默认为true
			showRemove: true,
			//是否显示上传按钮，默认为true
			showUpload: true,
			//允许点击窗口选择文件，默认false
			browseOnZoneClick: true,
			//最小上传大小
			minFileSize: 0,
			//最大上传大小
			maxFileSize: 10240,
			//最小上传个数
			minFileCount: 0,
			//最大上传个数
			maxFileCount: 20,
			//100m
			maxFilePreviewSize: 102400,
			//允许上传的文件类型
			allowedFileTypes: ["image", "html", "text", "video", "audio", "flash", "object"],
			//允许上传的文件扩展名
			allowedFileExtensions: [],
			ajaxSettings: {
			},
			//额外参数的关键点
            uploadExtraData: function() {
            	var obj = {};
            	obj.fileType=$("#"+id+"-selectFileType").val();
            	return obj;
            }
		},
		_uploadmodal,
		_obj,
		init = function(obj, options) {
			$.extend(defaultSettings, options);
			_obj = obj;
			var tabItem = "";
			var tabContent = "";
			var selectObj = "";
			$.each(defaultSettings.tabs, function(index, val) {
				var active = index === 0 ? "active" : "";
				var type = val.fileType;
				var name = val.name;
				tabItem += "<li class='" + active + "'><a data-toggle='tab' href='#"+id+"-tab" + type + "' id='"+id+"-tabTitle_" + type + "'> " + name + " (<span class='red' id='"+id+"-fileCount_"+type+"'>0</span>)</a></li>";
				tabContent += "<div id='"+id+"-tab" + type + "' class='tab-pane " + active + "'><ul id='"+id+"-tabContent_" + type +
					"' data-maxCount=" + val.maxCount + " style='list-style: none; margin-left: -40px'></ul><div class='clearfix'></div></div>";
				selectObj += "<option value='" + type + "'>" + name + "</option>";

			});
			$(_obj).append(PREVIEW_TAB.repl('{title}', options.title).repl('{tabItem}', tabItem).repl('{tabContent}', tabContent));
			if(_uploadmodal === undefined) {
				$('body').append(UPLOAD_MODAL.repl('{selectObj}', selectObj));
				_uploadmodal = $("#"+id+"-uploadModal");
			}

			var fileIds = "";
			if(defaultSettings.files.length > 0) {
				$.each(defaultSettings.files, function(index, val) {
					fileIds += ',' + val.id;
					var fileType = val.fileType;
					var $tabContent = $("#"+id+"-tabContent_" + fileType);
					var fileCount = $("#"+id+"-fileCount_" + fileType).html();
					$tabContent.append(FILE_ITEM.repl('{downloadUrl}', defaultSettings.fileServerUrl + "/{fileId}/download")
						.repl('{uploadClass}', 'upload-' + val.extension.repl('.', '')).repl('{fileId}', val.id).repl('{fileType}', fileType)
						.repl('{filename}', val.filename).repl('{styleDisble}', "style='display:none !important;'"));
					$("#"+id+"-fileCount_" + fileType).html(parseInt(fileCount) + 1);
					$(_obj).find(".tab-content input").val(fileIds);
					$tabContent.find("span").off('click').on('click', defaultSettings.removeFile);
				});
			}
		},
		listen = function(options) {
			var $btnEdit = $("#"+id+"-file-edit");
			$btnEdit.off('click').on('click', function() {
				$(this).parent().append(UPLOAD_BTN);
				var $btnUpload = $("#"+id+"-file-upload");
				$btnUpload.off('click').on('click', function() {
					var type = $(_obj).find(".active").find("a").attr("href").repl("#"+id+"-tab", "");
					$("#"+id+"-selectFileType").val(type);
					_uploadmodal.modal('show');
				});
				$(_obj).append(SUBMIT_BTN);
				var $cancle = $(_obj).find(".btn-cancel");
				$cancle.off('click').on('click', function() {
					defaultSettings.cancle();
					$(this).parent().remove();
					$("#"+id+"-file-upload").remove();
					$("#"+id+"-file-edit").show();
					$(_obj).find(".tab-content span").attr('style','display:none !important');
				});
				var $confirm = $(_obj).find(".btn-confirm");
				$confirm.off('click').on('click', function() {
					defaultSettings.saveFile();
					$(this).parent().remove();
					$("#"+id+"-file-upload").remove();
					$("#"+id+"-file-edit").show();
					$(_obj).find(".tab-content span").attr('style','display:none !important');
				});				
				$(_obj).find("span").show();
				$(this).hide();
			});

			if(_uploadmodal === undefined) {
				$('body').append(UPLOAD_MODAL).trigger('refresh');
				_uploadmodal = $("#"+id+"-uploadModal");
			}
			
			defaultSettings.uploadUrl = defaultSettings.fileServerUrl+'?appId='+options.appId+'&moduleId='+options.moduleId;

			var $fileUploadInput = _uploadmodal.find("input");
			
			$fileUploadInput.fileinput(defaultSettings);

			_uploadmodal.off("hidden.bs.modal").on("hidden.bs.modal", function (event) {
				$fileUploadInput.fileinput("clear"); //清除已上传文件
				$fileUploadInput.fileinput("clearStack"); //清除文件堆栈
		    });	
			
			//同步上传错误处理
			$fileUploadInput.off("filebatchuploaderror").on('filebatchuploaderror', function(event, data, msg) {
				console.log('event:');
				console.log(event);
				console.log('errorData:');
				console.log(data);
				console.log('errorMsg:' + msg);
			});
			
			$fileUploadInput.off("fileloaded").on('fileloaded', function(event, file, previewId, index, reader) {
				var res = '';
				var filename = file.name
				if(filename.indexOf(".")){
					var index = filename.lastIndexOf(".");
					res = filename.substring(0, index).cutString(4) + filename.substr(index);
				}else{
					res = filename.cutString(4);
				}		
				$("#" + previewId).find(".file-footer-caption").html(res);
			});

			$fileUploadInput.off("filebatchpreupload").on('filebatchpreupload', function(event, data, previewId, index) {
				var fileType = $("#"+id+"-selectFileType").val();
				var $tabContent = $("#"+id+"-tabContent_" + fileType);
				var count = data.filescount + $tabContent.find("li").length;
				var maxCount = $tabContent.attr("data-maxCount");
				if($tabContent.attr("data-maxCount") < count) {
					return {
						message: "所上传类型附件个数不能超过：" + maxCount + "个",
						data: {}
					};
				}
				var totalSize = 0;
				$.each(data.files, function(index,item){
					if(item !== undefined){
						totalSize += item.size;
					}
				});
				
				if(totalSize/1048576 > defaultSettings.maxTotalSize){
					return {
						message: "所上传附件总大小不能超过：" + defaultSettings.maxTotalSize + "M",
						data: {}
					};
				}
			});

			//同步上传返回结果处理
			$fileUploadInput.off("filebatchuploadsuccess").on("filebatchuploadsuccess", function(event, data, previewId, index) {
				var fileType = $("#"+id+"-selectFileType").val();
				var $tabContent = $("#"+id+"-tabContent_" + fileType);
				var $tabTitle = $("#"+id+"-tabTitle_" + fileType);
				var fileIds = "";
				$.each(data.response.files, function(index, val) {
					fileIds += ',' + val.id;
					var fileCount = $("#"+id+"-fileCount_" + fileType).html();
					$tabContent.append(FILE_ITEM.repl('{downloadUrl}', defaultSettings.fileServerUrl + "/{fileId}/download")
						.repl('{uploadClass}', 'upload-' + val.extension.repl('.', '')).repl('{fileId}', val.id).repl('{fileType}', fileType)
						.repl('{filename}', val.filename).repl('{styleDisble}', ""));
					$("#"+id+"-fileCount_" + fileType).html(parseInt(fileCount) + 1);
				});
				$(_obj).find(".tab-content input").val($(_obj).find(".tab-content input").val() + fileIds);
				$tabContent.find("span").off('click').on('click', defaultSettings.removeFile);
				$tabTitle.click();
				_uploadmodal.modal('hide');
			});
		};
	init(obj, options);
	listen(options);
};
$.fn.upload = function(options) {
	$(this).empty();
	$.jkj.upload(this, options);
};