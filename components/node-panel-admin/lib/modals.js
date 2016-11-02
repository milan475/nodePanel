var swigFilters = require('./swigFilters.js');
var lib = require('./lib.js');
var swig = require("swig");

function Modal() {
	var modal = this;

	modal.openFromDom = function (modalId) {
		modal.domElement = $('#' + modalId);
		modal.content = modal.domElement.find('.content');
		modal.content.wrap = modal.domElement.find('.content-wrap');
		modal.domElement.show();
		modal.endLoadState();
		modal.setUpCloseBindings();
		modal.setHeight();
	};

	modal.startLoadState = function () {
		modal.domElement.addClass('loading');
	};

	modal.endLoadState = function () {
		modal.domElement.removeClass('loading');
	};

	modal.openFromSwig = function (modalName, context, callback) {

		$('#' + modalName).remove();

		$('body').append('<div id="' + modalName + '" class="modal"><div class="overlay"></div></div>');

		modal.domElement = $('#' + modalName);
		modal.domElement.find('.overlay').append('<div class="content"><div class="content-wrap"></div></div>');
		modal.content = modal.domElement.find('.content');
		modal.content.wrap = modal.content.find('.content-wrap');

		modal.content.append('<a href="javascript:void(0);" class="close close-btn"><i class="icon close"></i></a>');
		modal.domElement.show();
		modal.setHeight();
		modal.setUpCloseBindings();

		$.getScript("/renderTemplate/modals%2F" + modalName + ".twig.js", function () {
			var camelCasedModelName = lib.textTransformations.camelCase(modalName);
			modal.content.wrap.append(swig.run(window[camelCasedModelName], context));
			modal.setHeight();
			if (typeof callback != 'undefined') {
				callback();
			}
			modal.setUpCloseBindings();
			if (typeof doPlaceholders != 'undefined') {
				doPlaceholders();
			}
		});
		$('.overlay').addClass('is-active');

	}

	modal.setUpCloseBindings = function () {
		modal.domElement.find('.overlay').unbind('click').bind('click', function (e) {
			if ($(e.target).hasClass('overlay')) {
				modal.closeModal();
			}
		});
		$(window).unbind('keydown.modal').bind('keydown.modal', function (e) {
			if (e.keyCode === 27) {
				modal.closeModal();
			}
		});
		modal.domElement.find('.close').unbind('click').bind('click', function () {
			modal.closeModal();
		});
	}

	modal.closeModal = function () {
		modal.domElement.remove();
		$('body').removeClass('no-scroll');
		$(modal).trigger('closeEvt');
	}

	modal.hide = function () {
		modal.domElement.hide();
	}

	modal.setHeight = function () {
		var height = modal.content.height() + parseInt(modal.content.css('padding-top')) + parseInt(modal.content.css('padding-bottom'));
		modal.content.css('top', '50%');
		modal.content.css('margin-bottom', '');
		modal.content.css('margin-top', '-' + (height / 2) + 'px');
		$('body').removeClass('no-scroll');

		if (modal.content.height() > $(window).height() - 100) {
			modal.content.css('top', '20px');
			modal.content.css('margin-top', 0);
			modal.content.css('margin-bottom', '50px');
			$('body').addClass('no-scroll');
		}

	}

	return modal;
}


module.exports = {

	init: function () {
		$('.modal.visible').each(function () {
			var modal = new Modal();
			modal.openFromDom(this.id);
		});
	},

	openModal: function (modalId) {
		var modal = new Modal();
		modal.openFromDom(modalId);
		return modal;
	},

	openSwigModal: function (modalName, context, callback) {
		var modal = Modal();
		modal.openFromSwig(modalName, context, callback);
		return modal;
	}

}