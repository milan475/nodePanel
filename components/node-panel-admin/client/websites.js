var Modal = require('../lib/modals.js');

$('document').ready(function () {

	$('.button.add-new-website').click(function () {
		var newWebsiteModal = Modal.openSwigModal('add-new-website', {}, function () {
			domBindings();

			$('.form.add-new-website').on('ajax-submit-start', function () {
				newWebsiteModal.startLoadState();
			});

			$('.form.add-new-website').on('ajax-submit-done', function () {
				window.location.reload();
			})

		});
	});


	$('a.remove-website').click(function (e) {
		var anchor = this;
		var websiteId = $(anchor).parents('tr[data-itemID]').attr('data-itemID');
		var websiteName = $(anchor).parents('tr[data-itemID]').attr('data-itemName');
		e.preventDefault();

		if (confirm("Are you sure you want to delete " + websiteName + "? This will also remove all of " + websiteName + "'s files.")) {
			$.get('/websites/remove/' + websiteId, function () {
				$(anchor).parents('tr[data-itemID]').remove();
			});
		}
	});

});