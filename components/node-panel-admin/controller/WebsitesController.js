var fs = require('fs');
var lib = require(root + '/lib/lib.js');
var jsonModel = require(root + '/lib/jsonModel.js');

module.exports = {
	list: function (req, res) {
		jsonModel.list('websites', function (websites) {
			res.render('websites', {
				activePage: 'websites',
				websites: websites
			});
		});
	},
	create: function (req, res) {
		var newWebsite = req.body;
		newWebsite.path = NPsettings.storagePath + lib.slugify(newWebsite.name);
		jsonModel.save('websites', newWebsite, function (success) {

			fs.exists(newWebsite.path, function (exists) {
				if (!exists) {
					fs.mkdir(newWebsite.path);
				}
			});

			NP.WebServer.reloadWebsites();

			res.jsonp({
				success: success
			})
		});
	},
	remove: function (req, res) {
		var websiteId = req.param('id');
		jsonModel.remove('websites', websiteId, function (success) {
			res.jsonp({
				success: success
			});

			NP.WebServer.reloadWebsites();
		})
	},
	edit: function (req, res) {
		var websiteId = req.param('id');
		jsonModel.getById('websites', websiteId, function (website) {

			// Find out if there's any git stuff in the website's dir...

			var gitIsInitialized = fs.existsSync(website.path + '/.git');

			res.render('website-edit', {
				activePage: 'websites',
				website: website,
				gitIsInitialized: gitIsInitialized
			});


		});
	},
	save: function (req, res) {
		var websiteData = req.body;
		var websiteId = req.param('id');
		websiteData['id'] = websiteId;
		jsonModel.update('websites', websiteData, function (success) {
			if (success) {
				res.redirect('/websites');
			}
		});
	}
}