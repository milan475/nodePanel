$('document').ready(function () {
	$('.git-checkbox').change(function () {
		if ($(this).is(':checked')) {
			$('.git-controls').show();
		} else {
			$('.git-controls').hide();
		}
	})

	$('#doGitClone').click(function (e) {
		e.preventDefault();
		$.post('/git/cloneIntoDir', {
			dir: $('input[name=path]').val(),
			repo: $('#gitRepoUrl').val()
		}, function (result) {
			console.log(result);
		})
	})
});