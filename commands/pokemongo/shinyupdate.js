module.exports = {
	cooldown: 0,
	help: `Updates PartBot's internal shiny list`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		const URLS = {
			names: 'https://raw.githubusercontent.com/Rplus/Pokemon-shiny/master/assets/name.json',
			shinies: ''
		};
		const formes = {
			_61: '-Alola',
			_31: ['-Galar', 'Unown']
		};
	}
};
