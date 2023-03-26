module.exports = {
	cooldown: 10,
	help: `Displays a list of commands that can be used by the user. For details of individual commands, use ${prefix}help (command)`,
	permissions: 'locked',
	commandFunction: function (Bot, room, time, by, args, client) {
		const commands = { global: null, pm: null };
		const rankLevel = tools.rankLevel(by, room), gLevel = tools.rankLevel(by, 'global');
		new Promise((resolve, reject) => {
			Object.keys(commands).forEach(category => commands[category] = {
				admin: [],
				coder: [],
				alpha: [],
				beta: [],
				gamma: [],
				none: [],
				locked: []
			});
			// Global commands
			fs.readdir('./commands/global', (err, files) => {
				if (err) return reject(console.log(err));
				files.forEach(file => {
					const req = require(`./${file}`);
					if (!req || !commands.global[req.permissions] || req.noDisplay) return;
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
						const req = require(`../../pmcommands/${file}`);
						if (!req || !commands.pm[req.permissions] || req.noDisplay) return;
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
					commands.room = { admin: [], coder: [], alpha: [], beta: [], gamma: [], none: [], locked: [] };
					files.forEach(file => {
						const req = require(`../${room}/${file}`);
						if (!req || !commands.room[req.permissions] || req.noDisplay) return;
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
			// eslint-disable-next-line max-len
			let out = '<hr><details><summary>Commands</summary><hr><details><summary><b>Global Commands</b></summary><hr>These commands can be used in any room.<hr>';
			['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
				if (commands.global[rank.toLowerCase()] && tools.hasPermission(rankLevel, rank.toLowerCase())) {
					// eslint-disable-next-line max-len
					out += `<details><summary>${rank} Commands</summary><hr>${tools.listify(commands.global[rank.toLowerCase()])}</details><hr>`;
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
			// eslint-disable-next-line max-len
			out += `<details><summary>Commands</summary><hr>${tools.listify(commands.global.locked) || 'None.'}</details><hr></details><hr><details><summary><b>PM Commands</b></summary><hr>These commands can be used in PMs.<hr>`;
			['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
				if (commands.pm[rank.toLowerCase()] && tools.hasPermission(gLevel, rank.toLowerCase())) {
					// eslint-disable-next-line max-len
					out += `<details><summary>${rank} Commands</summary><hr>${tools.listify(commands.pm[rank.toLowerCase()])}</details><hr>`;
				}
			});
			// eslint-disable-next-line max-len
			out += `<details><summary>Commands</summary><hr>${tools.listify(commands.pm.locked) || 'None.'}</details><hr></details><hr>`;
			if (commands.room) {
				// eslint-disable-next-line max-len
				out += `<details><summary><b>${Bot.rooms[room] ? Bot.rooms[room].title : tools.toName(room)} Commands</b></summary><hr>These commands can only be used in certain rooms.<hr>`;
				['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
					if (commands.room[rank.toLowerCase()] && tools.hasPermission(rankLevel, rank.toLowerCase())) {
						// eslint-disable-next-line max-len
						out += `<details><summary>${rank} Commands</summary><hr>${tools.listify(commands.room[rank.toLowerCase()])}</details><hr>`;
					}
				});
				// eslint-disable-next-line max-len
				out += `<details><summary>Commands</summary><hr>${tools.listify(commands.room.locked) || 'None.'}</details><hr></details><hr>`;
			}
			out += '</details><hr>';
			Bot.sendHTML(by, out);
		});
	}
};
