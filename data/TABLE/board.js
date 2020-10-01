exports.board = function (inputHeaders, input, sort, styling, widths, rank, limit) {
	/*
	headers: string[] - headers is an array of the array headers; ie, the title row. The length of headers must match the number of columns.
	input: [[]] - input is a nested array of the input of the table.  input.length may be arbitrarily long, but must be at least one. Each element in input must be an array of the same length as headers.
	sort: function - sort is a single function that is run on each input element. The elements in input are then sorted in (descending) order of these outputs. This function runs on each data row, and takes the whole row as an spread input.
	styling: string[] - styling is the styilng applied to separate elements. Each element is of the form css, such that style="${styling[i]}"" is applied. Has three elements: [0] is header styling, [1] is odd row styling, [2] is even row styling.
	widths: number[] - width is an array that takes the width of each column. If not found, the board automatically equalizes all column widths. This is simply of the form 'npx' or 'n%'.
	rank: string - creates a new column at the beginning with the ranks. The label on this column is the value. if undefined, does not create the column. widths must account for this. sort must not.
	limit: number - Maximum entries to display.
	*/
	let headers = Array.from(inputHeaders);
	if (!Array.isArray(headers) || !headers[0] || typeof headers[0] !== 'string') return 1;
	if (!Array.isArray(input) || !input[0] || !Array.isArray(input[0])) return 2;
	if (typeof sort !== 'function') return 3;
	if (!Array.isArray(styling) || styling.length !== 3 || typeof styling[0] !== 'string') return 4;
	let data = Array.from(input).filter(row => row.length == headers.length);
	if (rank) headers.unshift(rank);
	if (!widths || !Array.isArray(widths)) widths = Array.from({length: headers.length}).fill(Math.floor(100 / headers.length) + '%');
	let html = '<table style="border-collapse:collapse; border-spacing:0; border-color:#aaa;"><colgroup>';
	for (let i = 0; i < headers.length; i++) html += `<col style="width:${widths[i]}">`;
	html += '</colgroup>';
	html += '<tr>';
	for (let i = 0; i < headers.length; i++) html += `<th style="${styling[0]}">${headers[i]}</th>`;
	html += '</tr>';
	if (!data.length) return 5;
	try {
		data.sort((x, y) => {
			return sort(y) - sort(x);
		}).forEach((row, index) => {
			if (rank) row.unshift(index + 1);
		});
		html += data.map((row, index) => {
			if (limit && index >= limit) return;
			let text = '<tr>';
			if (index % 2 == 0) text += row.map(term => `<td style="${styling[1]}">${term}</td>`).join('');
			else text += row.map(term => `<td style="${styling[2]}">${term}</td>`).join('');
			text += '</tr>';
			return text;
		}).join('');
		html += '</table>';
		return html;
	} catch (e) {
		console.log(e);
		return e.message;
	}
}
