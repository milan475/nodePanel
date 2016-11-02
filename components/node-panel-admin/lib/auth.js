var lib = require(root + '/lib/lib.js');
var fs = require('fs');
var _ = require('underscore');

var auth = {
	isAuth: function (req, callback) {
		if (req.session.auth) {
			var data = {auth: true};
			callback({"success": true, data: data});
		} else if (req.param('username') && req.param('password')) {
			auth.doAuth(
				req.param('username'),
				req.param('password'),
				req,
				callback
			);
		} else {
			var data = {auth: false}
			callback({"success": false, data: data});
		}
	},

	getUserId: function (req) {
		return req.session.user.id;
	},

	getUserName: function (req) {
		return req.session.user.username;
	},

	doAuth: function (username, password, req, callback) {
		fs.readFile(NProot + '/settings/users.json', function (err, data) {
			var users = JSON.parse(data);
			_.each(users, function (user) {
				if (user.username == username && user.password == lib.sha1(password)) {
					req.session.auth = true;
					req.session.user = user;
					var data = {auth: true}
					callback({"success": true, data: data});
				}
			})
		});
	},
	endAuth: function (req) {
		req.session.auth = false;
		req.session.user = Array();
	}
}

module.exports = auth;