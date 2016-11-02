NProot = __dirname;
NP = [];

// Initialize Web Server
NP.WebServer = require('./components/node-panel-admin/component.js');
NP.WebServer.init();

// Initialize Panel
NP.AdminPanel = require('./components/node-panel-webserver/component.js');
NP.AdminPanel.init();