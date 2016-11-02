$ = jQuery = require('jquery');

require('../assets/semantic/dist/semantic');

domBindings = function () {
	$('.ui.dropdown').dropdown();
	$('.ui.checkbox').checkbox();
	$('form[data-ajax=true]').unbind('submit.ajax').bind('submit.ajax', function (event) {
		var form = this;
		event.preventDefault();
		$(form).trigger('ajax-submit-start');
		$.post($(this).attr('action'), $(this).serialize(), function () {
			$(form).trigger('ajax-submit-done');
		});
	});
};

$('document').ready(function () {
	domBindings();
});