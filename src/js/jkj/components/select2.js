$.jkj.select2 = {
	_init: function(element, options) {

		if($.fn.select2 === undefined || $.fn.select2 == null) {
			throw new Error('$.jkj.select2 init error');
		}

		var select2 = $(element).select2(options);
		return select2;
	},
	local: function(element, settings) {
		var options = {
			placeholder: "请选择",
			allowClear: true,
			language: "zh-CN",
			defaultSelected: false
		};

		$.extend(true, options, settings);
		var select2 = this._init(element, options);

		if(!options.defaultSelected) {
			select2.val(0).trigger("change");
		}

		return select2;
	},
	remote: function(element, settings) {

		var select2 = this._init(element, {});
		var url = settings.ajax.url;
		var extra = settings.ajax.extra;
		var success = settings.ajax.success;
		delete settings.ajax;

		$.getJSON(url, extra, function(data) {
			var options = {
				placeholder: "请选择",
				allowClear: true,
				language: "zh-CN",
				defaultSelected: false
			};

			$.extend(true, options, settings);
			options.data = data.list;
			select2.select2(options);

			if(!options.defaultSelected) {
				select2.val(0).trigger("change");
			}
			if($.isFunction(success)){
				success.call(this);
			}
		});

		return select2;
	},
	autocomplete: function(element, settings) {
		var options = {
			ajax: {
				url: "select2.json",
				dataType: 'json',
				delay: 300,
				extra: {},
				data: function(params) {
					var p = {};
					p[options.paramName] = params.term;

					if(options.pageable) {
						p.pageNumber = params.page || 1;
						p.pageSize = options.pageSize;
					}

					return p;
				},
				processResults: function(data, params) {
					var rlts = {};
					rlts.results = data.list;

					if(options.pageable) {
						params.page = params.page || 1;
						rlts.pagination = {};
						rlts.pagination.more = (params.page * data.page.pageSize) < data.page.total;
					}

					return rlts;
				},

				cache: true
			},
			escapeMarkup: function(markup) {
				return markup;
			},
			allowClear: true,
			pageable: false,
			language: "zh-CN",
			placeholder: "请选择",
			pageSize: 20,
			minimumInputLength: 1,
			maximumSelectionLength: 50,
			textFiled: "text",
			paramName: "search",
			formatResult: null,
			formatSelection: null,
			templateResult: function(repo) {
				if(repo.loading) {
					return "正在加载...";
				}

				if(!options.formatResult) {
					return repo[options.textFiled];
				}

				var r1 = options.formatResult.match(/{\w+}/g);
				var markup = options.formatResult;

				for(var i = 0; i < r1.length; i++) {
					markup = markup.replace(r1[i], repo[r1[i].substring(1, r1[i].length - 1)]);
				}

				return markup;
			},
			templateSelection: function(repo) {
				if(repo.id === '') {
					return repo.text;
				}

				if(!options.formatSelection) {
					return repo[options.textFiled];
				}
				
				var markup = typeof options.formatSelection === 'string' ? options.formatSelection : $.isFunction(options.formatSelection) ? options.formatSelection(repo):'';
				var r2 = markup.match(/{\w+}/g);

				for(var i = 0; i < r2.length; i++) {
					markup = markup.replace(r2[i], repo[r2[i].substring(1, r2[i].length - 1)]);
				}

				return markup;
			}
		};

		$.extend(true, options, settings);
		var select2 = this._init(element, options);
		return select2;
	}
};