// global vars //

config = require('./config.js');
root = __dirname;
nodeRequire = require;
NPsettings = {};

// Include dependencies //

var express = require('express');
var swig = require('swig');
var path = require('path');
var fs = require('fs');
var routes = require('./routes.js');
var lessMiddleware = require('less-middleware');
var bodyParser = require('body-parser');
var session = require('express-session');
var swigFilters = require('./lib/swigFilters.js');
var lib = require('./lib/lib.js');
var auth = require('./lib/auth.js');
var browserify = require('browserify-middleware');
var lang = require('./lib/lang.js');
var session = require('express-session')
var FSStore = require('connect-fs2')(session)
var cookieParser = require('cookie-parser');
var jsonModel = require(root + '/lib/jsonModel.js');

app = express();

// Set settings //

jsonModel.list('settings', function (settings) {
	NPsettings = settings;
});

// Initialize Template Engine //

swigFilters.addFilters(swig);
app.engine('twig', swig.renderFile);
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'view'));

// Initialize Express Middleware //

app.use(bodyParser.urlencoded({extended: true}));
app.use(lessMiddleware(path.join(__dirname, 'assets'), {force: true}));
app.use('/js', browserify(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(cookieParser());

app.use(session({
	secret: 'ea71dab0e1d4c058aaaec7faf9660173d3e7623b',
	unset: 'destroy',
	saveUninitialized: true,
	store: new FSStore(), //disk store
	cookie: {maxAge: 14 * 24 * 3600 * 1000} //Session browser cookie: http://www.senchalabs.org/connect/session.html
}));

app.set('view cache', false);
swig.setDefaults({cache: false, autoescape: false});

// Modify the render function according to our needs //

app.all('/*', function (req, res, next) {
	console.log("Request:", lib.getCurrentUri(req));
	next();
});

app.do404 = function (res) {
	res.status(404);
	res.render('page404.twig');
};

app.do500 = function (res) {
	res.status(500);
	res.render('page500.twig');
}

app.do401 = function (req, res) {
	res.status(401);
	res.render('login.twig', {
		'ref': lib.getCurrentUri(req)
	});
}
app.do550 = function (req, res, msg) {
	if (!msg) {
		//console.log(msg);
		var msg = "U heeft niet voldoende rechten om deze pagina te bezoeken. Om toegang te krijgen tot de admin panel moet u eerst uitloggen en dan opnieuw inloggen met de juiste rechten."
	}
	res.status(550);
	res.render('auth/permissionDenied.twig', {
		//'ref': lib.getCurrentUri(req)
		msg: msg
	});
}

app.use(function (req, res, next) {
	var render = res.render;

	res.render = function (view, locals, cb) {

		// Add lang

		res.locals.lang = lang['nl'];

		// Add flash notifications
		if (typeof res.locals.notifications == 'undefined') {
			res.locals.notifications = Array();
		}

		if (typeof req.session.flashNotifications != 'undefined') {
			for (i in req.session.flashNotifications) {
				res.locals.notifications.push({
					type: req.session.flashNotifications[i].type,
					string: req.session.flashNotifications[i].string
				});
				console.log("Pushing the notification");
			}

			delete req.session.flashNotifications;
		}

		// Push view as bodyClass
		res.locals.viewName = view.split('.')[0];

		// Enable ?JSON
		if (config.hasOwnProperty('environment') && config.environment == 'dev' && req.param('json')) {
			var json_context = lib.merge(res.locals, locals);
			res.jsonp(json_context);

		} else {
			render.call(res, view, locals, cb);
		}

	};
	next();
});


app.get('/renderTemplate/:file', function (req, res) {
	var fileName = req.param('file').replace('.twig.js', '');

	res.set({
		'Content-Type': 'application/javascript',
		'Accept-Ranges': 'bytes'
	});

	var filePath = root + '/view/' + fileName + '.twig';

	if (fileName.indexOf('/') !== -1) {
		fileName = fileName.split('/');
		fileName = fileName[fileName.length - 1];
	}

	console.log('Render template', filePath);

	fs.readFile(filePath, 'utf8',
		function (err, templateString) {
			if (err) {
				return console.log(err);
			}
			var swigTemplate = swig.precompile(templateString, {filename: "categorySelector"})
				.tpl.toString().replace('anonymous', lib.textTransformations.camelCase(fileName));
			res.send(swigTemplate);
		});
});

// HTTP Routing //

var controllers = Array();

for (route in routes) {

	var routeAction = function (route) {
		return function (req, res) {
			auth.isAuth(req, function (result) {
				if (!result.data.auth && route.auth) {
					app.do401(req, res);
				} else {
					var controllerName = route.controller;
					var controllerAction = route.action;
					if (undefined == controllers[controllerName]) {
						controllers[controllerName] = require('./controller/' + lib.textTransformations.ucfirst(controllerName) + 'Controller.js');
					}
					controllers[controllerName][controllerAction](req, res);
				}
			});
		}
	};

	if (routes[route].all) {
		app.all(String(route), routeAction(routes[route].all));
	} else {
		if (routes[route].get) {
			app.get(String(route), routeAction(routes[route].get));
		}
		if (routes[route].post) {
			app.post(String(route), routeAction(routes[route].post));
		}
	}
}
module.exports.init = function () {
	app.listen((NPconfig.adminPort) ? NPconfig.adminPort : 10000);
}



