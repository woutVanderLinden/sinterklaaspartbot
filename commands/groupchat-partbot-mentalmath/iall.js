module.exports = {
	cooldown: 10000,
	help: `Invites all the online people in the database to the groupchat. To add / remove someone, use ${prefix}register (user) / ${prefix}deregister (user)`,
	permissions: 'alpha',
	commandFunction: function (Bot, room, time, by, args, client) {
		let users = JSON.parse(fs.readFileSync('./data/DATA/mentalmathers.json', 'utf8'));
		users.forEach(user => Bot.say(room, '/invite ' + user));
	}
}