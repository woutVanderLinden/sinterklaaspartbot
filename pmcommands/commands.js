module.exports = {
	help: `Displays a list of commands that can be used by the user. For details of individual commands, use ${prefix}help (command)`,
	permissions: 'locked',
	commandFunction: function (Bot, by, args, client) {
		let commands = {global: null, pm: null};
		new Promise ((resolve, reject) => {
			Object.keys(commands).forEach(category => commands[category] = {admin: [], coder: [], alpha: [], beta: [], gamma: [], none: [], locked: []});
			// Global commands
			fs.readdir('./commands/global', (err, files) => {
				if (err) return reject(console.log(err));
				files.forEach(file => {
					let req = require(`../commands/global/${file}`);
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
						let req = require(`./${file}`);
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
			let out = '<HR><DETAILS><SUMMARY>Commands</SUMMARY><HR><DETAILS><SUMMARY><B>Global Commands</B></SUMMARY><HR>';
			['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
				if (commands.global[rank.toLowerCase()] && tools.hasPermission(by, rank.toLowerCase())) {
					out += `<DETAILS><SUMMARY>${rank} Commands</SUMMARY><HR>${tools.listify(commands.global[rank.toLowerCase()])}</DETAILS><HR>`;
				}
			});
			if (tools.hasPermission(by, 'none')) {
				commands.global.locked.push(...commands.global.none);
				commands.global.locked.sort();
				commands.pm.locked.push(...commands.pm.none);
				commands.pm.locked.sort();
			}
			out += `<DETAILS><SUMMARY>Commands</SUMMARY><HR>${tools.listify(commands.global.locked) || 'None.'}</DETAILS><HR></DETAILS><HR><DETAILS><SUMMARY><B>PM Commands</B></SUMMARY><HR>`;
			['Admin', 'Coder', 'Alpha', 'Beta', 'Gamma'].forEach(rank => {
				if (commands.pm[rank.toLowerCase()] && tools.hasPermission(by, rank.toLowerCase())) {
					out += `<DETAILS><SUMMARY>${rank} Commands</SUMMARY><HR>${tools.listify(commands.pm[rank.toLowerCase()])}</DETAILS><HR>`;
				}
			});
			out += `<DETAILS><SUMMARY>Commands</SUMMARY><HR>${tools.listify(commands.pm.locked) || 'None.'}</DETAILS><HR></DETAILS><HR>`;
			out += '</DETAILS><HR>';
			Bot.sendHTML(by, out);
		});
	}
}
