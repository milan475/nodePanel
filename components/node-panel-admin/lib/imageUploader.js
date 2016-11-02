var lib = require('../iso/lib.js');
var modals = require('./modals.js');

var ImageUploader = function (input, options) {

	var self = this;
	var $input = $(input);

	var defaults = {
		label: 'Kies een foto'
	}

	var options = $.extend(defaults, options);

	if ($input.attr('data-popup')) {
		options.label = "Voeg foto toe"
	}


	$input.hide();
	var uid = lib.uid();
	$input.after('<div id="' + uid + '" class="imageUploadField">' +
		'<div class="label">' + options.label + '</div>' +
		'</div>');
	var uploadField = document.getElementById(uid);
	var iframeUid = lib.uid();
	$(uploadField).append('<iframe name="' + iframeUid + '" style="display:none;" />');
	$(uploadField).append('<form method="post" enctype="multipart/form-data" action="/image/upload" target="' + iframeUid + '" class="uploadForm">' +
		'<input name="image" type="file" class="fileInput" style="display:none;">' +
		'<div class="preview"></div>' +
		'<div class="actions">' +
		'<a class="edit" href="javascript:void(0)">Bewerk</a><br />' +
		'<a class="clear" href="javascript:void(0)">Verwijder</a>' +
		'</div>' +
		'</form>');

	self.startLoadState = function () {
		$(uploadField).addClass('loading');
		$('.imageUploadModal .imageUploadField').addClass('loading');
	};

	self.endLoadState = function () {
		$(uploadField).removeClass('loading');
		$('.imageUploadModal .imageUploadField').removeClass('loading');
	};

	self.startPreviewState = function () {

		$(uploadField).unbind('click');
		$(uploadField).addClass('previewState');

		$('.imageUploadModal .imageUploadField').unbind('click');
		$('.imageUploadModal .imageUploadField').addClass('previewState');

	};

	self.pickPhoto = function () {
		if (!$input.attr('data-popup')) {
			$(uploadField).find('.fileInput')[0].click();
		} else {
			var addProjectModal = modals.openSwigModal('photoModal', {}, function () {

				if ($(uploadField).hasClass('previewState')) {
					addProjectModal.startLoadState();
					$('.imageUploadModal .preview').remove();
					$(uploadField).find('.preview').clone().prependTo('.imageUploadModal .imageUploadField');
					$.get('/image/getUrl/' + $input.val(), function (response) {
						$('.imageUploadModal .credits').val(response.data.credits);
						$('.imageUploadModal .photo-description').val(response.data.description);
						addProjectModal.endLoadState();
					})
				} else {

				}

				$('.imageUploadModal .imageUploadField').add('.imageUploadModal .edit').click(function () {
					$(uploadField).find('.fileInput')[0].click();
				});

				$('.imageUploadModal .clear').click(function () {
					$(uploadField).find('.clear')[0].click();
					addProjectModal.closeModal();
				});

				if ($(uploadField).hasClass('previewState')) {
					self.startPreviewState();
				}

				$('.imageUploadModal .buttons .pic-save').click(function () {
					if (!$input.val()) {
						alert('U moet eerst een afbeelding uploaden');
					} else {
						$.post('/image/setMediaProps/' + $input.val(), {
							'credits': $('.imageUploadModal .credits').val(),
							'description': $('.imageUploadModal .photo-description').val()
						}, function (data) {
							addProjectModal.closeModal();
						})
					}
				});

			});
		}
	}

	self.endPreviewState = function () {
		$(uploadField).unbind('click').click(function () {
			self.pickPhoto();
		});
		$('.imageUploadModal .imageUploadField').removeClass('previewState');
		$(uploadField).removeClass('previewState');
	};

	$(uploadField).find('.edit').click(function (e) {
		e.preventDefault();
		self.pickPhoto();
	});

	$(uploadField).click(function () {
		self.pickPhoto();
	});

	$(uploadField).find('.clear').click(function (e) {
		e.preventDefault();
		input.value = '';
		setTimeout(self.endPreviewState, 10);

		// Let de parent of image element know the photo has been removed
		$(this).parent().parent().parent().parent().trigger("removePhoto");
		console.log($(this).parent().parent().parent().parent());
	})

	if (input.value) {
		self.startLoadState();
		$.get('/image/getUrl/' + input.value, function (result) {
			self.endLoadState();
			self.startPreviewState();
			$(uploadField).find('.preview')[0].style.backgroundImage = 'url(' + result.data.filePath + ')';
		});
	}

	$(uploadField).find('.fileInput').change(function () {
		if (this.value && !$(this).parent().parent().hasClass('previewState')) {
			// Let the container of the inputs know a photo has been added
			$(this).parent().parent().parent().parent().trigger('addPhoto');
		}
		if (this.value) {
			$(uploadField).find('.uploadForm')[0].submit();
			self.endPreviewState();
			self.startLoadState();
			$('[name=' + iframeUid + ']').unbind('load').bind('load', function () {
				var result = JSON.parse(this.contentWindow.document.body.textContent);
				if (result && result.success) {
					self.endLoadState();
					self.startPreviewState();
					$(uploadField).find('.preview')[0].style.backgroundImage = 'url(' + result.data.filePath + ')';
					if ($('.imageUploadModal .imageUploadField').find('.preview').length > 0) {
						$('.imageUploadModal .imageUploadField').find('.preview')[0].style.backgroundImage = 'url(' + result.data.filePath + ')';
					}
					$input.val(result.data.mediaId);
					console.log(result.data.mediaId);
				}
			});
		}
	});
};

module.exports = ImageUploader;