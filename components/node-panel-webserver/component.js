var express = require('express');
var fs = require('fs');
var _ = require('underscore');
var php = require("node-php");
var bouncy = require('bouncy');
var portStart = 8000;

var WebServer = {
	init: function () {
		WebServer.reloadWebsites(function () {
			var server = bouncy(function (req, res, bounce) {
				var foundHost = false;
				_.each(websites, function (website) {
					if (website.domains.split(',').indexOf(req.headers.host) !== -1) {
						foundHost = true;
						bounce(website.port);
					}
				});
				if (!foundHost) {
					res.statusCode = 404;
					res.end('This website is not hosted on this server');
				}
			});

			server.listen(80);
		});
	},
	reloadWebsites: function (callback) {

		if (typeof servers != 'undefined') {
			for (var i in servers) {
				servers[i]['listener'].close();
			}
			delete servers;
		}

		servers = [];
		websites = [];

		fs.readFile('./settings/websites.json', function (err, data) {
			websites = JSON.parse(data);

			var portIndex = 0;
			_.each(websites, function (website) {

				servers[website.name] = express();

				servers[website.name].use("/", function (req, res, next) {
					console.log('Got a request for: ' + website.name);
					next();
				})

				if (website.type == 'php') {
					servers[website.name].use("/", php.cgi(website.path));
				} else {
					console.log(website.path);
					servers[website.name].use(express.static(website.path));
				}

				website.port = portStart + portIndex;
				servers[website.name]['listener'] = servers[website.name].listen(website.port);
				portIndex++;
			});

			if (typeof callback != 'undefined') {
				callback();
			}
		});
	}
};

module.exports = WebServer;