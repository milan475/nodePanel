var routes = {


	"/": {
		"all": {
			"controller": "default",
			"action": "default",
			"auth": true
		}
	},
	"/websites": {
		"all": {
			"controller": "websites",
			"action": "list",
			"auth": true
		}
	},
	"/websites/create": {
		"post": {
			"controller": "websites",
			"action": "create",
			"auth": true
		}
	},
	"/websites/remove/:id": {
		"get": {
			"controller": "websites",
			"action": "remove",
			"auth": true
		}
	},
	"/websites/edit/:id": {
		"get": {
			"controller": "websites",
			"action": "edit",
			"auth": true
		}
	},
	"/websites/save/:id": {
		"all": {
			"controller": "websites",
			"action": "save",
			"auth": true
		}
	},
	"/git/cloneIntoDir": {
		"post": {
			"controller": "git",
			"action": "cloneIntoDir",
			"auth": true
		}
	},
	"/logout": {
		"all": {
			"controller": "auth",
			"action": "logout",
			"auth": false
		}
	}


}

module.exports = routes;