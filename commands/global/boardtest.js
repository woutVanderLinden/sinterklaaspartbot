module.exports = {
	cooldown: 1,
	help: ``,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		delete require.cache[require.resolve('../../data/board.js')];
		Bot.say(room, '/addhtmlbox ' + require('../../data/board.js').board(
			['Name', 'Points'],
			[['PartMan', 100], ['Hydro', 200], ['John Smith', 10]],
			(data) => {
				return data[1];
			},
			["font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:2px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#fff;background-color:#f38630;font-weight:bold;border-color:inherit;text-align:left;vertical-align:top;",
			"font-family:Arial, sans-serif;padding:2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#333;background-color:#fff;background-color:#FCFBE3;border-color:inherit;text-align:center;vertical-align:top;font-weight:bold;",
			"font-family:Arial, sans-serif;padding:2px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#333;background-color:#fff;border-color:inherit;text-align:center;vertical-align:top;font-weight:bold;"],
			args, 'Rank'));
	}
}