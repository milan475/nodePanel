var fs = require('fs');
var _ = require('underscore');

module.exports = {
	list: function (modelName, callback) {
		fs.readFile(NProot + '/settings/' + modelName + '.json', function (err, data) {
			if (data) {
				callback(JSON.parse(data));
			}
		});
	},
	save: function (modelName, newData, callback) {
		var filePath = NProot + '/settings/' + modelName + '.json';
		fs.readFile(filePath, function (err, data) {
			if (data) {
				var id;
				var currentData = JSON.parse(data);
				if (currentData.length > 0 && currentData[0].hasOwnProperty('id')) {
					id = currentData[currentData.length - 1].id + 1;
				} else {
					id = 0;
				}
				newData.id = id;
				currentData.push(newData);
				fs.writeFile(filePath, JSON.stringify(currentData), function (err) {
					if (err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			} else {
				callback(false);
			}
		});
	},
	remove: function (modelName, itemId, callback) {
		var filePath = NProot + '/settings/' + modelName + '.json';
		fs.readFile(filePath, function (err, data) {
			if (data) {
				var newData = [];
				var currentData = JSON.parse(data);
				_.each(currentData, function (item) {
					if (item.id != itemId) {
						newData.push(item);
					}
				})
				fs.writeFile(filePath, JSON.stringify(newData), function (err) {
					if (err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			} else {
				callback(false);
			}
		});
	},
	update: function (modelName, newData, callback) {
		var filePath = NProot + '/settings/' + modelName + '.json';
		fs.readFile(filePath, function (err, data) {
			var dataToBeSaved = [];
			_.each(JSON.parse(data), function (item) {
				if (item.id == newData.id) {
					dataToBeSaved.push(_.extend(item, newData));
				} else {
					dataToBeSaved.push(item);
				}
			});
			fs.writeFile(filePath, JSON.stringify(dataToBeSaved), function (err) {
				if (err) {
					callback(false);
				} else {
					callback(true);
				}
			});
		});
	},
	getById: function (modelName, itemId, callback) {
		var filePath = NProot + '/settings/' + modelName + '.json';

		var found = false;

		fs.readFile(filePath, function (err, data) {
			_.each(JSON.parse(data), function (item) {
				if (item.id == itemId) {
					found = true;
					callback(item);
				}
			})
			if (!found) {
				callback(false)
			}
		});
	}
}