var notifications = function () {
	var notifications = this;

	notifications.strings = {
		'username cannot be null': "Je hebt geen geldige gebruikersnaam ingevuld",
		'email cannot be null': "Je hebt geen geldig e-mailadres ingevuld",
		'name cannot be null': "Je hebt geen geldige naam ingevuld",
		'projectNumber cannot be null': "Je hebt geen geldig projectnummer ingevuld"
	}

	notifications.slugToString = function (slug) {
		if (notifications.strings.hasOwnProperty(slug)) {
			return notifications.strings[slug];
		} else {
			return slug;
		}
	}

	notifications.addNotification = function (res, type, slug) {
		if (typeof res.locals.notifications == 'undefined') {
			res.locals.notifications = Array();
		}
		res.locals.notifications.push({
			'type': type,
			'string': notifications.slugToString(slug)
		});
	}

	notifications.clientNotification = function (type, slug) {
		var msg = notifications.slugToString(slug);
		$('.notifications').append("<div class='notif " + type + "'>" +
			"<div class='msg'>" + msg + "</div><a href='javascript:void(0);' class='close s s-close'></a>" +
			"</div>");
		notifications.setCloseBindings();
	}

	notifications.setCloseBindings = function () {
		$('.notifications')
			.find('.close')
			.unbind('click')
			.bind('click', function () {
				$(this).parents('.notif').remove();
			});
	}

	notifications.addFlashNotification = function (req, type, slug) {
		if (!req.session.flashNotifications) {
			req.session.flashNotifications = Array();
		}
		req.session.flashNotifications.push({
			'type': type,
			'string': notifications.slugToString(slug)
		});
	}

	return notifications;
};

module.exports = notifications();