let templates = require('./templates.js').templates;

exports.render = function (input, headers, sort, widths, template, keys, limit, rank) {
	let data;
	if (Array.isArray(input)) data = Array.from(input);
	else if (typeof(input) == 'object' && Array.isArray(keys)) data = Object.keys(input).map(player => keys.map(key => input[player][key]));
	else return null;
	let board = require('./board.js').board;
	if (!templates[template]) return null;
	data = data.map(row => row.map(term => term.toString().replace(/</g, '&lt;'))); // Escape <
	return board(headers, data, sort, templates[template], widths, rank, limit);
}