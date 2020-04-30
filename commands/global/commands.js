module.exports = {
	cooldown: 10,
	help: `Displays a list of commands that can be used by the user. For details of individual commands, use ${prefix}help (command)`,
	permissions: 'locked',
	commandFunction: function (Bot, room, time, by, args, client) {
		let commands = {global: null, pm: null};
		let rankLevel = tools.rankLevel(by, room);
		new Promise ((resolve, reject) => {
			Object.keys(commands).forEach(category => commands[category] = {admin: [], coder: [], alpha: [], beta: [], gamma: [], none: [], locked: []});
			// Global commands
			fs.readdir('./commands/global', (err, files) => {
				if (err) return reject(console.log(err));
				files.forEach(file => {
					let req = require(`./${file}`);
					if (!req || !commands.global[req.permissions]) return;
					commands.global[req.permissions].push(file.slice(0, file.length - 3));
				});
				Object.keys(commands.global).forEach(rank => {
					if (!commands.global[rank].length && !['none', 'locked'].includes(rank)) delete commands.global[rank];
					else commands.global[rank].sort();
				});
				return resolve();
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				// PM commands
				fs.readdir('./pmcommands', (err, files) => {
					if (err) return reject(console.log(err));
					files.forEach(file => {
						let req = require(`../../pmcommands/${file}`);
						if (!req || !commands.pm[req.permissions]) return;
						commands.pm[req.permissions].push(file.slice(0, file.length - 3));
					});
					Object.keys(commands.pm).forEach(rank => {
						if (!commands.pm[rank].length && !['none', 'locked'].includes(rank)) delete commands.pm[rank];
						else commands.pm[rank].sort();
					});
					return resolve();
				});
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				// Room commands
				fs.readdir(`./commands/${room}`, (err, files) => {
					if (err) return resolve();
					commands.room = {admin: [], coder: [], alpha: [], beta: [], gamma: [], none: [], locked: []};
					files.forEach(file => {
						let req = require(`../${room}/${file}`);
						if (!req || !commands.room[req.permissions]) return;
						commands.room[req.permissions].push(file.slice(0, file.length - 3));
					});
					Object.keys(commands.room).forEach(rank => {
						if (!commands.room[rank].length && !['none', 'locked'].includes(rank)) delete commands.room[rank];
						else commands.room[rank].sort();
					});
					return resolve();
				});
			});
		}).then(() => {
			let out = '<HR><DETAILS><SUMMARY>Commands</SUMMARY><HR><DETAILS><SUMMARY><B>Global Commands</B></SUMMARY><HR>';
			['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
				if (commands.global[rank.toLowerCase()] && tools.hasPermission(rankLevel, rank.toLowerCase())) {
					out += `<DETAILS><SUMMARY>${rank} Commands</SUMMARY><HR>${tools.listify(commands.global[rank.toLowerCase()])}</DETAILS><HR>`;
				}
			});
			if (tools.hasPermission(by, 'none', room)) {
				commands.global.locked.push(...commands.global.none);
				commands.global.locked.sort();
				commands.pm.locked.push(...commands.pm.none);
				commands.pm.locked.sort();
				if (commands.room) {
					commands.room.locked.push(...commands.room.none);
					commands.room.locked.sort();
				}
			}
			out += `<DETAILS><SUMMARY>Commands</SUMMARY><HR>${tools.listify(commands.global.locked) || 'None.'}</DETAILS><HR></DETAILS><HR><DETAILS><SUMMARY><B>PM Commands</B></SUMMARY><HR>`;
			['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
				if (commands.pm[rank.toLowerCase()] && tools.hasPermission(rankLevel, rank.toLowerCase())) {
					out += `<DETAILS><SUMMARY>${rank} Commands</SUMMARY><HR>${tools.listify(commands.pm[rank.toLowerCase()])}</DETAILS><HR>`;
				}
			});
			out += `<DETAILS><SUMMARY>Commands</SUMMARY><HR>${tools.listify(commands.pm.locked) || 'None.'}</DETAILS><HR></DETAILS><HR>`;
			if (commands.room) {
				out += `<DETAILS><SUMMARY><B>${Bot.rooms[room] ? Bot.rooms[room].title : tools.toName(room)} Commands</B></SUMMARY><HR>`;
				['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
					if (commands.room[rank.toLowerCase()] && tools.hasPermission(rankLevel, rank.toLowerCase())) {
						out += `<DETAILS><SUMMARY>${rank} Commands</SUMMARY><HR>${tools.listify(commands.room[rank.toLowerCase()])}</DETAILS><HR>`;
					}
				});
				out += `<DETAILS><SUMMARY>Commands</SUMMARY><HR>${tools.listify(commands.room.locked) || 'None.'}</DETAILS><HR></DETAILS><HR>`;
			}
			out += '</DETAILS><HR>';
			Bot.sendHTML(by, out);
		});
	}
}