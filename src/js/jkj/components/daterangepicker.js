$.jkj.daterangepicker = function(id, options) {
	var settings, templates, beginDate, endDate, startElementId, endElementId, changedOnce;

	startDate = endDate = $.jkj.util.date.getTodayStr();
	changedOnce = false;
	settings = {
		locale: {
			applyLabel: '选择',
			cancelLabel: '清除',
			fromLabel: '起始时间',
			toLabel: '结束时间',
			weekLabel: '周',
			customRangeLabel: '自定义范围',
			daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
			monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
		},
		startDate: startDate,
		endDate: endDate,
		startElementName: 'beginDate',
		endElementName: 'endDate',
		showDropdowns: true,
		maxDate: '2250-01-01',
		format: 'YYYY-MM-DD',
		callback: function(startDate, endDate) {
			$('#'+startElementId).val(startDate.format(options.format));
			$('#'+endElementId).val(endDate.format(options.format));
			changedOnce=true;
		},
		cancelHanddle: function() {
			$(id).val('');
			$('#'+startElementId).val('');
			$('#'+endElementId).val('');
			$(id).blur();
		},
		applyHanddle: function() {
			if(!changedOnce){
				var daterangepicker=$(id).data('daterangepicker');
				$('#'+startElementId).val(daterangepicker.startDate.format(options.format));
				$('#'+endElementId).val(daterangepicker.endDate.format(options.format));
				changedOnce=true;
			}
			$(id).blur();
		}
	};
	templates = {
		startElement: function() {
			return '<input type="hidden" id="' + startElementId + '" name="' + options.startElementName + '" value="">';
		},
		endElement: function() {
			return '<input type="hidden" id="' + endElementId + '" name="' + options.endElementName + '" value="">';
		}
	};
	options = $.extend(true, settings, options);
	id = id.trim();
	if(id.indexOf('#') < 0) {
		id = '#' + id;
	}
	startElementId = id.substring(1) + '-' + options.startElementName;
	endElementId = id.substring(1) + '-'  + options.endElementName;
	$(id).after(templates.endElement());
	$(id).after(templates.startElement());
	
	// 控件初始化
	$(id).daterangepicker(options, options.callback)
		.on("cancel.daterangepicker", function(e) {
			options.cancelHanddle.call(this);
		}).on("apply.daterangepicker", function(e) {
			options.applyHanddle.call(this);
		});
	// 清除日期
	$(id).__proto__.clearDate=function(){
		$(id).val('');
		$('#'+startElementId).val('');
		$('#'+endElementId).val('');
		changedOnce=false;
	}
}