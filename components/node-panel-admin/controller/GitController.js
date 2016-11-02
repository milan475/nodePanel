var fs = require('fs');
var lib = require(root + '/lib/lib.js');
var Git = require("nodegit");

module.exports = {
	cloneIntoDir: function (req, res) {
		var dir = req.body.dir;
		var repoUrl = req.body.repo;

		if (fs.readdirSync(dir).length == 0) {

			var fetchOpts = {
				callbacks: {
					certificateCheck: function () {
						return 1;
					},
					credentials: function () {
						return Git.Cred.userpassPlaintextNew('milan475', 'soepkip67');
					},
				}
			};

			var cloneOptions = {
				fetchOpts: fetchOpts
			};

			Git.Clone(repoUrl, dir, cloneOptions).then(function (repo) {
				res.jsonp({
					success: true
				})
			}).catch(function (error) {
				console.log(error);
			});

		} else {
			res.jsonp({
				success: false,
				msg: "Not an empty directory"
			});
		}


	}
}