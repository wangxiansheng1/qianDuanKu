/* AdminJKJ $.jkj.notify
 * ==========================
 * @作者 潘明星
 * @日期 2017-03-02
 * 
 * 修改日志：
 * 
 */
/*! notify 通知
 *  基于bootstrap-notify封装的通知
 * showWindow: self当前页面；parent父页面；top顶级页面；opener打开的页面
 */
$.jkj.notify={
	_init:function(content,options,showWindow){
		var myNotify,notify,settings;
		
		if(!$.notify){
			throw new Error('$.jkj.notify 依赖 bootstrap-notify');
		}
		
		settings={
			offset: {
				x: 15,
				y:5
			},
			spacing: 2,
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-dismissible" role="alert">' +
						'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
						'<span data-notify="icon"></span> ' +
						'<span data-notify="title">{1}</span> ' +
						'<span data-notify="message">{2}</span>' +
						'<div class="progress" data-notify="progressbar">' +
							'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
						'</div>' +
						'<a href="{3}" target="{4}" data-notify="url"></a>' +
					  '</div>'
		};
		notify=$.notify;
		if(showWindow!=='self'){
			if(showWindow==='parent'){
				if(window.parent!==window.self){
					notify=window.parent.window.$.notify;
				}
			}
			else if(showWindow==='top'){
				if(window.top!==window.self){
					notify=window.top.window.$.notify;
				}
			}
			else if(showWindow==='opener'){
				if(window.top===window.self&&window.opener!=null){
					notify=window.opener.window.$.notify;
				}
			}
		}
		options=$.extend(true, settings, options);
		myNotify=notify(content,options);
		
		return myNotify;
	},
	showError:function(content, options, showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'danger',
			delay: 0
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	},
	showInfo:function(content, options, showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'info',
			delay: 3000
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	},
	showSuccess:function(content, options, showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'success',
			delay: 3000
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	},
	showWarning:function(content,options,showWindow){
		var myNotify,settings;
		
		showWindow=showWindow||'self';
		settings={
			type: 'warning'
		};
		options=$.extend(true,settings,options);
		myNotify=this._init(content,options,showWindow);
		
		return myNotify;
	}
};
