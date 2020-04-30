'use strict';
let http = require('http');
let SDClient = require('./client.js');
let Discord = require('discord.js');
let globaljs = require('./global.js');
let express = require('express');
let app, rerouter;
if (!config.prefix) return console.log('Missing configuration - prefix.');
if (!config.owner) return console.log('Missing configuration - owner.');
if (!config.auth.admin) return console.log('Missing administrator - administrator.');
if (config.site) {
	rerouter = require('./data/routes.js');
	app = express();
	rerouter.getRoutes(app);
	let server = app.listen(config.webPort, () => {
		console.log('The website\'s up!');
	});
}
let client;
let options = {serverid: config.serverid, loginServer: 'https://play.pokemonshowdown.com/~~' + config.serverid + '/action.php', nickName: config.nickName, pass: config.pass, avatar: (config.avatar) ? config.avatar : null, status: (config.status) ? config.status : null, autoJoin: config.autoJoin, app: app};
global.Bot = new SDClient(config.server, config.port, options);
Bot.connect();
if (config.useDiscord) {
	client = new Discord.Client();
	client.on('message', require('./discord.js').handler);
	client.login(config.token);
	client.on("ready", () => {
		console.log(`Connected to Discord.`);
		client.user.setActivity(config.activity);
	});
}
let standard_input = process.stdin;
standard_input.setEncoding('utf-8');
standard_input.on('data', function(data) {
	try {
		console.log(eval(data));
	} catch (e) {
		console.log(e);
	}
});
require('./minorhandler').handler(Bot);
Bot.on('chat', function (room, time, by, message) {
	Object.keys(Bot.jpcool[room]).forEach(user => Bot.jpcool[room][user][0]++);
	if (message.toLowerCase() === Bot.status.nickName.toLowerCase() + '?') return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot by ${config.owner}. My prefix is \`\`${prefix}\`\`. For more information, use \`\`${prefix}help\`\`.`);
	if (!Bot.auth.admin.includes(toId(by)) && message.toLowerCase().includes(' punts snom')) return Bot.say(room, `/me punts ${by.substr(1)}`);
	require('./chat.js').check(message, by, room);
	if (!message.startsWith(prefix) || ignoreRooms.includes(room)) return;
	let args = message.substr(prefix.length).split(' ');
	if (args[0].toLowerCase() == 'constructor') return Bot.say(room, `/me constructs a constrictor to constrict ${by.substr(1)}`);
	let commandName = tools.commandAlias(args.shift().toLowerCase());
	if (!commandName) return;
	if (['eval','output'].includes(commandName)) {
		if (!tools.hasPermission(toId(by), 'admin')) return Bot.say(room, 'Access denied.');
		try {
			let outp = eval(args.join(' '));
			switch (typeof outp) {
				case 'object': outp = (commandName == 'eval') ? JSON.stringify(outp) : JSON.stringify(outp, null, 2); break;
				case 'function': outp = outp.toString(); break;
				case 'undefined': outp = 'undefined'; break;
			}
			if (commandName === 'eval' || (!String(outp).split('\n')[1] && String(outp.length > 300))) Bot.say(room, String(outp).replaceAll(config.pass, 'UwU'));
			else Bot.say(room, '!code ' + String(outp).replaceAll(config.pass, 'UwU'));
		} catch (e) {
			console.log(e); Bot.say(room, e.message);
		}
		return;
	}
	fs.readdir('./commands/global', (e, files) => {
		if (e) return console.log(e);
		if (!files.includes(commandName + '.js')) {
			fs.readdir('./commands', (err, rfiles) => {
				if (err) return console.log(err);
				if (rfiles.includes(room)) {
					fs.readdir('./commands/' + room, (error, roomfiles) => {
						if (!roomfiles.includes(commandName + '.js')) return Bot.pm(by, 'It doesn\'t look like that command exists.');
						let commandRequire = require('./commands/' + room + '/' + commandName + '.js');
						tools.grantPseudo(by, room);
						if (!tools.hasPermission(toId(by), commandRequire.permissions, room)) {
							tools.spliceRank(by);
							return Bot.say(room, 'Access denied.');
						}
						try {
							if (cooldownObject[room] && cooldownObject[room][commandName]) return Bot.pm(by, 'Cooling down.');
							commandRequire.commandFunction(Bot, room, time, by, args, client);
							tools.setCooldown(commandName, room, commandRequire);
							return tools.spliceRank(by);
						} catch (err) {
							if (err) console.log(err);
						}
					});
				}
			});
			return;
		}
		else {
			let commandRequire = require('./commands/global/' + commandName + '.js');
			tools.grantPseudo(by, room);
			if (!tools.hasPermission(toId(by), commandRequire.permissions, room)) {
				tools.spliceRank(by);
				return Bot.say(room, 'Access denied.');
			}
			try {
				if (cooldownObject[room] && cooldownObject[room][commandName]) return Bot.pm(by, 'Cooling down.');
				commandRequire.commandFunction(Bot, room, time, by, args, client);
				tools.setCooldown(commandName, room, commandRequire);
				return tools.spliceRank(by);
			} catch (err) {
				if (err) console.log(err);
			}
		}
	});
});
Bot.on('pm', (by, message) => {
	if (message.startsWith('/invite')) for (let room of config.autoJoin) {if (message.startsWith(`/invite ${room}`)) return Bot.joinRooms([room])};
	if (Bot.userCallbacks[toId(by)]) {
		if (Bot.userCallbackData[toId(by)]) Bot.userCallbacks[toId(by)](by, message, ...Bot.userCallbackData[toId(by)]);
		else Bot.userCallbacks[toId(by)](by, message);
	}
	if (!message.startsWith(prefix)) {
		if (!Bot.auth.admin.includes(toId(by))) {
			Bot.pm('[' + time + '] ' + by + ': ' + message);
			if (Bot.lastPMHelp == toId(by)) return;
			Bot.lastPMHelp = toId(by);
			return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot by ${config.owner}. My prefix is \`\`${prefix}\`\`. For an overview of my commands, use \`\`${prefix}commands\`\`.`);
		}
		return;
	}
	let args = message.substr(prefix.length).split(' ');
	let commandName = tools.pmCommandAlias(args.shift());
	if (!commandName) return;
	if (['eval','output'].includes(commandName)) {
		if (!tools.hasPermission(toId(by), 'admin')) return Bot.say(room, 'Access denied.');
		try {
			let outp = eval(args.join(' '));
			switch (typeof outp) {
				case 'object': outp = JSON.stringify(outp, null, 2); break;
				case 'function': outp = outp.toString(); break;
				case 'undefined': outp = 'undefined'; break;
			}
			if ((!String(outp).split('\n')[1] && String(outp.length > 300))) Bot.pm(by, String(outp));
			else Bot.pm(by, '!code ' + String(outp));
		} catch (e) {console.log(e); Bot.pm(by, e.message)};
		return;
	}
	fs.readdir('./pmcommands', (err, files) => {
		if (err) {Bot.auth.admin.forEach(adm => Bot.pm(adm, err.message)); Bot.log(err)};
		let commands = files.map(file => file.slice(0, file.length - 3));
		if (!commands.includes(commandName)) return Bot.pm(by, `It doesn't look like that command exists.`);
		let commandRequire = require(`./pmcommands/${commandName}.js`);
		tools.grantPseudo(by);
		if (!tools.hasPermission(by, commandRequire.permissions)) {
			tools.spliceRank(by);
			return Bot.pm(by, 'Access denied.');
		}
		try {
			commandRequire.commandFunction(Bot, by, args, client);
			return tools.spliceRank(by);
		} catch (e) {
			if (e) {
				Bot.pm(by, e.message);
				return Bot.log(e);
			}
		}
	});
	return;
});
