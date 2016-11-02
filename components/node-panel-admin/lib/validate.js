$('document').ready(function () {

	$('form.js-validate input').bind('keydown keyup change', function () {
		$(this).removeClass('error');
	});

	$('form.js-validate').submit(function (event) {

		var $theForm = this;
		var validate = true;

		$(this).find('input').each(function () {
			if ($(this).hasClass('req') && this.value == '') {
				validate = false;
				$(this).addClass('error');
			}
		});


		if (!validate) {
			event.preventDefault();
		}

	});
});

