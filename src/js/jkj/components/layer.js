/* AdminJKJ $.jkj.layer
 * ==========================
 * @作者 潘明星
 * @日期 2017-02-28
 * 
 * 修改日志：
 * 
 */
/*! layer 层 
 *  基于bootstrap模态框样式实现的遮罩层、加载层等
 */
$.jkj.layer={
	_init:function(id,type){
		var _layer, newlayer, pageData, util;
		
		pageData=$.jkj.data.page;
		util=$.jkj.util;
		id = id||('layer'+util.random.getLongDateString());
		pageData.layers=pageData.layers||[];
		
		_layer=function(){
			this.id=id;
			//类型：page页面的层，zone区域的层
			this.type=type;
			//区域加载层时有效
			this.$zoneElem=null;
		};
		//模板
		_layer.prototype.templates={
			//蒙版外壳
			wrapper:function(id){
				var html;
				
				html=[];
				html.push('<div id="'+id+'" tabindex="-1" class="modal fade bs-example-modal-lg modal-primary in" ');
				html.push(' 	role="dialog" style="display: block; background-color:rgba(0,0,0,0.2)">');
				html.push('	<div class="modal-dialog modal-lg">');
				html.push('		<div class="modal-content" style="border:none;box-shadow:none;background:none;"></div>');
				html.push('	</div>');
				html.push('</div>');
				
				return html.join('\n');
			},
			//加载内容
			loadingContent:function(message, imgUrl){
				var html;
				
				html=[];
				html.push('<div class="modal-body">');
				html.push('	<div style="text-align:center;">');
				html.push('		<div class="'+imgUrl+'"></div>');
				html.push('		<br/>');
				html.push('		<span id="loading-message" style="color:white">'+message+'</span>');
				html.push('	</div>');
				html.push('</div>');
				
				return html.join('\n');
			},
			loadingZoneContent:function(id, message, imgUrl, $elem){
				var html;
				
				html=[];
				html.push('<div id="'+id+'" style="background-color:rgba(0,0,0,0.2);position:absolute;top:0;left:0;z-index:10;width:100%;height:100%;">');
				html.push('	<div style="text-align:center;padding:20px 0;">');
				html.push('		<div class="'+imgUrl+'"></div>');
				html.push('		<br/>');
				html.push('		<span id="loading-message" style="color:white">'+message+'</span>');
				html.push('	</div>');
				html.push('</div>');
				
				return html.join('\n');
			}
		};
		//关闭层
		_layer.prototype.close=function(){
			var index;
			
			$('body').find('#'+this.id).remove();
			$(pageData.layers).each(function(i,item){
				if(item.id===this.id){
					index=i;
					return false;
				}
			});
			$(pageData.layers).splice(index, 1);
			if(this.type==='page'){
				var hasOne=false;
				$(pageData.layers).each(function(i,item){
					if(this.type==='page'){
						hasOne=true;
						return false;
					}
				});
				if(!hasOne){
					$('html').css('overflow-y', 'auto');
				}
			}
			else if(this.type==='zone'){
				this.$zoneElem.css('min-height',this.$zoneElem.data('min-height'));
			}
		};
		//设置加载层的消息
		_layer.prototype.setMessage=function(message){
			$('body').find('#'+this.id+' #loading-message').html(message);
		};
		
		newlayer=new _layer();
		pageData.layers.push(newlayer);
		
		return newlayer;
	},
	//根据id获取层
	get:function(id){
		var myLayer, layers;
		
		myLayer=null;
		layers=$.jkj.data.page.layers||[];
		//在当前页面查找并移除指定层
		$(layers).each(function(i, item){
			if(item.id===id){
				myLayer=item;
				return false;
			}
		});
		//如果当前页面没有，到父页面查找并移除
		if(myLayer==null){
			if(window.parent!==window.self){
				layers=window.parent.window.$.jkj.data.page.layers||[];
				$(layers).each(function(i, item){
					if(item.id===id){
						myLayer=item;
						return false;
					}
				});
			}
			//如果父页面没有，到顶级页面查找并移除
			if(myLayer==null){
				if(window.top!==window.self&&window.top!==window.parent){
					layers=window.top.window.$.jkj.data.page.layers||[];
					$(layers).each(function(i, item){
						if(item.id===id){
							myLayer=item;
							return false;
						}
					});
				}
			}
		}
		
		return myLayer;
	},
	//创建加载层
	loading:function(message,imgUrl,id){
		var layer, layerHtml;
		
		message=message||'';
		imgUrl=imgUrl||'layer-loading';
		layer=this._init(id,'page');
		layerHtml=layer.templates.wrapper(layer.id);
		$('body').append(layerHtml);
		$('body').find('#'+layer.id+' .modal-content').append(layer.templates.loadingContent(message, imgUrl));
		
		return layer;
	},
	//创建区域加载层
	loadingZone:function($elem,message,imgUrl,id){
		var layer, layerHtml;
		
		$elem.css('position','relative');
		$elem.data('min-height',$elem.css('min-height'));
		$elem.css('min-height','200px');
		message=message||'';
		imgUrl=imgUrl||'layer-loading';
		layer=this._init(id,'zone');
		layer.$zoneElem=$elem;
		layerHtml=layer.templates.loadingZoneContent(layer.id,message,imgUrl,$elem);
		$elem.append(layerHtml);
		
		return layer;
	},
	//当前页面创建蒙版
	mask:function(id){
		var layer, layerHtml;
		
		layer=this._init(id,'page');
		layerHtml=layer.templates.wrapper(layer.id);
		$('body').append(layerHtml);
		
		return layer;
	},
	//父页面创建蒙版
	maskParent:function(id){
		var parent;
	
		parent=window.parent===window.self? this:window.parent.window.$.jkj.layer;
		
		return parent.mask(id);
	},
	//顶级页面创建蒙版
	maskTop:function(id){
		var top;
		
		top=window.top===window.self? this:window.top.window.$.jkj.layer;
		
		return top.mask(id);
	},
	//移除指定层
	remove:function(id){
		var myLayer;
		
		myLayer=this.get(id);
		if(myLayer!=null){
			myLayer.close();
		}
	},
	//移除所有层(蒙版，加载，加载含内容)
	removeAll:function(){
		var layers;
		
		layers=$.jkj.data.page.layers||[];
		//移除当前页
		$(layers).each(function(i, item){
			item.close();
		});
		//移除父页面
		if(window.parent!==window.self){
			layers=window.parent.window.$.jkj.data.page.layers||[];
			$(layers).each(function(i, item){
				item.close();
			});
		}
		//移除top页面
		if(window.top!==window.self&&window.top!==window.parent){
			layers=window.top.window.$.jkj.data.page.layers||[];
			$(layers).each(function(i, item){
				item.close();
			});
		}
	},
	//设置加载层消息
	setMessage:function(id,message){
		var myLayer;
		
		myLayer=this.get(id);
		myLayer.setMessage(message);
	}
};

//加载内容(当前元素内显示加载效果)
$.fn.loadWithZoneLayer = function (url, data, callback, autoClose) {
    if ($(this).length === 0) {
        return;
    }
    var myLayer;
    
    if(typeof autoClose !=='boolean'){
    	autoClose=true;
    }
    myLayer=$.jkj.layer.loadingZone($(this),'数据加载中...');
    if($(this).find('.layer-content').length==0){
    	$(this).prepend('<div class="layer-content"></div>');
    }
    return $(this).find('.layer-content').load(url, data, function (response, status, xhr) {
        if (callback){
            if(autoClose){
        		callback.call(this, response);
        		myLayer.close();
        	}else{
            	callback.call(this, response, myLayer);
        	}
        }
        else{
        	myLayer.close();
        }
    }).error(function () {
        myLayer.setMessage('系统加载失败...');
    });
};

//加载内容(带加载效果)
$.fn.loadWithPageLayer = function (url, data, callback, autoClose) {
    if ($(this).length === 0) {
        return;
    }
    var myLayer;
    
    if(typeof autoClose !=='boolean'){
    	autoClose=true;
    }
    myLayer=$.jkj.layer.loading('数据加载中...');
    return $(this).load(url, data, function (response, status, xhr) {
        if (callback){
        	if(autoClose){
        		callback.call(this, response);
        		myLayer.close();
        	}else{
            	callback.call(this, response, myLayer);
        	}
        }
        else{
        	myLayer.close();
        }
    }).error(function () {
        myLayer.setMessage('系统加载失败...');
    });
};