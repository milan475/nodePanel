var auth = require(root + '/lib/auth.js');

module.exports = {
	logout: function (req, res) {
		auth.endAuth(req);
		res.redirect('/');
	}
}