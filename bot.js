'use strict';

if (!require('fs').existsSync('./config.js')) return console.log("Unable to find config.js! Please make sure you have copied config-example.js as config.js and added the data.");

const SDClient = require('./client.js');
const Discord = require('discord.js');
const globaljs = require('./global.js');
const express = require('express');
const app = express();

if (!config.prefix) return console.log('Missing configuration - prefix.');
if (!config.owner) return console.log('Missing configuration - owner.');
if (!config.auth.admin) return console.log('Missing administrator - administrator.');

let options = {serverid: config.serverid, loginServer: 'https://play.pokemonshowdown.com/~~' + config.serverid + '/action.php', nickName: config.nickName, pass: config.pass, avatar: (config.avatar) ? config.avatar : null, status: (config.status) ? config.status : null, autoJoin: config.autoJoin, app: app};
global.Bot = new SDClient(config.server, config.port, options);
if (config.useDiscord) global.client = new Discord.Client({partials: ['MESSAGE', 'REACTION']});

Bot.connect();

if (websiteLink) {
	Bot.router = require('./router.js')
	app.get(/.*/, (req, res) => Bot.router(req, res));
	Bot.server = app.listen(config.webPort, () => console.log(`The website\'s up at ${websiteLink}!`));
}

if (config.useDiscord) {
	if (!config.token) {
		console.log('Missing Discord token. If you wish to disable Discord, please set config.useDiscord to `false`.');
		process.exit();
	}
	client = new Discord.Client();
	client.on('message', require('./discord.js').handler);
	client.login(config.token);
	client.on("ready", () => {
		console.log(`Connected to Discord as ${client.user.tag}.`);
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
require('./battle.js').handler(Bot);

Bot.chatHandler = require('./chat.js');
Bot.on('chat', (room, time, by, message) => {
	return Bot.chatHandler(room, time, by, message);
});

Bot.on('pm', (by, message) => {
	if (message.startsWith('/invite')) {
		for (let room of config.autoJoin) {if (message.startsWith(`/invite ${room}`)) return Bot.joinRooms([room])};
		if (['%', '@', '&', '~'].includes(by.charAt(0)) || tools.hasPermission(by, 'beta')) return Bot.joinRooms([message.split('/invite')[1]]);
		return Bot.pm(by, "Sorry, only global staff can invite me.");
	}
	if (Bot.userCallbacks[toId(by)]) {
		if (Bot.userCallbackData[toId(by)]) Bot.userCallbacks[toId(by)](by, message, ...Bot.userCallbackData[toId(by)]);
		else Bot.userCallbacks[toId(by)](by, message);
	}
	if (!message.startsWith(prefix)) {
		if (!Bot.auth.admin.includes(toId(by))) {
			if (Bot.lastPMHelp == toId(by)) return;
			Bot.lastPMHelp = toId(by);
			return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot. My prefix is \`\`${prefix}\`\`. For an overview of my commands, use \`\`${prefix}commands\`\`.`);
		}
		return;
	}
	let args = message.substr(prefix.length).split(' ');
	let commandName = tools.pmCommandAlias(args.shift());
	if (!commandName) return;
	if (['eval','output'].includes(commandName)) {
		if (!tools.hasPermission(toId(by), 'admin')) return Bot.pm(by, 'Access denied.');
		try {
			let outp = eval(args.join(' '));
			switch (typeof outp) {
				case 'object': outp = JSON.stringify(outp, null, 2); break;
				case 'function': outp = outp.toString(); break;
				case 'undefined': outp = 'undefined'; break;
			}
			if ((!String(outp).split('\n')[1] && String(outp.length) > 300)) Bot.pm(by, String(outp));
			else Bot.pm(by, '!code ' + String(outp));
		} catch (e) {console.log(e); Bot.pm(by, e.message); Bot.log(e)};
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
			if (e) {Bot.pm(by, e.message); return Bot.log(e)};
		}
	});
	return;
});
