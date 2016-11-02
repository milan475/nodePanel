var swigFilters = {
	addFilters: function (swig) {
		swig.setFilter('explode', swigFilters.explodeFilter);
		swig.setFilter('checkForHttp', swigFilters.checkForHttpFilter);
		swig.setFilter('length', swigFilters.swigLengthFilter);
		swig.setFilter('digitToMonth', swigFilters.digitToMonthFilter);
		swig.setFilter('sanitize', swigFilters.sanitizeStringFilter);
		swig.setFilter('currentYear', swigFilters.currentYearFilter);
		swig.setDefaults({
			locals: {
				range: function (start, len) {
					return (new Array(len)).join().split(',').map(function (n, idx) {
						return idx + start;
					});
				}
			}
		});
	},
	checkForHttpFilter: function (input) {
		if (input.indexOf('://') != -1) {
			return input;
		} else {
			return 'http://' + input;
		}
	},
	explodeFilter: function (input) {
		return input.split('; ');
	},
	swigLengthFilter: function (input) {
		return input.length;
	},

	sanitizeStringFilter: function (input) {
		return input.replace('*', '').replace(' ', '-').toLowerCase();
	},
	digitToMonthFilter: function (input) {
		var months = ["januari", "februari", "maart", "april", "mei", "juni",
			"juli", "augustus", "september", "oktober", "november", "december"];
		return months[input - 1];
	},
	currentYearFilter: function() {
		return new Date().getFullYear();
	}

}

if (typeof module != 'undefined') {
	module.exports = swigFilters;
}
